import Title from '../components/Title';
import Table from "../components/Table.jsx";

function Seasons(props) {
  return (
    <>
      <Title title={props.title} />
      <Table type="seasons" />
	  </> 
  );
}

export default Seasons;
