export const CONFIG = {
    sales: {
        endpoint: "http://localhost:8000/api/sales",
        columns: ["ID", "Modelo", "Familia", "Color", "Talla", "PVD", "PVP", "Unidades", "Descuento", "Beneficio"],
        values: ["id", "model", "family", "color", "size", "pvd", "pvp", "units", "discount", "profit"]
    },
    clients: {
        endpoint: "http://localhost:8000/api/clients",
        columns: ["ID", "Nombre", "CP", "Provincia", "Ciudad"],
        values: ["id", "name", "cp", "province", "city"]
    },
    campaigns: {
        endpoint: "http://localhost:8000/api/campaigns",
        columns: ["ID", "Nombre", "Fecha de Inicio", "Fecha de Fin", "Gastos", "Beneficios"],
        values: ["id", "name", "start_date", "end_date", "expenses", "benefits"]
    },
    seasons: {
        endpoint: "http://localhost:8000/api/seasons",
        columns: ["ID", "Nombre", "Fecha de inicio", "Fecha de fin", "Gastos", "Beneficios"],
        values: ["id", "name", "start_date", "end_date", "expenses", "benefits"]
    }
};