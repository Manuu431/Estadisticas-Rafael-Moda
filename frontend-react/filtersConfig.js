export const FILTERS_CONFIG = {
    sales: {
        label: ["ID", "Modelo", "Familia", "Color", "Talla", "PVD", "PVP", "Unidades", "Descuento", "Beneficio"],
        inputId: ["id", "model", "family", "color", "size", "pvd", "pvp", "units", "discount", "profit"],
        inputType: ["text", "text", "select", "select", "select", "range", "range", "text", "text", "range"]
    },
    clients: {
        label: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
        inputId: ["id", "name", "cp", "province", "city"],
        inputType: ["text", "text", "text", "select", "select"]
    },
    campaigns: {
        label: ["ID", "Nombre", "Fecha de Inicio", "Fecha de Fin", "Gastos", "Beneficios"],
        inputId: ["id", "name", "start_date", "end_date", "expenses", "benefits"],
        inputType: ["text", "text", "date", "date", "text", "text"]
    },
    seasons: {
        label: ["ID", "Nombre", "Fecha de inicio", "Fecha de fin", "Gastos", "Beneficios"],
        inputId: ["id", "name", "start_date", "end_date", "expenses", "benefits"],
        inputType: ["text", "text", "date", "date", "text", "text"]
    }
};
