/**
 * Vite-Konfiguration
 * ------------------------------------------------------------------
 * - @vitejs/plugin-vue   : kompiliert .vue-Dateien (inkl. <template src>, <script src>)
 * - @tailwindcss/vite    : Tailwind v4 als Vite-Plugin (kein PostCSS-/Config-Aufwand)
 * - inject-csp (eigenes) : fügt die Content-Security-Policy NUR im Produktions-Build ein.
 *
 * Entscheidung CSP nur im Build: Der Vite-Entwicklungsserver injiziert Inline-Skripte
 * (Hot Module Replacement). Eine strenge CSP würde sie blockieren. Im Build entstehen
 * dagegen nur externe Dateien, sodass die CSP OHNE 'unsafe-inline' und OHNE
 * 'unsafe-eval' auskommt (Vue-Templates werden vorab zu JavaScript kompiliert).
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:", // kleine Bilder (Logo) werden von Vite als data:-URI eingebettet
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

function injectCsp() {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      const tag = `<meta http-equiv="Content-Security-Policy" content="${CSP}">`;
      return html.replace('</head>', `  ${tag}\n  </head>`);
    },
  };
}

export default defineConfig({
  base: './', // relative Pfade: der Build läuft in jedem Unterverzeichnis / per statischem Hosting
  plugins: [vue(), tailwindcss(), injectCsp()],
  build: {
    // Der Polyfill für module preload wäre ein Inline-Skript und würde die CSP verletzen.
    modulePreload: { polyfill: false },
  },
});
