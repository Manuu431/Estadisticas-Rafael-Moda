export const DATABASE_TABLES = {
    sales: {
        endpoint: "http://localhost:8000/api/sales",
        tables: {
            columns: ["ID", "Familia", "Talla", "Marca", "PVD", "PVP", "Descuento", "Beneficio"],
            values: ["id", "family", "size", "brand", "pvd", "pvp", "discount", "profit"],
        },
        filters: {
            label: ["ID", "Familia", "Talla", "Marca", "PVD", "PVP", "Descuento", "Beneficio"],
            inputId: ["id", "family", "size", "brand", "pvd", "pvp", "discount", "profit"],
            inputType: ["text", "select", "select", "select", "range", "range", "range", "range"]
        }
    },
    clients: {
        endpoint: "http://localhost:8000/api/clients",
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
        endpoint: "http://localhost:8000/api/campaigns",
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
        endpoint: "http://localhost:8000/api/seasons",
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
        endpoint: "http://localhost:8000/api/season_types",
        endpointSync: "http://localhost:8000/api/season_types/sync",
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
        endpoint: "http://localhost:8000/api/campaign_types",
        endpointSync: "http://localhost:8000/api/campaign_types/sync",
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
                    { label: "Por año", value: "year" }
                ],
                groupBy: [
                    { label: "Ninguno", value: "" },
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
    }
}