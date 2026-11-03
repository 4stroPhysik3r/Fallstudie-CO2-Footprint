/**
 * Automatisierte Tests für src/lib/logic.js.
 * Ausführen: npm test   (bzw. node --test "tests/*.test.js")
 *
 * Fokus: sicherheitsrelevantes Sanitizing, Filter/Sortierung und Richtungserkennung.
 * Die Tests brauchen weder Vue noch einen Browser – Beleg dafür, dass die Logik
 * unabhängig vom Framework ist.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { CO2_DATA as DATA } from '../src/data/co2Data.js';
import {
  filterRows,
  formatNumber,
  isAllowedOption,
  isRtlLocale,
  MAX_INPUT_LENGTH,
  resolveDirection,
  sanitizeInput,
  sortRows
} from '../src/lib/logic.js';

// ---------- Sanitizing / XSS ----------
test('sanitizeInput entfernt Script-Tags', () => {
  const out = sanitizeInput('<script>alert(1)</script>');
  assert.equal(out.includes('<'), false);
  assert.equal(out.includes('>'), false);
  assert.equal(out, 'scriptalert1script');
});

test('sanitizeInput entfernt Attribut-/Handler-Zeichen', () => {
  const out = sanitizeInput('" onmouseover="alert(1)" x=\'y\'');
  assert.match(out, /^[\p{L}\p{N} .-]*$/u);
  assert.equal(/["'=()<>`]/.test(out), false);
});

test('sanitizeInput behandelt javascript:-URLs und Vollbreiten-Zeichen', () => {
  // eslint-disable-next-line no-script-url
  assert.equal(sanitizeInput('javascript:alert(1)').includes(':'), false);
  assert.equal(sanitizeInput('＜script＞').includes('<'), false); // NFKC -> '<' -> entfernt
});

test('sanitizeInput erhält Umlaute, arabische Schrift, Ziffern', () => {
  assert.equal(sanitizeInput('Österreich-Süd 2024'), 'Österreich-Süd 2024');
  assert.equal(sanitizeInput('مصر'), 'مصر');
});

test('sanitizeInput begrenzt Länge und akzeptiert nur Strings', () => {
  assert.equal(sanitizeInput('a'.repeat(500)).length, MAX_INPUT_LENGTH);
  assert.equal(sanitizeInput(null), '');
  assert.equal(sanitizeInput({ toString: () => '<b>' }), '');
});

test('isAllowedOption akzeptiert nur Whitelist-Werte', () => {
  assert.equal(isAllowedOption('company', ['', 'country', 'company']), true);
  assert.equal(isAllowedOption('<img src=x>', ['', 'country', 'company']), false);
});

// ---------- Daten ----------
test('Datensatz: 39 Einträge, eindeutige IDs, eingefroren', () => {
  assert.equal(DATA.length, 39);
  assert.equal(new Set(DATA.map((r) => r.id)).size, DATA.length);
  assert.equal(Object.isFrozen(DATA), true);
  assert.equal(Object.isFrozen(DATA[0]), true);
});

// ---------- Filter ----------
test('filterRows: Land, Typ, Jahr und Suchtext kombinierbar', () => {
  const rows = filterRows(DATA, {
    country: 'Deutschland',
    type: 'company',
    year: '2024',
    query: 'nord'
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, 'Nordwind Energie AG');
});

test('filterRows: leere Filter liefern alle Zeilen', () => {
  assert.equal(filterRows(DATA, {}).length, DATA.length);
});

test('filterRows: Suche ist unabhängig von Groß-/Kleinschreibung', () => {
  assert.equal(filterRows(DATA, { query: 'RHEINCHEMIE' }).length, 3);
});

// ---------- Sortierung ----------
test('sortRows sortiert numerisch absteigend und verändert das Original nicht', () => {
  const copy = DATA.slice();
  const sorted = sortRows(DATA, 'emissionsMt', 'desc');
  assert.ok(sorted[0].emissionsMt >= sorted[1].emissionsMt);
  assert.deepEqual(DATA.slice(), copy);
  assert.equal(sorted[0].name, 'Indien');
});

test('sortRows sortiert Text aufsteigend sprachsensitiv', () => {
  const sorted = sortRows(DATA, 'name', 'asc', 'de');
  assert.equal(sorted[0].name, 'Atlantik Zement S.A.');
});

// ---------- Schriftrichtung ----------
test('isRtlLocale erkennt RTL-Sprachen', () => {
  assert.equal(isRtlLocale('ar-EG'), true);
  assert.equal(isRtlLocale('he'), true);
  assert.equal(isRtlLocale('de-DE'), false);
  assert.equal(isRtlLocale(undefined), false);
});

test('resolveDirection: manueller Modus hat Vorrang', () => {
  assert.equal(resolveDirection('auto', 'ar'), 'rtl');
  assert.equal(resolveDirection('auto', 'en-US'), 'ltr');
  assert.equal(resolveDirection('ltr', 'ar'), 'ltr');
  assert.equal(resolveDirection('rtl', 'de'), 'rtl');
});

// ---------- Format ----------
test('formatNumber nutzt deutsche Schreibweise', () => {
  assert.equal(formatNumber(1050, 'de'), '1.050,0');
});
