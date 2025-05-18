export const CONFIG = {
    sales: {
        endpoint: "http://localhost:8000/api/sales",
        columns: ["ID", "Modelo", "Familia", "Color", "Talla", "Marca", "PVD", "PVP", "Unidades", "Descuento", "Beneficio", "Fecha de venta"],
        values: ["id", "model", "family", "color", "size", "brand", "pvd", "pvp", "units", "discount", "profit", "sale_date"]
    },
    clients: {
        endpoint: "http://localhost:8000/api/clients",
        columns: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
        values: ["id", "name", "postal_code", "province", "city"]
    },
    campaigns: {
        endpoint: "http://localhost:8000/api/campaigns",
        columns: ["ID", "Nombre", "Fecha de Inicio", "Fecha de Fin", "Gastos", "Beneficios"],
        values: ["id", "name", "start_date", "end_date", "expenses", "profits"]
    },
    seasons: {
        endpoint: "http://localhost:8000/api/seasons",
        columns: ["ID", "Nombre", "Fecha de inicio", "Fecha de fin", "Gastos", "Beneficios"],
        values: ["id", "name", "start_date", "end_date", "expenses", "profits"]
    }
};

export const FILTERS_CONFIG = {
    sales: {
        label: ["ID", "Modelo", "Familia", "Color", "Talla", "Marca", "PVD", "PVP", "Unidades", "Descuento", "Beneficio", "Fecha de venta"],
        inputId: ["id", "model", "family", "color", "size", "brand", "pvd", "pvp", "units", "discount", "profit", "sale_date"],
        inputType: ["text", "text", "select", "select", "select", "select", "range", "range", "text", "range", "range", "date"]
    },
    clients: {
        label: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
        inputId: ["id", "name", "postal_code", "province", "city"],
        inputType: ["text", "text", "text", "select", "select"]
    },
    campaigns: {
        label: ["ID", "Nombre", "Fecha de Inicio", "Fecha de Fin", "Gastos", "Beneficios"],
        inputId: ["id", "name", "start_date", "end_date", "expenses", "profits"],
        inputType: ["text", "text", "date", "date", "range", "range"]
    },
    seasons: {
        label: ["ID", "Nombre", "Fecha de inicio", "Fecha de fin", "Gastos", "Beneficios"],
        inputId: ["id", "name", "start_date", "end_date", "expenses", "profits"],
        inputType: ["text", "text", "date", "date", "range", "range"]
    }
};

export const CONFIG2 = {
    sales: {
        endpoint: "http://localhost:8000/api/sales",
        columns: ["ID", "Modelo", "Familia", "Color", "Talla", "Marca", "PVD", "PVP", "Unidades", "Descuento", "Beneficio", "Fecha de venta"],
        values: ["id", "model", "family", "color", "size", "brand", "pvd", "pvp", "units", "discount", "profit", "sale_date"],
        inputType: ["text", "text", "select", "select", "select", "select", "range", "range", "text", "range", "range", "date"]
    },
    clients: {
        endpoint: "http://localhost:8000/api/clients",
        columns: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
        values: ["id", "name", "postal_code", "province", "city"],
        inputType: ["text", "text", "text", "select", "select"]
    },
    campaigns: {
        endpoint: "http://localhost:8000/api/campaigns",
        columns: ["ID", "Nombre", "Fecha de Inicio", "Fecha de Fin", "Gastos", "Beneficios"],
        values: ["id", "name", "start_date", "end_date", "expenses", "profits"],
        inputType: ["text", "text", "date", "date", "range", "range"]
    },
    seasons: {
        endpoint: "http://localhost:8000/api/seasons",
        columns: ["ID", "Nombre", "Fecha de inicio", "Fecha de fin", "Gastos", "Beneficios"],
        values: ["id", "name", "start_date", "end_date", "expenses", "profits"],
        inputType: ["text", "text", "date", "date", "range", "range"]
    }
}