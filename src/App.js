/**
 * Logik der Wurzelkomponente: setzt die Teilkomponenten zusammen.
 * Die Seite hat keinen eigenen Zustand; Filter/Sortierung liegen in EmissionsTable,
 * die Schriftrichtung in useDirection (geteilter Zustand).
 */
import AppHeader from './components/AppHeader.vue';
import LocalMenu from './components/LocalMenu.vue';
import EmissionsTable from './components/EmissionsTable.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: { AppHeader, LocalMenu, EmissionsTable, AppFooter },
};
