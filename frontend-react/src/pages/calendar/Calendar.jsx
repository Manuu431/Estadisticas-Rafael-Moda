import Title from '../../components/Title.jsx';
import EventCalendar from './EventCalendar.jsx';
import { DATABASE_TABLES } from "../../config/database.js";
import { useFetch } from "../../hooks/useFetch.js";
function Calendar(props) {
    const { data: campaigns } = useFetch(DATABASE_TABLES['campaigns'].endpoint);
    const { data: seasons } = useFetch(DATABASE_TABLES['seasons'].endpoint);
    return (
        <>
            <Title title={props.title} />
            <EventCalendar campaigns={campaigns ?? []} seasons={seasons ?? []} />
        </>
    );
}
export default Calendar;