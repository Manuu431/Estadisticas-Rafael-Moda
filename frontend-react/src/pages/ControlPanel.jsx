import Title from '../components/Title';
import SalesCard from '../components/SalesCard';

function ControlPanel(props) {
  return (
    <>
        <Title title={props.title} />
        <SalesCard />
    </>
  );
}

export default ControlPanel;