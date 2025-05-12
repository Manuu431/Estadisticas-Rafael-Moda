import Title from '../components/Title';
import Table from "../components/Table.jsx";

function Clients(props) {
  return (
    <>
      <Title title={props.title} />
      <Table type="clients" />
	</> 
  );
}

export default Clients;
