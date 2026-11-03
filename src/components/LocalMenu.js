/**
 * Das lokale Menü ist rein darstellend und braucht keine eigene Logik.
 * Die Links sind Daten, damit das Template kurz bleibt und Einträge an einer Stelle gepflegt werden.
 */
export default {
  name: 'LocalMenu',
  setup() {
    const links = [
      { href: '#uebersicht', label: 'Übersicht' },
      { href: '#daten', label: 'Emissionsdaten' },
      { href: '#hinweise', label: 'Hinweise zu den Daten' },
    ];
    return { links };
  },
};
