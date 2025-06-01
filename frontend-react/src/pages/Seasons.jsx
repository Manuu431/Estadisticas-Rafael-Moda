import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";

function Seasons(props) {
    const [filters, setFilters] = useState({});
    const location = useLocation();
    const [externalSeason, setExternalSeason] = useState(null);

    useEffect(() => {
        const storedSeason = localStorage.getItem("temporalItem");
        if (storedSeason) {
            const season = JSON.parse(storedSeason);
            setExternalSeason(season);
        }
    }, [location.state]);
    
    return (
        <>
            <Title title={props.title} />
            <Filters type="seasons" onFilterChange={setFilters} classCols={props.classCols} />
            <Table
                type="seasons"
                filters={filters}
                classCols={props.classCols}
                external={externalSeason}
                setExternal={setExternalSeason}
            />
        </>
    );
}

export default Seasons;
