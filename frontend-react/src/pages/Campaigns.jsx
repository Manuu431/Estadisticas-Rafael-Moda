import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";

function Campaigns(props) {
    const [filters, setFilters] = useState({});
    const location = useLocation();
    const [externalCampaign, setExternalCampaign] = useState(null);

    useEffect(() => {
        const storedCampaign = localStorage.getItem("temporalItem");
        if (storedCampaign) {
            const campaign = JSON.parse(storedCampaign);
            setExternalCampaign(campaign);
        }
    }, [location.state]);

    return (
        <>
            <Title title={props.title} />
            <Filters type="campaigns" onFilterChange={setFilters} classCols={props.classCols} />
            <Table
                type="campaigns"
                filters={filters}
                external={externalCampaign}
                setExternal={setExternalCampaign}
            />
        </>
    );
}

export default Campaigns;