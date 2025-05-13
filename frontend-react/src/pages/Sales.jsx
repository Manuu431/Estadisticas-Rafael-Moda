import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

function Sales(props) {
    return (
        <>
            <Title title={props.title} />
            <Filters />
            <Table type="sales" />
        </>
    );
}

export default Sales;