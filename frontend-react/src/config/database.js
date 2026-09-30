const API_BASE = import.meta.env.VITE_API_URL;
export const DATABASE_TABLES = {
    users: {
        endpoint: `${API_BASE}/users`,
        endpointDemo: `${API_BASE}/users/demo`
    },
    sales: {
        endpoint: `${API_BASE}/sales`,
        tables: {
            columns: ["ID", "Sección", "Familia", "Talla", "Marca", "PVD", "PVP", "Descuento", "Beneficio", "Unidades"],
            values: ["id", "section", "family", "size", "brand", "pvd", "pvp", "discount", "profit", "units"],
        },
        filters: {
            label: ["ID", "Sección", "Familia", "Talla", "Marca", "PVD", "PVP", "Descuento", "Beneficio"],
            inputId: ["id", "section", "family", "size", "brand", "pvd", "pvp", "discount", "profit"],
            inputType: ["text", "select", "select", "select", "select", "range", "range", "range", "range"]
        }
    },
    clients: {
        endpoint: `${API_BASE}/clients`,
        tables: {
            columns: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
            values: ["id", "name", "postal_code", "province", "city"]
        },
        filters: {
            label: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
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
        filters: {
            label: ["ID", "Nombre", "Fecha de Inicio", "Fecha de Fin", "Gastos", "Beneficios"],
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
        filters: {
            label: ["ID", "Nombre", "Fecha de inicio", "Fecha de fin", "Gastos", "Beneficios"],
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
        filters: {
            label: ["ID", "Nombre", "Año de inicio"],
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
        filters: {
            label: ["ID", "Nombre", "Año de inicio"],
            inputId: ["id", "name", "start_year"],
            inputType: ["text", "text", "select"]
        }
    },
    comparative: {
        filters: {
            label: ["Fecha de inicio 1", "Fecha de fin 1", "Fecha de inicio 2", "Fecha de fin 2", "Mostrar por", "Segmentar por"],
            inputId: ["start_date_1", "end_date_1", "start_date_2", "end_date_2", "showBy", "groupBy"],
            inputType: ["date", "date", "date", "date", "select", "select"],
            options: {
                showBy: [
                    { label: "Por día", value: "day" },
                    { label: "Por mes", value: "month" },
                    { label: "Por año", value: "year" },
                    { label: "Todo", value: "all" }
                ],
                groupBy: [
                    { label: "Ninguno", value: "none" },
                    { label: "Sección", value: "section" },
                    { label: "Familia", value: "family" },
                    { label: "Marca", value: "brand" },
                    { label: "Color", value: "color" },
                    { label: "Talla", value: "size" }
                ],
                selectDateBy: [
                    { label: "Fecha exacta", value: "exact_date" },
                    { label: "Campañas", value: "campaigns" },
                    { label: "Temporadas", value: "seasons" }
                ]
            }
        }
    },
    expenses: {
        filters: {
            label: ["Fecha de inicio", "Fecha de fin", "Mostrar por"],
            inputId: ["start_date", "end_date", "showBy"],
            inputType: ["date", "date", "date", "date", "select"],
            options: {
                showBy: [
                    { label: "Por día", value: "day" },
                    { label: "Por mes", value: "month" },
                    { label: "Por año", value: "year" },
                    { label: "Todo", value: "all" }
                ],
                selectDateBy: [
                    { label: "Fecha exacta", value: "exact_date" },
                    { label: "Campañas", value: "campaigns" },
                    { label: "Temporadas", value: "seasons" }
                ]
            }
        }
    }
}