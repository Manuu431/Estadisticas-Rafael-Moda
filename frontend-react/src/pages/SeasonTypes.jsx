import { useState } from 'react';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";

function SeasonTypes(props) {
    const [filters, setFilters] = useState({});

    return (
        <>
            <Title title={props.title} />
            <Filters type="seasonTypes" onFilterChange={setFilters} classCols={props.classCols} />
            <Table type="seasonTypes" filters={filters} classCols={props.classCols} />
        </>
    );
}

export default SeasonTypes;
