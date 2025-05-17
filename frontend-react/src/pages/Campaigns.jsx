import { useState } from 'react';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

function Campaigns(props) {
    const [filters, setFilters] = useState({});

    return (
        <>
            <Title title={props.title} />
            <Filters type="campaigns" onFilterChange={setFilters} classCols={props.classCols} />
            <Table type="campaigns" filters={filters} classCols={props.classCols} />
        </>
    );
}

export default Campaigns;
