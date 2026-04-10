import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANGUAGE_NAMES: Record<string, string> = {
  fa: 'Dari (Afghan Farsi)',
  ps: 'Pashto',
};

const BATCH_SIZE = 40;

/**
 * Translate a batch of key-value pairs from English to the target locale.
 * Returns the same keys with translated values.
 */
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
          `Do NOT translate proper nouns (people's names, organization names like "WRF", "UNESCO", "PayPal"), URLs, or email addresses.`,
          `Keep numbers in their original form unless the target language conventionally uses different numerals.`,
          `Return ONLY a valid JSON object with the same keys and translated values.`,
        ].join(' '),
      },
      {
        role: 'user',
        content: JSON.stringify(inputObj),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  try {
    return JSON.parse(content) as Record<string, string>;
  } catch {
    throw new Error(`Failed to parse OpenAI response as JSON: ${content.slice(0, 200)}`);
  }
}

/**
 * Translate all English strings to the target locale, processing in batches.
 * Returns the full translated map.
 */
export async function translateAll(
  englishStrings: Record<string, string>,
  targetLocale: string,
  onProgress?: (done: number, total: number) => void,
): Promise<Record<string, string>> {
  const entries = Object.entries(englishStrings);
  const total = entries.length;
  const result: Record<string, string> = {};
  let done = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const translated = await translateBatch(batch, targetLocale);

    for (const [key, value] of Object.entries(translated)) {
      result[key] = value;
    }

    done += batch.length;
    onProgress?.(done, total);
  }

  return result;
}
