/**
 * Composable "useEmissionsTable": Zustand und Ableitungen der Datentabelle
 * ------------------------------------------------------------------
 * Entscheidung: Zustand und Regeln stehen in einem Composable statt in der
 * Komponente. Die Komponente (EmissionsTable.*) kümmert sich nur um die
 * Darstellung; die eigentliche Fachlogik liegt in src/lib/logic.js (testbar).
 *
 * Sicherheitsprinzip:
 *   - Eingaben laufen IMMER durch sanitizeInput / isAllowedOption.
 *   - Es gibt kein v-html und kein innerHTML; Vue escaped {{ }} automatisch.
 */
import { ref, computed } from 'vue';
import { CO2_DATA } from '../data/co2Data.js';
import {
  MAX_INPUT_LENGTH,
  sanitizeInput,
  isAllowedOption,
  filterRows,
  sortRows,
  formatNumber,
} from '../lib/logic.js';

// Spaltendefinition: die Kopfzeile wird daraus generiert (keine Wiederholung im Template).
const COLUMNS = [
  { key: 'name', label: 'Name', numeric: false },
  { key: 'type', label: 'Typ', numeric: false },
  { key: 'country', label: 'Land', numeric: false },
  { key: 'year', label: 'Jahr', numeric: true },
  { key: 'emissionsMt', label: 'CO₂ (Mt)', numeric: true },
];
const TYPE_LABELS = { country: 'Land', company: 'Unternehmen' };

// Erlaubte Auswahlwerte, aus den Daten abgeleitet (Whitelist für <select>).
const COUNTRIES = [...new Set(CO2_DATA.map((r) => r.country))].sort((a, b) =>
  a.localeCompare(b, 'de'),
);
const YEARS = [...new Set(CO2_DATA.map((r) => String(r.year)))].sort().reverse();

export function useEmissionsTable() {
  // ----- Zustand -----------------------------------------------------
  const query = ref(''); // bereinigter Suchtext (Name/Unternehmen)
  const queryChanged = ref(false); // wurden unzulässige Zeichen entfernt? (Hinweis)
  const country = ref(''); // '' = alle
  const type = ref(''); // '' = alle | 'country' | 'company'
  const year = ref(''); // '' = alle
  const sortKey = ref('emissionsMt');
  const sortDir = ref('desc');

  // ----- abgeleitete Werte (werden von Vue automatisch zwischengespeichert) ----
  const rows = computed(() =>
    sortRows(
      filterRows(CO2_DATA, {
        query: query.value,
        country: country.value,
        type: type.value,
        year: year.value,
      }),
      sortKey.value,
      sortDir.value,
      'de',
    ),
  );

  /** Zeile mit dem höchsten Wert in der aktuellen Auswahl (Kennzahlkarte). */
  const topRow = computed(() =>
    rows.value.reduce((best, r) => (!best || r.emissionsMt > best.emissionsMt ? r : best), null),
  );

  // ----- Eingabebehandlung (Sicherheit) -------------------------------
  /** Suchfeld: Eingabe bereinigen und dem Nutzer ggf. mitteilen. */
  function setQuery(raw) {
    const clean = sanitizeInput(raw);
    // Hinweis nur, wenn mehr als Länge/Leerraum geändert wurde.
    queryChanged.value =
      clean !==
      String(raw)
        .slice(0, MAX_INPUT_LENGTH)
        .replace(/\s{2,}/g, ' ');
    query.value = clean;
  }
  /** <select>-Felder: nur Werte aus der Whitelist akzeptieren, sonst "Alle". */
  function setCountry(v) {
    country.value = isAllowedOption(v, ['', ...COUNTRIES]) ? v : '';
  }
  function setType(v) {
    type.value = isAllowedOption(v, ['', 'country', 'company']) ? v : '';
  }
  function setYear(v) {
    year.value = isAllowedOption(v, ['', ...YEARS]) ? v : '';
  }
  function resetFilters() {
    query.value = '';
    queryChanged.value = false;
    country.value = '';
    type.value = '';
    year.value = '';
  }

  // ----- Sortierung ---------------------------------------------------
  function sortBy(key) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'; // gleiche Spalte: Richtung umkehren
    } else {
      sortKey.value = key;
      sortDir.value = key === 'emissionsMt' || key === 'year' ? 'desc' : 'asc'; // sinnvolle Startrichtung
    }
  }
  /** aria-sort für Screenreader (Zustand des Tabellenkopfs). */
  function ariaSort(key) {
    if (sortKey.value !== key) return 'none';
    return sortDir.value === 'asc' ? 'ascending' : 'descending';
  }
  function sortIcon(key) {
    if (sortKey.value !== key) return '↕';
    return sortDir.value === 'asc' ? '▲' : '▼';
  }

  const fmt = (n) => formatNumber(n, 'de');

  return {
    columns: COLUMNS,
    typeLabels: TYPE_LABELS,
    countries: COUNTRIES,
    years: YEARS,
    query,
    queryChanged,
    country,
    type,
    year,
    rows,
    topRow,
    setQuery,
    setCountry,
    setType,
    setYear,
    resetFilters,
    sortBy,
    ariaSort,
    sortIcon,
    fmt,
  };
}
