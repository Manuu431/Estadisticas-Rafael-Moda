export const handleSort = (sortConfig, setSortConfig, key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
};

export const getSortedData = (data, sortConfig) => {
    return [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA == null) return 1;
        if (valB == null) return -1;

        const aLower = typeof valA === 'string' ? valA.toLowerCase() : valA;
        const bLower = typeof valB === 'string' ? valB.toLowerCase() : valB;

        if (aLower < bLower) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aLower > bLower) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
};

export const formatDate = (value) => {
    return new Date(value).toLocaleDateString('es-ES');
};

export const serializeParams = (params) => {
    return Object.entries(params)
        .map(([key, val]) => {
            if (Array.isArray(val)) {
                return val.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
        }).join('&');
};

export const getSortIconClass = (columnKey, sortConfig) => {
    if (sortConfig.key === columnKey) {
        return sortConfig.direction === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down';
    }
    return 'bi bi-filter';
};