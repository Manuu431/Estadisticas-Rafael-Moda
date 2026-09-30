export const MENU_ITEMS = [
  { name: 'Panel de control', path: '/', element: 'ControlPanel', icon: 'bi bi-grid' },
  { name: 'Ventas', path: '/ventas', element: 'Sales', icon: 'bi bi-bag', group: 'Análisis' },
  { name: 'Clientes', path: '/clientes', element: 'Clients', icon: 'bi bi-people', group: 'Análisis' },
  { name: 'Comparativa', path: '/comparativa', element: 'Comparative', icon: 'bi bi-arrow-left-right', group: 'Análisis' },
  { name: 'Gastos', path: '/gastos', element: 'Expenses', icon: 'bi bi-receipt', group: 'Análisis' },
  { name: 'Calendario', path: '/calendario', element: 'Calendar', icon: 'bi bi-calendar', group: 'Planificación' },
  { name: 'Campañas', path: '/campañas', element: 'Campaigns', icon: 'bi bi-megaphone', group: 'Planificación' },
  { name: 'Temporadas', path: '/temporadas', element: 'Seasons', icon: 'bi bi-brightness-high', group: 'Planificación' },
  { name: 'Tipos de campañas', path: '/tipos-campañas', element: 'CampaignTypes', icon: 'bi bi-megaphone', group: 'Ajustes' },
  { name: 'Tipos de temporada', path: '/tipos-temporadas', element: 'SeasonTypes', icon: 'bi bi-brightness-high', group: 'Ajustes' }
];

export const GROUP_BY_OPTIONS = [
  { value: 'section', label: 'sección' },
  { value: 'family', label: 'familia' },
  { value: 'brand', label: 'marca' },
  { value: 'color', label: 'color' },
  { value: 'size', label: 'talla' }
];