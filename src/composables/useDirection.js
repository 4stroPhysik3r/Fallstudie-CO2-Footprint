/**
 * Composable "useDirection": Schriftrichtung (LTR/RTL) der Seite
 * ------------------------------------------------------------------
 * Das lokale Menü steht im HTML vor dem Content. Ein Flex-Container richtet
 * sich nach dem `dir`-Attribut des <html>-Elements aus: LTR → Menü links,
 * RTL → Menü rechts. Dieses Composable setzt nur das Attribut – das Spiegeln
 * übernimmt der Browser (Flexbox + logische Tailwind-Klassen wie ps-/text-end).
 *
 * Der Zustand liegt auf Modulebene und ist damit eine einzige, geteilte Quelle
 * (Singleton), ohne dass ein State-Management-Paket (Pinia) nötig wäre.
 */
import { ref, watch } from 'vue';
import { resolveDirection } from '../lib/logic.js';

const STORAGE_KEY = 'co2.dirMode';
const locale = navigator.language || 'de';

// localStorage kann z. B. im privaten Modus Fehler werfen → alles in try/catch.
function load() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'ltr' || v === 'rtl' || v === 'auto' ? v : 'auto';
  } catch {
    return 'auto';
  }
}
function save(v) {
  try {
    window.localStorage.setItem(STORAGE_KEY, v);
  } catch {
    /* Speichern ist optional – ignorieren */
  }
}

/** 'auto' folgt der Browsersprache, 'ltr'/'rtl' sind manuelle Übersteuerungen. */
const dirMode = ref(load());

// immediate: Richtung sofort beim ersten Laden setzen, danach bei jeder Änderung.
watch(
  dirMode,
  (mode) => {
    save(mode);
    document.documentElement.setAttribute('dir', resolveDirection(mode, locale));
  },
  { immediate: true },
);

export function useDirection() {
  return { dirMode };
}
