const API_BASE = import.meta.env.VITE_API_URL;
export const DATABASE_TABLES = {
    users: {
        endpoint: `${API_BASE}/users`,
        endpointDemo: `${API_BASE}/users/demo`
    },
    statistics: {
        summary: `${API_BASE}/statistics/summary`,
        daily: `${API_BASE}/statistics/daily`,
        brands: `${API_BASE}/statistics/brands`
    },
    sales: {
        endpoint: `${API_BASE}/sales`,
        tables: {
            columns: ["ID", "Sección", "Familia", "Talla", "Marca", "Unidades", "Importe", "Beneficio"],
            values: ["id", "section", "family", "size", "brand", "units", "amount", "profit"],
        },
        filters: {
            label: ["ID", "Sección", "Familia", "Talla", "Marca", "Precio de venta", "Beneficio"],
            segment: "section",
            primary: ["brand", "family"],
            inputId: ["id", "section", "family", "size", "brand", "unit_price", "profit"],
            inputType: ["text", "select", "select", "select", "select", "range", "range"]
        }
    },
    clients: {
        endpoint: `${API_BASE}/clients`,
        tables: {
            columns: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
            values: ["id", "name", "postal_code", "province", "city"]
        },
        mobile: { title: "name", meta: ["city", "province"], value: "postal_code" },
        filters: {
            label: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
            primary: ["name", "province"],
            inputId: ["id", "name", "postal_code", "province", "city"],
            inputType: ["text", "text", "text", "select", "select"]
        }
    },
    campaigns: {
        endpoint: `${API_BASE}/campaigns`,
        tables: {
            columns: ["ID", "Nombre", "Fecha de Inicio", "Fecha de Fin", "Gastos", "Beneficios"],
            values: ["id", "name", "start_date", "end_date", "expenses", "profits"]
        },
        mobile: { title: "name", meta: ["start_date", "end_date"], value: "profits" },
        filters: {
            label: ["ID", "Nombre", "Fecha de Inicio", "Fecha de Fin", "Gastos", "Beneficios"],
            primary: ["name", "start_date"],
            inputId: ["id", "name", "start_date", "end_date", "expenses", "profits"],
            inputType: ["text", "text", "date", "date", "range", "range"]
        }
    },
    seasons: {
        endpoint: `${API_BASE}/seasons`,
        tables: {
            columns: ["ID", "Nombre", "Fecha de inicio", "Fecha de fin", "Gastos", "Beneficios"],
            values: ["id", "name", "start_date", "end_date", "expenses", "profits"]
        },
        mobile: { title: "name", meta: ["start_date", "end_date"], value: "profits" },
        filters: {
            label: ["ID", "Nombre", "Fecha de inicio", "Fecha de fin", "Gastos", "Beneficios"],
            primary: ["name", "start_date"],
            inputId: ["id", "name", "start_date", "end_date", "expenses", "profits"],
            inputType: ["text", "text", "date", "date", "range", "range"]
        }
    },
    seasonTypes: {
        endpoint: `${API_BASE}/season_types`,
        endpointSync: `${API_BASE}/season_types/sync`,
        tables: {
            columns: ["ID", "Nombre", "Inicio", "Fin", "Año de inicio"],
            values: ["id", "name", "start_date_formatted", "end_date_formatted", "start_year"]
        },
        mobile: { title: "name", meta: ["start_date_formatted", "end_date_formatted"], value: "start_year" },
        filters: {
            label: ["ID", "Nombre", "Año de inicio"],
            primary: ["name", "start_year"],
            inputId: ["id", "name", "start_year"],
            inputType: ["text", "text", "select"]
        }
    },
    campaignTypes: {
        endpoint: `${API_BASE}/campaign_types`,
        endpointSync: `${API_BASE}/campaign_types/sync`,
        tables: {
            columns: ["ID", "Nombre", "Inicio", "Fin", "Año de inicio"],
            values: ["id", "name", "start_date_formatted", "end_date_formatted", "start_year"]
        },
        mobile: { title: "name", meta: ["start_date_formatted", "end_date_formatted"], value: "start_year" },
        filters: {
            label: ["ID", "Nombre", "Año de inicio"],
            primary: ["name", "start_year"],
            inputId: ["id", "name", "start_year"],
            inputType: ["text", "text", "select"]
        }
    }
}