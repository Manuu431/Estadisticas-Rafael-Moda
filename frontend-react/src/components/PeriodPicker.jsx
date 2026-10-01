import { useMemo } from 'react';
import { DATABASE_TABLES } from '../config/database.js';
import { useFetch } from '../hooks/useFetch.js';

const MODES = [
    { value: 'exact_date', label: 'Fechas' },
    { value: 'campaigns', label: 'Campañas' },
    { value: 'seasons', label: 'Temporadas' }
];

function PeriodPicker({ periods = 1, filters, setFilters, onApply, onClear }) {
    const isList = filters.selectDateBy === 'campaigns' || filters.selectDateBy === 'seasons';
    const { data } = useFetch(isList ? DATABASE_TABLES[filters.selectDateBy].endpoint : null);
    const suffixes = periods === 1 ? [''] : ['_1', '_2'];

    const options = useMemo(() => {
        if (!data) return [];
        return [...data]
            .sort((a, b) => String(b.start_date).localeCompare(String(a.start_date)))
            .map((item) => ({ value: String(item.id), label: item.name, start: item.start_date, end: item.end_date }));
    }, [data]);

    const pickMode = (value) => {
        setFilters((prev) => {
            const next = { ...prev, selectDateBy: value };
            suffixes.forEach((suffix) => {
                next[`start_date${suffix}`] = '';
                next[`end_date${suffix}`] = '';
                next[`period${suffix}`] = '';
            });
            return next;
        });
    };

    const pickPeriod = (suffix, value) => {
        const option = options.find((item) => item.value === value);
        setFilters((prev) => ({
            ...prev,
            [`period${suffix}`]: value,
            [`start_date${suffix}`]: option?.start ?? '',
            [`end_date${suffix}`]: option?.end ?? ''
        }));
    };

    const pickDate = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));

    const periodLabel = (index) => (periods === 1 ? 'Periodo' : `Periodo ${index === 0 ? 'A' : 'B'}`);

    return (
        <div className="d-flex flex-column gap-3">
            <div className="panel-segs d-inline-flex align-self-start" role="group" aria-label="Qué comparar">
                {MODES.map((mode) => (
                    <button
                        key={mode.value}
                        type="button"
                        className={`panel-seg${filters.selectDateBy === mode.value ? ' is-on' : ''}`}
                        aria-pressed={filters.selectDateBy === mode.value}
                        onClick={() => pickMode(mode.value)}
                    >
                        {mode.label}
                    </button>
                ))}
            </div>
            <div className="row g-3">
                {suffixes.map((suffix, index) => (
                    <div className={periods === 1 ? 'col-12 col-md-6' : 'col-12 col-lg-6'} key={suffix || 'single'}>
                        <div className="d-flex flex-column gap-2">
                            <span className="filters-label d-flex align-items-center gap-2">
                                {periods === 2 && <span className={`panel-dot ${index === 0 ? 'is-a' : 'is-b'}`} aria-hidden="true" />}
                                {periodLabel(index)}
                            </span>
                            {isList ? (
                                <span className="panel-field">
                                    <select
                                        aria-label={periodLabel(index)}
                                        value={filters[`period${suffix}`] ?? ''}
                                        onChange={(event) => pickPeriod(suffix, event.target.value)}
                                    >
                                        <option value="">Todas</option>
                                        {options.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </span>
                            ) : (
                                <div className="d-flex gap-2">
                                    <span className="panel-field flex-grow-1">
                                        <input
                                            type="date"
                                            aria-label={`${periodLabel(index)}, desde`}
                                            value={filters[`start_date${suffix}`] ?? ''}
                                            onChange={(event) => pickDate(`start_date${suffix}`, event.target.value)}
                                        />
                                    </span>
                                    <span className="panel-field flex-grow-1">
                                        <input
                                            type="date"
                                            aria-label={`${periodLabel(index)}, hasta`}
                                            value={filters[`end_date${suffix}`] ?? ''}
                                            onChange={(event) => pickDate(`end_date${suffix}`, event.target.value)}
                                        />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="d-flex gap-2">
                <div className="flex-grow-1 d-none d-md-block" />
                <button type="button" className="panel-ghost" onClick={onClear}>Limpiar</button>
                <button type="button" className="panel-primary" onClick={() => onApply(filters)}>Filtrar</button>
            </div>
        </div>
    );
}

export default PeriodPicker;