export const MENU_ITEMS = [
  { name: 'Panel de control', path: '/', element: 'ControlPanel', icon: 'bi bi-grid' },
  { name: 'Ventas', path: '/ventas', element: 'Sales', icon: 'bi bi-bag', group: 'Análisis' },
  { name: 'Clientes', path: '/clientes', element: 'Clients', icon: 'bi bi-people', group: 'Análisis' },
  { name: 'Comparativa', path: '/comparativa', element: 'Comparative', icon: 'bi bi-arrow-left-right', group: 'Análisis' },
  { name: 'Gastos', path: '/gastos', element: 'Expenses', icon: 'bi bi-receipt', group: 'Análisis' },
  { name: 'Calendario', path: '/calendario', element: 'Calendar', icon: 'bi bi-calendar', group: 'Planificación' },
  { name: 'Campañas y temporadas', path: '/planificacion', element: 'Planning', icon: 'bi bi-megaphone', group: 'Planificación' }
];

export const MOBILE_TABS = [
  { name: 'Inicio', path: '/', icon: 'bi bi-grid' },
  { name: 'Ventas', path: '/ventas', icon: 'bi bi-bag' },
  { name: 'Calendario', path: '/calendario', icon: 'bi bi-calendar' },
  { name: 'Campañas', path: '/planificacion', icon: 'bi bi-megaphone' },
  { name: 'Más', path: '/mas', icon: 'bi bi-three-dots' }
];

const TAB_PATHS = MOBILE_TABS.map((tab) => tab.path);

export const MORE_ITEMS = MENU_ITEMS.filter((item) => !TAB_PATHS.includes(item.path));

export const SHOW_BY_OPTIONS = [
  { value: 'day', label: 'Días' },
  { value: 'month', label: 'Meses' },
  { value: 'year', label: 'Años' }
];

export const GROUP_BY_OPTIONS = [
  { value: 'section', label: 'sección' },
  { value: 'family', label: 'familia' },
  { value: 'brand', label: 'marca' },
  { value: 'color', label: 'color' },
  { value: 'size', label: 'talla' }
];