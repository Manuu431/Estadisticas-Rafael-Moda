import { useEffect, useState } from 'react';
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { InlineSelect, SearchField } from "./SalesFields.jsx";

const SEARCH_DELAY = 300;
const NO_OPTIONS = [];
const withAll = (names) => [{ value: '', label: 'Todas' }, ...names.map((name) => ({ value: name, label: name }))];

function ClientsFilters({ options, loading, onFilterChange }) {
    const [search, setSearch] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DELAY);
    const cities = options?.cities ?? NO_OPTIONS;

    useEffect(() => {
        onFilterChange({
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(province ? { province } : {}),
            ...(city ? { city } : {})
        });
    }, [debouncedSearch, province, city, onFilterChange]);

    useEffect(() => {
        if (options && !loading && city && !cities.includes(city)) setCity('');
    }, [options, loading, cities, city]);

    const hasFilters = Boolean(search || province || city);

    const clearFilters = () => {
        setSearch('');
        setProvince('');
        setCity('');
    };

    return (
        <div className="clients-filters filters-bar d-flex flex-wrap align-items-center">
            <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Buscar por nombre o código postal"
                label="Buscar clientes"
                className="clients-search"
            />
            <InlineSelect
                name="province"
                label="Provincia"
                value={province}
                options={withAll(options?.provinces ?? NO_OPTIONS)}
                onChange={setProvince}
                className="clients-province"
            />
            <InlineSelect
                name="city"
                label="Ciudad"
                value={city}
                options={withAll(cities)}
                onChange={setCity}
                className="clients-city"
            />
            {hasFilters && (
                <button type="button" className="panel-btn clients-clear" onClick={clearFilters}>
                    <i className="bi bi-x-lg" aria-hidden="true" />
                    Limpiar filtros
                </button>
            )}
        </div>
    );
}

export default ClientsFilters;