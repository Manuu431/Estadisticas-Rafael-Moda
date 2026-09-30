import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";

const TABS = [
    {
        slug: 'campanas',
        type: 'campaigns',
        label: 'Campañas',
        intro: 'Cada campaña es una edición concreta, con sus fechas y lo que dejó. Sincroniza para generar las que falten a partir de sus tipos.'
    },
    {
        slug: 'temporadas',
        type: 'seasons',
        label: 'Temporadas',
        intro: 'Las temporadas marcan el cambio de colección. Apunta aquí sus fechas, sus gastos y su beneficio.'
    },
    {
        slug: 'tipos-campanas',
        type: 'campaignTypes',
        label: 'Tipos de campaña',
        intro: 'Los tipos se repiten todos los años: define el nombre y los días en que empieza y termina.'
    },
    {
        slug: 'tipos-temporadas',
        type: 'seasonTypes',
        label: 'Tipos de temporada',
        intro: 'Los tipos se repiten todos los años: define el nombre y los días en que empieza y termina.'
    }
];

const readTemporalItem = () => {
    try {
        return JSON.parse(localStorage.getItem('temporalItem'));
    } catch {
        return null;
    }
};

function Planning(props) {
    const { tab } = useParams();
    const navigate = useNavigate();
    const active = TABS.find((item) => item.slug === tab) ?? TABS[0];
    const [filters, setFilters] = useState({});
    const [external, setExternal] = useState(readTemporalItem);
    const [initialType] = useState(active.type);

    const sources = {
        campaigns: useFetch(DATABASE_TABLES.campaigns.endpoint),
        seasons: useFetch(DATABASE_TABLES.seasons.endpoint),
        campaignTypes: useFetch(DATABASE_TABLES.campaignTypes.endpoint),
        seasonTypes: useFetch(DATABASE_TABLES.seasonTypes.endpoint)
    };
    const refetchActive = sources[active.type].refetch;

    useEffect(() => {
        setFilters({});
    }, [active.type]);

    const handleChanged = useCallback(() => {
        refetchActive();
    }, [refetchActive]);

    const countFor = (type) => sources[type].data?.length;
    const keepsExternal = active.type === initialType && (active.type === 'campaigns' || active.type === 'seasons');

    return (
        <>
            <header className="d-flex flex-column gap-1 mb-4">
                <span className="panel-kicker">Planificación del año</span>
                <h1 className="panel-title m-0">{props.title}</h1>
            </header>
            <div className="planning-tabs d-flex gap-4 mb-4" role="tablist" aria-label="Campañas o temporadas">
                {TABS.map((item) => {
                    const total = countFor(item.type);
                    const isActive = item.type === active.type;

                    return (
                        <button
                            type="button"
                            role="tab"
                            key={item.slug}
                            id={`tab-${item.slug}`}
                            className={`planning-tab${isActive ? ' is-on' : ''}`}
                            aria-selected={isActive}
                            onClick={() => navigate(`/planificacion/${item.slug}`)}
                        >
                            {item.label}
                            {total === undefined ? null : <span className="planning-count">{total}</span>}
                        </button>
                    );
                })}
            </div>
            <div className="d-flex flex-column gap-4" role="tabpanel" aria-labelledby={`tab-${active.slug}`}>
                <p className="panel-kicker m-0">{active.intro}</p>
                <Filters key={`filters-${active.type}`} type={active.type} onFilterChange={setFilters} />
                <Table
                    key={`table-${active.type}`}
                    type={active.type}
                    filters={filters}
                    external={keepsExternal ? external : null}
                    setExternal={setExternal}
                    onChanged={handleChanged}
                />
            </div>
        </>
    );
}

export default Planning;