import { useState } from 'react';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

function Sales(props) {
    const [filters, setFilters] = useState({});
    
    return (
        <>
            <Title title={props.title} />
            <Filters type="sales" onFilterChange={setFilters} classCols={props.classCols} />
            <Table type="sales" filters={filters} classCols={props.classCols} />
        </>
    );
}

export default Sales;