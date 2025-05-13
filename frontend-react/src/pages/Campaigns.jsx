import Title from '../components/Title';
import Table from "../components/Table.jsx";

function Campaigns(props) {
  return (
    <>
        <Title title={props.title} />
        <Table type="campaigns" />
    </>
  );
}

export default Campaigns;
