import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

function Campaigns(props) {
  return (
    <>
        <Title title={props.title} />
        <Filters type="campaigns" />
        <Table type="campaigns" />
    </>
  );
}

export default Campaigns;
