import { useEffect, useState } from 'react';
import Title from '../../components/Title.jsx';
import EventCalendar from './EventCalendar.jsx';
import axios from 'axios';
import { DATABASE_TABLES } from "../../config/database.js";

function Calendar(props) {
    const endpointCampaigns = DATABASE_TABLES['campaigns'].endpoint;
    const endpointSeasons = DATABASE_TABLES['seasons'].endpoint;
    const [campaigns, setCampaigns] = useState([]);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resCampaigns, resSeasons] = await Promise.all([
                    axios.get(endpointCampaigns),
                    axios.get(endpointSeasons),
                ]);
                setCampaigns(resCampaigns.data);
                setSeasons(resSeasons.data);
            } catch (err) {
                console.error('Error cargando datos:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Title title={props.title} />
            <EventCalendar campaigns={campaigns} seasons={seasons} />
        </>
    );
}

export default Calendar;