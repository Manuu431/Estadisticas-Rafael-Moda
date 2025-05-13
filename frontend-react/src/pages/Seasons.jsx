import Title from '../components/Title';
import Filters from "../components/Filters.jsx";
import Table from "../components/Table.jsx";

function Seasons(props) {
  return (
    <>
      <Title title={props.title} />
      <Filters type="seasons" />
      <Table type="seasons" />
    </>
  );
}

export default Seasons;
