import Title from '../components/Title';
import Table from "../components/Table.jsx";

function Sales(props) {
    return (
        <>
            <Title title={props.title} />
            <Table type="sales" />
        </>
    );
}

export default Sales;