/**
 * Fiktive CO₂-Emissionsdaten
 * ------------------------------------------------------------------
 * ACHTUNG: Alle Werte und alle Unternehmensnamen sind frei erfunden und
 * dienen ausschließlich der Demonstration. Sie sind KEINE realen Messwerte.
 *
 * Datenmodell: Länder und Unternehmen liegen in EINER flachen Liste. Ein
 * Eintrag = eine Entität in einem Jahr. So genügt eine Tabelle, die nach Land
 * und Unternehmen filter- und sortierbar ist, ohne Verschachtelung.
 *
 * Felder je Zeile:
 *   id           eindeutiger Schlüssel (für v-for :key)
 *   name         Name des Landes bzw. Unternehmens
 *   type         'country' | 'company'
 *   country      Land (bei Ländern identisch mit name)
 *   year         Berichtsjahr
 *   emissionsMt  Emissionen in Megatonnen CO₂ (Mt)
 *
 * Als ES-Modul: Vite bündelt die Daten in das Skript-Bundle.
 */

const YEARS = [2022, 2023, 2024];

// Rohdaten: [Name, Typ, Land, [Wert 2022, Wert 2023, Wert 2024]]
const ENTITIES = [
  // Länder
  ['Deutschland', 'country', 'Deutschland', [710, 676, 655]],
  ['Frankreich', 'country', 'Frankreich', [372, 352, 341]],
  ['Brasilien', 'country', 'Brasilien', [1050, 1085, 1102]],
  ['Japan', 'country', 'Japan', [1060, 1030, 1011]],
  ['Kanada', 'country', 'Kanada', [584, 590, 579]],
  ['Indien', 'country', 'Indien', [2650, 2790, 2905]],

  // Unternehmen (fiktiv)
  ['Nordwind Energie AG', 'company', 'Deutschland', [96.4, 91.2, 85.7]],
  ['Rheinchemie SE', 'company', 'Deutschland', [28.3, 27.1, 26.5]],
  ['Atlantik Zement S.A.', 'company', 'Frankreich', [21.7, 20.9, 20.2]],
  ['Solmar Logistik Ltda.', 'company', 'Brasilien', [14.2, 15.0, 15.6]],
  ['Kaiyo Schwerindustrie K.K.', 'company', 'Japan', [62.8, 60.1, 58.4]],
  ['Prairie Oil and Gas Inc.', 'company', 'Kanada', [73.5, 74.9, 72.3]],
  ['Ganga Stahlwerke Ltd.', 'company', 'Indien', [88.1, 93.6, 99.2]]
];

// Auf flache Zeilenliste abbilden (eine Zeile je Entität und Jahr).
const rows = ENTITIES.flatMap(([name, type, country, values], i) =>
  YEARS.map((year, j) => ({
    id: `e${i}-${year}`,
    name,
    type,
    country,
    year,
    emissionsMt: values[j]
  }))
);

// Einfrieren: verhindert versehentliche Änderungen der Quelldaten zur Laufzeit.
export const CO2_DATA = Object.freeze(rows.map((r) => Object.freeze(r)));
