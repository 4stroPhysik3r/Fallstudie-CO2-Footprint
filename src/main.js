/**
 * Einstiegspunkt: erzeugt die Vue-Anwendung und hängt sie an <div id="app"> (index.html).
 * Das globale Stylesheet (Tailwind + eigene Ergänzungen) wird hier importiert; Vite
 * bündelt es im Build zu einer externen CSS-Datei (wichtig für die strenge CSP).
 */
import { createApp } from 'vue';
import './assets/main.css';
import App from './App.vue';

createApp(App).mount('#app');
