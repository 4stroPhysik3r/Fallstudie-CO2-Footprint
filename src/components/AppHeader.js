/**
 * Header-Logik: Zustand des mobilen Menüs und Wahl der Schriftrichtung.
 * Das Logo wird per Import eingebunden; Vite hasht die Datei im Build bzw.
 * bettet kleine Dateien als data:-URI ein (daher `img-src data:` in der CSP).
 */
import { ref } from 'vue';
import logoUrl from '../assets/logo.svg';
import { useDirection } from '../composables/useDirection.js';

export default {
  name: 'AppHeader',
  setup() {
    const navOpen = ref(false); // mobiles Hauptmenü geöffnet?
    const { dirMode } = useDirection(); // 'auto' | 'ltr' | 'rtl' (geteilter Zustand)
    return { navOpen, dirMode, logoUrl };
  },
};
