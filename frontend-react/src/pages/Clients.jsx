import { useCallback, useState } from 'react';
import ClientsFilters from "../components/ClientsFilters.jsx";
import ClientsTable from "../components/table/ClientsTable.jsx";
import ClientsPlaceholder from "../components/table/ClientsPlaceholder.jsx";
import Pagination from "../components/Pagination.jsx";
import { Skeleton } from "./controlPanel/cards/CardState.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { formatClientsRegistered } from "../utils/format.js";
import { clientsState } from "../utils/clientsState.js";
import { useIsMobile } from "../utils/useIsMobile.js";

const OPTIONS_URL = DATABASE_TABLES.clients.endpointOptions;
const PAGE_SIZE = 10;

function Clients(props) {
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const isMobile = useIsMobile();
    const { data: options, loading, error: optionsError } = useFetch(OPTIONS_URL, filters.province ? { province: filters.province } : undefined);
    const { data: clients, error, refetch } = useFetch(DATABASE_TABLES.clients.endpoint, filters);
    const state = clientsState({ data: clients, error });
    const totalPages = Math.ceil((clients?.length ?? 0) / PAGE_SIZE);

    const changeFilters = useCallback((next) => {
        setFilters(next);
        setPage(1);
    }, []);

    const filtersBar = <ClientsFilters options={options} loading={loading} onFilterChange={changeFilters} />;

    const list = state.kind === 'ready' ? (
        <>
            <ClientsTable data={clients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)} />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={clients.length}
                pageSize={PAGE_SIZE}
                itemLabel="clientes"
                edges
            />
        </>
    ) : (
        <ClientsPlaceholder state={state} onRetry={refetch} />
    );

    return (
        <div className="clients-page">
            <header className="panel-heading d-flex flex-column">
                {options ? <span className="panel-period">{formatClientsRegistered(options.total)}</span> : optionsError ? null : <Skeleton className="clients-count-skeleton" />}
                <h1 className="panel-title m-0">{props.title}</h1>
            </header>
            {isMobile ? (
                <>
                    {filtersBar}
                    <section className="data-card" aria-label="Listado de clientes">{list}</section>
                </>
            ) : (
                <section className="data-card" aria-label="Listado de clientes">
                    {filtersBar}
                    {list}
                </section>
            )}
        </div>
    );
}

export default Clients;