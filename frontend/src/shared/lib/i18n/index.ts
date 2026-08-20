import { idDictionary } from "./dictionaries/id";
import { enDictionary } from "./dictionaries/en";
import type { Dictionary, Language } from "./types";

export * from "./types";
export { idDictionary } from "./dictionaries/id";
export { enDictionary } from "./dictionaries/en";

export const dictionaries: Record<Language, Dictionary> = {
  id: idDictionary,
  en: enDictionary,
};

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang] ?? idDictionary;
}
