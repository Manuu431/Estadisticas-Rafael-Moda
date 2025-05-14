import { useState } from 'react';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

function Clients(props) {
    const [filters, setFilters] = useState({});

    return (
        <>
            <Title title={props.title} />
            <Filters type="clients" onFilterChange={setFilters} />
            <Table type="clients" filters={filters} />
        </> 
    );
}

export default Clients;
