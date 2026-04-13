/**
 * Post-deploy script: delta-only translation.
 * Only translates NEW or CHANGED strings — existing translations are preserved.
 * 
 * Usage: npx tsx scripts/post-deploy-translate.ts
 */

import 'dotenv/config';
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';
import en from '../src/lib/translations/en';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB_NAME || 'womenrf';
const COLLECTION = 'translations';

const TARGET_LOCALES = ['fa', 'ps'];
const LANGUAGE_NAMES: Record<string, string> = {
  fa: 'Dari (Afghan Farsi)',
  ps: 'Pashto',
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BATCH_SIZE = 40;

async function translateBatch(
  entries: [string, string][],
  targetLocale: string,
): Promise<Record<string, string>> {
  const langName = LANGUAGE_NAMES[targetLocale] || targetLocale;
  const inputObj: Record<string, string> = {};
  for (const [k, v] of entries) inputObj[k] = v;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: [
          `You are a professional translator for a women's rights organization website (Women's Rights First / WRF).`,
          `IMPORTANT: This is WEBSITE CONTENT, including buttons, headings, and call-to-action text.`,
          `Translate the JSON values from English to ${langName}.`,
          `DO NOT translate literally. Instead, adapt the meaning so it sounds natural and native in ${langName}.`,
          `For UI elements (buttons, links, headings): Use short, natural phrases commonly used on websites. Focus on meaning, not word-for-word translation.`,
          `CRITICAL EXAMPLES - translate by MEANING, not words:`,
          `- "Read our story" → in Pashto: "مونږ نږدې وپیژنئ" (Get to know us) or "زمونږ په اړه نور ولولئ" (Read more about us), NOT "زمونږ کیسه ولولئ"`,
          `- "Read our story" → in Dari: "با ما آشنا شوید" (Get to know us) or "درباره ما بیشتر بخوانید" (Read more about us), NOT "داستان ما را بخوانید"`,
          `- "Learn more" → use natural website phrases like "بیشتر بدانید" (Dari) or "نور معلومات" (Pashto)`,
          `Maintain a formal, respectful, and human-rights appropriate tone.`,
          `Keep all JSON keys exactly the same — only translate the values.`,
          `Preserve any markdown formatting (**bold**, *italic*, \\n newlines, bullet points).`,
          `Transliterate people's names into the target script (e.g. "Shabnam Salehi" → "شبنم صالحی" in Dari/Pashto). Do NOT translate organization names (like "WRF", "UNESCO", "PayPal"), URLs, or email addresses.`,
          `Keep numbers in their original form unless the target language conventionally uses different numerals.`,
          `Return ONLY a valid JSON object with the same keys and translated values.`,
        ].join(' '),
      },
      { role: 'user', content: JSON.stringify(inputObj) },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');
  return JSON.parse(content) as Record<string, string>;
}

async function main() {
  console.log('[Post-Deploy] Starting delta-only translation...');

  if (!MONGODB_URI) {
    console.error('[Post-Deploy] MONGODB_URI is not set. Skipping.');
    process.exit(0);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error('[Post-Deploy] OPENAI_API_KEY is not set. Skipping.');
    process.exit(0);
  }

  const allKeys = Object.keys(en);
  console.log(`[Post-Deploy] Source: en.ts — ${allKeys.length} keys`);

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('[Post-Deploy] Connected to MongoDB');

  const db = client.db(DB_NAME);
  const coll = db.collection(COLLECTION);

  await coll.updateOne(
    { _id: 'en' as any },
    { $set: { strings: en, updatedAt: new Date() } },
    { upsert: true },
  );
  console.log(`[Post-Deploy] [en] upserted ${allKeys.length} keys`);

  const entries = Object.entries(en);

  for (const locale of TARGET_LOCALES) {
    try {
      // Load existing translations from DB
      const existingDoc = await coll.findOne({ _id: locale as any });
      const existing: Record<string, string> = existingDoc?.strings || {};

      // Find only new or changed strings
      const toTranslate: [string, string][] = [];
      const preserved: Record<string, string> = {};

      for (const [key, enValue] of entries) {
        if (existing[key] && existing[`__src__${key}`] === enValue) {
          preserved[key] = existing[key];
          preserved[`__src__${key}`] = existing[`__src__${key}`];
        } else {
          toTranslate.push([key, enValue]);
        }
      }

      console.log(`[Post-Deploy] ${locale}: ${toTranslate.length} new/changed, ${Object.keys(preserved).filter(k => !k.startsWith('__src__')).length} preserved`);

      if (toTranslate.length === 0) {
        console.log(`[Post-Deploy] [${locale}] No changes — skipping translation`);
        continue;
      }

      const translated: Record<string, string> = { ...preserved };

      for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
        const batch = toTranslate.slice(i, i + BATCH_SIZE);
        const result = await translateBatch(batch, locale);
        Object.assign(translated, result);
        const done = Math.min(i + BATCH_SIZE, toTranslate.length);
        console.log(`[Post-Deploy] ${locale}: ${done}/${toTranslate.length} done`);
      }

      // Store source English values for future delta checks
      for (const [key, enValue] of entries) {
        translated[`__src__${key}`] = enValue;
      }

      // Fill in any keys OpenAI may have missed with the English fallback
      for (const key of allKeys) {
        if (!translated[key]) {
          translated[key] = en[key];
        }
      }

      await coll.updateOne(
        { _id: locale as any },
        { $set: { strings: translated, updatedAt: new Date() } },
        { upsert: true },
      );

      const actualKeys = Object.keys(translated).filter(k => !k.startsWith('__src__')).length;
      console.log(`[Post-Deploy] [${locale}] saved ${actualKeys} keys`);
    } catch (error) {
      console.error(`[Post-Deploy] [${locale}] FAILED:`, error instanceof Error ? error.message : error);
    }
  }

  await client.close();
  console.log('[Post-Deploy] Translation complete!');
}

main().catch((err) => {
  console.error('[Post-Deploy] Error:', err);
  process.exit(0);
});
