const API_BASE = import.meta.env.VITE_API_URL;
export const DATABASE_TABLES = {
    users: {
        endpoint: `${API_BASE}/users`,
        endpointDemo: `${API_BASE}/users/demo`
    },
    statistics: {
        summary: `${API_BASE}/statistics/summary`,
        daily: `${API_BASE}/statistics/daily`,
        brands: `${API_BASE}/statistics/brands`,
        compare: `${API_BASE}/statistics/compare`,
        expenses: `${API_BASE}/statistics/expenses`
    },
    sales: {
        endpoint: `${API_BASE}/sales`,
        endpointOptions: `${API_BASE}/sales/options`,
    },
    clients: {
        endpoint: `${API_BASE}/clients`,
        endpointOptions: `${API_BASE}/clients/options`
    },
    campaigns: {
        endpoint: `${API_BASE}/campaigns`,
    },
    seasons: {
        endpoint: `${API_BASE}/seasons`,
    },
    seasonTypes: {
        endpoint: `${API_BASE}/season_types`,
        endpointSync: `${API_BASE}/season_types/sync`,
    },
    campaignTypes: {
        endpoint: `${API_BASE}/campaign_types`,
        endpointSync: `${API_BASE}/campaign_types/sync`,
    }
}