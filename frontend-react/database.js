export const DATABASE_TABLES = {
    sales: {
        endpoint: "http://localhost:8000/api/sales",
        tables: {
            columns: ["ID", "Familia", "Color", "Talla", "Marca", "PVD", "PVP", "Unidades", "Descuento", "Beneficio", "Fecha de venta"],
            values: ["id", "family", "color", "size", "brand", "pvd", "pvp", "units", "discount", "profit", "sale_date"],
        },
        filters: {
            label: ["ID", "Familia", "Color", "Talla", "Marca", "PVD", "PVP", "Unidades", "Descuento", "Beneficio", "Fecha de venta"],
            inputId: ["id", "family", "color", "size", "brand", "pvd", "pvp", "units", "discount", "profit", "sale_date"],
            inputType: ["text", "select", "select", "select", "select", "range", "range", "text", "range", "range", "date"]
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
    }
}