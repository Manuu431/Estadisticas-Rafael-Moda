import { useState } from 'react';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";
import SectionSummary from "../components/SectionSummary.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
function Sales(props) {
    const [filters, setFilters] = useState({});
    const { data } = useFetch(DATABASE_TABLES["sales"].endpoint, filters);
    return (
        <>
            <Title title={props.title} />
            <Filters type="sales" onFilterChange={setFilters} classCols={props.classCols} />
            <div className="mt-3">
                <SectionSummary sales={data} />
            </div>
            <Table type="sales" filters={filters} />
        </>
    );
}
export default Sales;