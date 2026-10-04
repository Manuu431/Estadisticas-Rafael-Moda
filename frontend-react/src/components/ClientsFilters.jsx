import { useEffect, useState } from 'react';
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import { SearchField } from "./SalesFields.jsx";
import FieldDropdown from "./FieldDropdown.jsx";

const SEARCH_DELAY = 300;
const NO_OPTIONS = [];
const withAll = (names) => [{ value: '', label: 'Todas' }, ...names.map((name) => ({ value: name, label: name }))];

function ClientsFilters({ options, onFilterChange }) {
    const [search, setSearch] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const isMobile = useIsMobile();
    const typed = search.trim();
    const debouncedSearch = useDebouncedValue(typed, SEARCH_DELAY);
    const appliedSearch = typed ? debouncedSearch : '';

    useEffect(() => {
        onFilterChange({
            ...(appliedSearch ? { search: appliedSearch } : {}),
            ...(province ? { province } : {}),
            ...(city ? { city } : {})
        });
    }, [appliedSearch, province, city, onFilterChange]);

    const hasFilters = Boolean(typed || province || city);

    const changeProvince = (next) => {
        setProvince(next);
        if (next) setCity('');
    };

    const clearFilters = () => {
        setSearch('');
        setProvince('');
        setCity('');
    };

    const provinceSelect = (
        <FieldDropdown
            label="Provincia"
            value={province}
            options={withAll(options?.provinces ?? NO_OPTIONS)}
            onChange={changeProvince}
            className="clients-province"
            large={isMobile}
        />
    );

    const citySelect = (
        <FieldDropdown
            label="Ciudad"
            value={city}
            options={withAll(options?.cities ?? NO_OPTIONS)}
            onChange={setCity}
            className="clients-city"
            large={isMobile}
            alignEnd
        />
    );

    if (isMobile) {
        return (
            <div className="clients-mobile d-flex flex-column">
                <SearchField
                    large
                    value={search}
                    onChange={setSearch}
                    placeholder="Nombre o código postal"
                    label="Buscar clientes"
                    className="clients-search"
                />
                <div className="clients-selects">
                    {provinceSelect}
                    {citySelect}
                </div>
                {hasFilters && (
                    <button type="button" className="m-btn" onClick={clearFilters}>Limpiar filtros</button>
                )}
            </div>
        );
    }

    return (
        <div className="clients-filters filters-bar d-flex flex-wrap align-items-center">
            <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Buscar por nombre o código postal"
                label="Buscar clientes"
                className="clients-search"
            />
            {provinceSelect}
            {citySelect}
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