/**
 * ESLint-Konfiguration (Flat Config, ESLint >= 9)
 * ------------------------------------------------------------------
 * Benötigte Pakete: stehen in package.json (devDependencies), Installation per `npm install`.
 * Ausführen:
 *   npm run lint          (prüfen)
 *   npm run lint:fix      (automatisch korrigierbares beheben)
 * Formatierung übernimmt Prettier (npm run format), siehe docs/DOKUMENTATION.md, Kap. 3.3.
 *
 * Entscheidungen:
 *   - Basis: offizielle Empfehlungen von ESLint und eslint-plugin-vue (Vue 3).
 *   - Sicherheitsregeln (Anforderung 6): Code-Ausführung aus Strings und
 *     unsichere HTML-Ausgabe sind als Fehler gesetzt, damit sie nicht
 *     versehentlich in den Code gelangen.
 *   - Umgebungen getrennt: Browser-Code (src/), Node-Code (tests/, Konfigdateien).
 */
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Build-Ausgabe und Abhängigkeiten nie prüfen.
  { ignores: ['dist/**', 'node_modules/**'] },

  // Grundregeln für JavaScript.
  js.configs.recommended,

  // Vue-3-Regeln (erkennt auch .vue-Dateien mit <script src="…">).
  ...pluginVue.configs['flat/recommended'],

  // Browser-Code der Anwendung.
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },

  // Node-Code: Tests und Konfigurationsdateien.
  {
    files: ['tests/**/*.js', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },

  // Projektregeln.
  {
    rules: {
      // --- Sicherheit: keine Ausführung von Strings als Code ---
      'no-eval': 'error',
      'no-implied-eval': 'error', // z. B. setTimeout('code', 0)
      'no-new-func': 'error', // new Function('code')
      'no-script-url': 'error', // "javascript:"-URLs

      // --- Sicherheit: keine ungeschützte HTML-Ausgabe in Vue-Templates ---
      // Hinweis: Greift nur für Templates, die direkt in .vue-Dateien stehen.
      // Die Templates dieses Projekts liegen in getrennten .html-Dateien
      // (<template src>) und werden von ESLint nicht erfasst. Dort bleibt die
      // Regel "kein v-html" eine Review-Regel (siehe Dokumentation, Kap. 8).
      'vue/no-v-html': 'error',

      // --- Codequalität ---
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // --- Vue: zur Projektstruktur passend ---
      // Komponentennamen sind bewusst mehrteilig (AppHeader, LocalMenu, …);
      // die Wurzelkomponente "App" ist die einzige Ausnahme.
      'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
    },
  },

  // Muss LETZTER Eintrag sein: schaltet Formatierungsregeln ab, die mit Prettier
  // kollidieren würden (Aufgabenteilung: Prettier formatiert, ESLint prüft).
  prettier,
];
