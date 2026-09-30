import { useState } from 'react';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";
import { activeFiltersLabel } from "../utils/filterUtils.js";

function Clients(props) {
    const [filters, setFilters] = useState({});

    return (
        <>
            <header className="d-flex flex-column gap-1 mb-4">
                <span className="panel-kicker">{activeFiltersLabel(filters)}</span>
                <h1 className="panel-title m-0">{props.title}</h1>
            </header>
            <div className="d-flex flex-column gap-4">
                <Filters type="clients" onFilterChange={setFilters} />
                <Table type="clients" filters={filters} />
            </div>
        </>
    );
}

export default Clients;