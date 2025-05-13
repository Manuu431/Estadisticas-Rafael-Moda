import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

function Clients(props) {
  return (
    <>
        <Title title={props.title} />
        <Filters type="clients" />
        <Table type="clients" />
	</> 
  );
}

export default Clients;
