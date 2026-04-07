/**
 * Translates all UI strings from en.ts into Dari (fa) and Pashto (ps) via OpenAI,
 * then saves all three locales into the MongoDB `translations` collection.
 *
 * Usage:  npx tsx scripts/translate-ui-strings.ts
 *
 * Documents stored as:
 *   { _id: "en", strings: { "hero.title": "...", ... }, updatedAt: Date }
 *   { _id: "fa", strings: { "hero.title": "<translated>", ... }, updatedAt: Date }
 *   { _id: "ps", strings: { "hero.title": "<translated>", ... }, updatedAt: Date }
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
          `Translate the JSON values from English to ${langName}.`,
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
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Add it to your .env file.');
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set. Add it to your .env file.');
    process.exit(1);
  }

  const allKeys = Object.keys(en);
  console.log(`Source: en.ts — ${allKeys.length} keys`);

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB');

  const db = client.db(DB_NAME);
  const coll = db.collection(COLLECTION);

  // 1. Seed English strings
  await coll.updateOne(
    { _id: 'en' as any },
    { $set: { strings: en, updatedAt: new Date() } },
    { upsert: true },
  );
  console.log(`  [en] upserted ${allKeys.length} keys\n`);

  // 2. Translate to each target locale via OpenAI
  const entries = Object.entries(en);

  for (const locale of TARGET_LOCALES) {
    console.log(`[TRANSLATE] ${locale} — ${entries.length} strings`);
    try {
      const translated: Record<string, string> = {};

      for (let i = 0; i < entries.length; i += BATCH_SIZE) {
        const batch = entries.slice(i, i + BATCH_SIZE);
        const result = await translateBatch(batch, locale);
        Object.assign(translated, result);
        const done = Math.min(i + BATCH_SIZE, entries.length);
        process.stdout.write(`  ${locale}: ${done}/${entries.length} done\r`);
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
      console.log(`  [${locale}] saved ${Object.keys(translated).length} keys`);
    } catch (error) {
      console.error(`  [${locale}] FAILED:`, error instanceof Error ? error.message : error);
    }
  }

  await client.close();
  console.log('\nDone! All UI strings translated via OpenAI and saved to MongoDB.');
}

main().catch(console.error);
