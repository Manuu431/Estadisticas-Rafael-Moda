import { useState } from 'react';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

const classCols = "col-12 col-md-6";

function Sales(props) {
    const [filters, setFilters] = useState({});
    
    return (
        <>
            <Title title={props.title} />
            <Filters type="sales" onFilterChange={setFilters} classCols={classCols} />
            <Table type="sales" filters={filters} classCols={classCols} />
        </>
    );
}

export default Sales;