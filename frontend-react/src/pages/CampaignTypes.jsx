import { useState } from 'react';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";

function CampaignTypes(props) {
    const [filters, setFilters] = useState({});

    return (
        <>
            <Title title={props.title} />
            <Filters type="campaignTypes" onFilterChange={setFilters} classCols={props.classCols} />
            <Table type="campaignTypes" filters={filters} classCols={props.classCols} />
        </>
    );
}

export default CampaignTypes;