/**
 * Reine Logikfunktionen (ohne DOM, ohne Framework) – ES-Modul
 * ------------------------------------------------------------------
 * Entscheidung: Sanitizing, Filtern, Sortieren und Richtungserkennung liegen
 * getrennt von Vue. Vorteile:
 *   - ohne Browser und ohne Vue testbar (tests/logic.test.js, nur Node),
 *   - Framework austauschbar: die Datei hat keine Abhängigkeit zu Vue,
 *   - sicherheitsrelevanter Code liegt an einer Stelle und ist prüfbar.
 */

/** Maximale Länge von Freitext-Eingaben. */
export const MAX_INPUT_LENGTH = 50;

/** Sprachcodes mit rechts-nach-links-Schrift (ISO 639-1/-3). */
const RTL_LANGS = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ug', 'yi', 'dv', 'ckb'];

/**
 * Bereinigt Freitext per WHITELIST (erlaubt: Buchstaben aller Schriften,
 * Ziffern, Leerzeichen, Punkt, Bindestrich).
 *
 * Whitelist statt Blacklist: Eine Blacklist ("<" und ">" entfernen) ist
 * unvollständig, sobald Angreifer andere Zeichen oder Kodierungen nutzen.
 * Unicode-Eigenschaften (\p{L}, \p{N}) erhalten Umlaute, Arabisch usw.
 *
 * @param {*} value Rohwert aus einem Eingabefeld
 * @param {number} [maxLen] maximale Länge
 * @returns {string} bereinigter Text
 */
export function sanitizeInput(value, maxLen = MAX_INPUT_LENGTH) {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKC') // Varianten wie "＜" (Vollbreite) auf Normalform bringen
    .replace(/[^\p{L}\p{N} .-]/gu, '') // alles außer der Whitelist entfernen
    .replace(/\s{2,}/g, ' ') // Mehrfach-Leerzeichen zusammenfassen
    .slice(0, maxLen);
}

/**
 * Prüft, ob ein Wert (z. B. aus einem <select>) in der erlaubten Liste steht.
 * Verhindert, dass in den DevTools manipulierte Werte verarbeitet werden.
 */
export function isAllowedOption(value, allowed) {
  return allowed.includes(value);
}

/**
 * Filtert Zeilen nach Name/Unternehmen, Land, Typ und Jahr.
 * Rein lesend; vergleicht nur Strings – es wird nichts ausgewertet.
 *
 * @param {Array<Object>} rows
 * @param {{query?:string,country?:string,type?:string,year?:string}} f
 */
export function filterRows(rows, f) {
  const query = (f.query || '').toLocaleLowerCase();
  return rows.filter((r) => {
    if (f.country && r.country !== f.country) return false;
    if (f.type && r.type !== f.type) return false;
    if (f.year && String(r.year) !== String(f.year)) return false;
    return !(query && !r.name.toLocaleLowerCase().includes(query));
  });
}

/**
 * Sortiert Zeilen stabil nach einer Spalte. Strings sprachsensible
 * (Intl.Collator: "Österreich" steht bei "O"), Zahlen numerisch.
 * Bei Gleichstand entscheidet der Name (reproduzierbare Reihenfolge).
 * Gibt eine NEUE Liste zurück (Original unverändert).
 */
export function sortRows(rows, key, direction, locale = 'de') {
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  const factor = direction === 'desc' ? -1 : 1;
  return rows.slice().sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    let cmp =
      typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : collator.compare(String(va), String(vb));
    if (cmp === 0) cmp = collator.compare(a.name, b.name);
    return cmp * factor;
  });
}

/** Zahl nach Locale formatieren (z. B. 1.050,0 vs. 1,050.0). */
export function formatNumber(n, locale = 'de') {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(n);
}

/** Wird die Sprache (BCP-47-Tag, z. B. "ar-EG") rechts-nach-links geschrieben? */
export function isRtlLocale(tag) {
  if (typeof tag !== 'string' || !tag) return false;
  return RTL_LANGS.includes(tag.toLowerCase().split('-')[0]);
}

/**
 * Ermittelt die Textrichtung: 'auto' folgt der Browsersprache,
 * 'ltr'/'rtl' sind manuelle Übersteuerungen.
 * @returns {'ltr'|'rtl'}
 */
export function resolveDirection(mode, localeTag) {
  if (mode === 'ltr' || mode === 'rtl') return mode;
  return isRtlLocale(localeTag) ? 'rtl' : 'ltr';
}
