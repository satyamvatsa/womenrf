import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANGUAGE_NAMES: Record<string, string> = {
  fa: 'Dari (Afghan Farsi)',
  ps: 'Pashto',
};

const TARGET_LOCALES = ['fa', 'ps'];

/**
 * Recursively extract all string values from a nested object,
 * returning a flat map of JSON-path keys to string values.
 */
function extractStrings(
  obj: unknown,
  prefix = '',
): Map<string, string> {
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
      const sub = extractStrings(value, prefix ? `${prefix}.${key}` : key);
      sub.forEach((v, k) => result.set(k, v));
    }
  }

  return result;
}

/**
 * Set a value at a JSON-path key in a nested object.
 * Supports paths like "heroTitle", "timeline[0].title", etc.
 */
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

const SKIP_PATTERNS = [
  /Url$/i, /url$/i, /Link$/i, /link$/i, /Image$/i, /image$/i,
  /Color$/i, /color$/i, /Class$/i, /class$/i, /Bg$/i, /bg$/i,
  /Icon$/i, /icon$/i, /^id$/, /^_id$/, /^slug$/, /^href$/,
  /^src$/, /^alt$/, /^type$/, /^status$/, /^categoryId$/,
  /^submittedAt$/, /^updatedAt$/, /^savedAt$/,
  /^path$/, /^key$/, /^platform$/,
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

/**
 * Translate a CMS section's data object from English to all target locales.
 * Returns { fa: translatedData, ps: translatedData }.
 */
export async function translateCmsSection(
  sectionData: unknown,
): Promise<Record<string, unknown>> {
  if (!process.env.OPENAI_API_KEY) return {};

  const stringMap = extractStrings(sectionData);

  const translatableEntries: [string, string][] = [];
  stringMap.forEach((value, key) => {
    if (!shouldSkipKey(key) && isTranslatableString(value)) {
      translatableEntries.push([key, value]);
    }
  });

  if (translatableEntries.length === 0) return {};

  const results: Record<string, unknown> = {};

  for (const locale of TARGET_LOCALES) {
    try {
      const allTranslated: Record<string, string> = {};

      for (let i = 0; i < translatableEntries.length; i += BATCH_SIZE) {
        const batch = translatableEntries.slice(i, i + BATCH_SIZE);
        const translated = await translateBatch(batch, locale);
        Object.assign(allTranslated, translated);
      }

      const translatedData = JSON.parse(JSON.stringify(sectionData));
      for (const [path, translatedValue] of Object.entries(allTranslated)) {
        setByPath(translatedData, path, translatedValue);
      }

      results[locale] = translatedData;
      console.log(`[CMS Translate] ${locale}: ${Object.keys(allTranslated).length} strings translated`);
    } catch (error) {
      console.error(`[CMS Translate] ${locale} failed:`, error instanceof Error ? error.message : error);
    }
  }

  return results;
}
