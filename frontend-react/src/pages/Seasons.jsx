import { useState } from 'react';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

function Seasons(props) {
    const [filters, setFilters] = useState({});

    return (
        <>
            <Title title={props.title} />
            <Filters type="seasons" onFilterChange={setFilters} classCols={props.classCols} />
            <Table type="seasons" filters={filters} classCols={props.classCols} />
        </>
    );
}

export default Seasons;
