# CO₂-Footprint (Vue 3 + Vite + Tailwind v4)

Öffentliche Webseite zur Transparenz von CO₂-Emissionen (fiktive Demodaten).

## Voraussetzungen

Node.js ≥ 20 (empfohlen: aktuelle LTS-Version)

## Starten

```
npm install
npm run dev        # Entwicklungsserver, Adresse steht im Terminal (meist http://localhost:5173)
```

## Produktions-Build

```
npm run build      # erzeugt dist/ (inkl. strenger Content-Security-Policy)
npm run preview    # gebauten Stand lokal ansehen
```

## Tests (ohne npm install lauffähig)

```
npm test
```

## Aufbau

HTML (`*.html`), JavaScript (`*.js`) und CSS (`src/assets/main.css`, Tailwind) liegen in getrennten Dateien; `*.vue`
verbindet sie nur.
