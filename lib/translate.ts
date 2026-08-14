/**
 * DeepL translation helper. Uses the free API endpoint
 * (https://api-free.deepl.com) — the free-tier key ends with `:fx`.
 *
 * Content is authored in Russian in the admin panel; on save it is translated
 * into English and Spanish. So the source language is RU and the targets are
 * EN and ES.
 */

const DEEPL_TARGETS = { en: "EN-US", es: "ES" } as const;
export type TargetLocale = keyof typeof DEEPL_TARGETS;

function endpoint() {
  const key = process.env.DEEPL_API_KEY ?? "";
  const host = key.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  return { url: `https://${host}/v2/translate`, key };
}

async function translateBatch(
  texts: string[],
  target: TargetLocale,
  sourceLang: string,
): Promise<string[]> {
  const { url, key } = endpoint();
  if (!key) throw new Error("DEEPL_API_KEY is not set");

  const indexed = texts.map((t, i) => ({ t, i })).filter((x) => x.t.trim());
  if (indexed.length === 0) return texts.slice();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: indexed.map((x) => x.t),
      source_lang: sourceLang,
      target_lang: DEEPL_TARGETS[target],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DeepL error ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as { translations: { text: string }[] };
  const out = texts.slice();
  indexed.forEach((x, k) => {
    out[x.i] = data.translations[k]?.text ?? x.t;
  });
  return out;
}

/**
 * Translates a record of `{ field: sourceText }` into EN and ES.
 * `sourceLang` defaults to Russian (the admin authoring language).
 * Returns `{ en: {...}, es: {...} }` preserving the same keys.
 */
export async function translateFields(
  fields: Record<string, string | null | undefined>,
  sourceLang = "RU",
): Promise<Record<TargetLocale, Record<string, string>>> {
  const keys = Object.keys(fields);
  const values = keys.map((k) => fields[k] ?? "");

  const [en, es] = await Promise.all([
    translateBatch(values, "en", sourceLang),
    translateBatch(values, "es", sourceLang),
  ]);

  const build = (arr: string[]) =>
    Object.fromEntries(keys.map((k, i) => [k, arr[i]])) as Record<string, string>;

  return { en: build(en), es: build(es) };
}

export function isTranslationConfigured(): boolean {
  return Boolean(process.env.DEEPL_API_KEY);
}
