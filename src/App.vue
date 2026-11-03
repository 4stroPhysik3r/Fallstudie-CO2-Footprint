<!--
  Wurzelkomponente. Entscheidung "Single-File-Components mit src-Attributen":
  Eine .vue-Datei dient nur als Klammer; Struktur (HTML) und Verhalten (JS)
  liegen in eigenen Dateien. So bleibt die geforderte Trennung von HTML, CSS
  und JavaScript erhalten (CSS: Tailwind-Klassen + src/assets/main.css).
-->
<template src="./App.html"></template>
<script src="./App.js"></script>
