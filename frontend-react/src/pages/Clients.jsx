import { useState } from 'react';
import ClientsFilters from "../components/ClientsFilters.jsx";
import Table from "../components/table/Table.jsx";
import { Skeleton } from "./controlPanel/cards/CardState.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { formatClientsRegistered } from "../utils/format.js";

const OPTIONS_URL = DATABASE_TABLES.clients.endpointOptions;

function Clients(props) {
    const [filters, setFilters] = useState({});
    const { data: options, loading } = useFetch(OPTIONS_URL, filters.province ? { province: filters.province } : undefined);

    return (
        <div className="clients-page">
            <header className="panel-heading d-flex flex-column">
                {options ? <span className="panel-period">{formatClientsRegistered(options.total)}</span> : <Skeleton className="clients-count-skeleton" />}
                <h1 className="panel-title m-0">{props.title}</h1>
            </header>
            <section className="data-card" aria-label="Listado de clientes">
                <ClientsFilters options={options} loading={loading} onFilterChange={setFilters} />
            </section>
            <Table type="clients" filters={filters} />
        </div>
    );
}

export default Clients;