/**
 * Delta-only CMS section translation.
 * Only translates NEW or CHANGED strings — existing translations are preserved.
 *
 * Usage: npx tsx scripts/translate-all-sections.ts
 */

import 'dotenv/config';
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB_NAME || 'womenrf';
const CONTENT_COLLECTION = 'content';

const TRANSLATABLE_SECTIONS = [
  'about',
  'homepage',
  'header',
  'footer',
  'privacy-policy',
  'donations',
  'donation-options',
  'blog-posts',
  'news',
  'programs',
  'testimonials',
  'founders',
  'team',
  'vacancies',
  'volunteers',
  'partnerships',
  'faq',
  'faqs',
  'events',
];

const TARGET_LOCALES = ['fa', 'ps'];

const LANGUAGE_NAMES: Record<string, string> = {
  fa: 'Dari (Afghan Farsi)',
  ps: 'Pashto',
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SKIP_PATTERNS = [
  /Url$/i, /url$/i, /Link$/i, /link$/i, /Image$/i, /image$/i,
  /Color$/i, /color$/i, /Class$/i, /class$/i, /Bg$/i, /bg$/i,
  /Icon$/i, /icon$/i, /^id$/, /^_id$/, /^slug$/, /^href$/,
  /^src$/, /^alt$/, /^type$/, /^status$/, /^categoryId$/,
  /^submittedAt$/, /^updatedAt$/, /^savedAt$/, /^platform$/,
  /^path$/, /^key$/,
  /^backgroundColor$/, /^textColor$/, /^titleClass$/,
  /^__translationSources$/,
];

function shouldSkipKey(path: string): boolean {
  const lastPart = path.split('.').pop()?.replace(/\[\d+\]$/, '') || '';
  return SKIP_PATTERNS.some((p) => p.test(lastPart));
}

function isTranslatableString(value: string): boolean {
  if (value.length < 2) return false;
  if (/^https?:\/\//.test(value)) return false;
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return false;
  if (/^\d+(\.\d+)?$/.test(value)) return false;
  if (/^\/[a-zA-Z0-9_\-/.%]+$/.test(value)) return false;
  if (/^[a-zA-Z0-9_@#\-]+$/.test(value) && !value.includes(' ') && /[_\-@#/]/.test(value)) return false;
  if (/^[a-f0-9\-]{20,}$/i.test(value)) return false;
  return true;
}

function extractStrings(obj: unknown, prefix = ''): Map<string, string> {
  const result = new Map<string, string>();
  if (obj === null || obj === undefined) return result;
  if (typeof obj === 'string') {
    if (obj.trim().length > 0) result.set(prefix, obj);
    return result;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      const sub = extractStrings(item, `${prefix}[${i}]`);
      sub.forEach((v, k) => result.set(k, v));
    });
    return result;
  }
  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === '__translationSources') continue;
      const sub = extractStrings(value, prefix ? `${prefix}.${key}` : key);
      sub.forEach((v, k) => result.set(k, v));
    }
  }
  return result;
}

function setByPath(obj: any, path: string, value: string): void {
  const parts: (string | number)[] = [];
  const regex = /([^.\[\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    parts.push(match[2] !== undefined ? parseInt(match[2], 10) : match[1]);
  }
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    if (current[part] === undefined) {
      current[part] = typeof nextPart === 'number' ? [] : {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

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
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const coll = db.collection(CONTENT_COLLECTION);

  for (const section of TRANSLATABLE_SECTIONS) {
    const doc = await coll.findOne({ _id: section as any });
    if (!doc?.data) {
      console.log(`[SKIP] ${section} — no data in DB`);
      continue;
    }

    const sectionData = doc.data;
    const stringMap = extractStrings(sectionData);
    const translatableEntries: [string, string][] = [];
    stringMap.forEach((value, key) => {
      if (!shouldSkipKey(key) && isTranslatableString(value)) {
        translatableEntries.push([key, value]);
      }
    });

    if (translatableEntries.length === 0) {
      console.log(`[SKIP] ${section} — no translatable strings`);
      continue;
    }

    console.log(`\n[TRANSLATE] ${section} — ${translatableEntries.length} strings`);

    for (const locale of TARGET_LOCALES) {
      try {
        // Load existing translated data for delta comparison
        const translatedSectionId = `${section}__${locale}`;
        const existingDoc = await coll.findOne({ _id: translatedSectionId as any });
        const existingSources: Record<string, string> = existingDoc?.data?.__translationSources || {};
        const existingStrings = existingDoc?.data ? extractStrings(existingDoc.data) : new Map<string, string>();

        // Only translate new or changed strings
        const newEntries: [string, string][] = [];
        const preserved: Record<string, string> = {};

        for (const [path, enValue] of translatableEntries) {
          const prevSource = existingSources[path];
          const existingTranslation = existingStrings.get(path);

          if (prevSource === enValue && existingTranslation) {
            preserved[path] = existingTranslation;
          } else {
            newEntries.push([path, enValue]);
          }
        }

        console.log(`  ${locale}: ${newEntries.length} new/changed, ${Object.keys(preserved).length} preserved`);

        if (newEntries.length === 0) {
          console.log(`  ${locale}: No changes — skipping`);
          continue;
        }

        const allTranslated: Record<string, string> = { ...preserved };

        for (let i = 0; i < newEntries.length; i += BATCH_SIZE) {
          const batch = newEntries.slice(i, i + BATCH_SIZE);
          const translated = await translateBatch(batch, locale);
          Object.assign(allTranslated, translated);
          process.stdout.write(`  ${locale}: ${Math.min(i + BATCH_SIZE, newEntries.length)}/${newEntries.length} done\r`);
        }

        const translatedData = JSON.parse(JSON.stringify(sectionData));
        for (const [path, translatedValue] of Object.entries(allTranslated)) {
          setByPath(translatedData, path, translatedValue);
        }

        // Store English sources for future delta checks
        const sources: Record<string, string> = {};
        for (const [path, enValue] of translatableEntries) {
          sources[path] = enValue;
        }
        translatedData.__translationSources = sources;

        await coll.updateOne(
          { _id: translatedSectionId as any },
          { $set: { data: translatedData, updatedAt: new Date() } },
          { upsert: true },
        );

        console.log(`  ${locale}: ${newEntries.length} translated, ${Object.keys(allTranslated).length} total saved as ${translatedSectionId}`);
      } catch (error) {
        console.error(`  ${locale}: FAILED —`, error instanceof Error ? error.message : error);
      }
    }
  }

  await client.close();
  console.log('\nDone!');
}

main().catch(console.error);
