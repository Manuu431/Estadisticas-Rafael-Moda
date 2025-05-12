import Title from '../components/Title';
import SalesTable from "../components/Table.jsx";

function Sales(props) {
    return (
        <>
            <Title title={props.title} />
            <SalesTable type="sales" />
        </>
    );
}

export default Sales;