export function handleSort(sortConfig, setSortConfig, key) {
    if (sortConfig.key !== key) {
        setSortConfig({ key, direction: 'asc' });
    } else if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' });
    } else if (sortConfig.direction === 'desc') {
        setSortConfig({ key: null, direction: 'asc' });
    }
}

export function getSortedData(data, sortConfig) {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA == null) return 1;
        if (valB == null) return -1;

        const numA = Number(valA);
        const numB = Number(valB);
        const bothNumeric = valA !== '' && valB !== '' && !isNaN(numA) && !isNaN(numB);

        const aComp = bothNumeric ? numA : typeof valA === 'string' ? valA.toLowerCase() : valA;
        const bComp = bothNumeric ? numB : typeof valB === 'string' ? valB.toLowerCase() : valB;

        if (aComp < bComp) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aComp > bComp) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
}

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

export function getSortIconClass(columnKey, sortConfig) {
    if (sortConfig.key !== columnKey) {
        return 'bi bi-filter';
    }

    if (sortConfig.direction === 'asc') {
        return 'bi bi-sort-up';
    }

    if (sortConfig.direction === 'desc') {
        return 'bi bi-sort-down';
    }

    return 'bi bi-filter';
}