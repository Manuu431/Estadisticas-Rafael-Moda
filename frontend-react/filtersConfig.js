export const FILTERS_CONFIG = {
    sales: {
        label: ["ID", "Modelo", "Familia", "Color", "Talla", "PVD", "PVP", "Unidades", "Descuento", "Beneficio", "Fecha de venta"],
        inputId: ["id", "model", "family", "color", "size", "pvd", "pvp", "units", "discount", "profit", "sale_date"],
        inputType: ["text", "text", "select", "select", "select", "range", "range", "text", "range", "range", "date"]
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