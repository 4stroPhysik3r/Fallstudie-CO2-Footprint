/**
 * Komponentenlogik: bindet das Composable an das Template und stellt die
 * Ereignis-Handler bereit.
 *
 * Wichtig für die Sicherheit: Nach jeder Eingabe wird der
 * BEREINIGTE Wert zurück ins Feld geschrieben. So sieht der Nutzer, was
 * tatsächlich gilt, und nicht zugelassene Zeichen bleiben nie im Feld stehen.
 */
import { useEmissionsTable } from '../composables/useEmissionsTable.js';

export default {
  name: 'EmissionsTable',
  setup() {
    const table = useEmissionsTable();

    function onSearchInput(event) {
      table.setQuery(event.target.value);
      event.target.value = table.query.value;
    }
    
    function onCountryChange(event) {
      table.setCountry(event.target.value);
      event.target.value = table.country.value;
    }

    function onTypeChange(event) {
      table.setType(event.target.value);
      event.target.value = table.type.value;
    }

    function onYearChange(event) {
      table.setYear(event.target.value);
      event.target.value = table.year.value;
    }

    return { ...table, onSearchInput, onCountryChange, onTypeChange, onYearChange };
  }
};
