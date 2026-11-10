/**
 * Der Footer ist statisch. Das Jahr wird aus dem Systemdatum berechnet,
 * damit der Copyright-Vermerk nicht veraltet.
 */
export default {
  name: 'AppFooter',
  setup() {
    return { year: new Date().getFullYear() };
  }
};
