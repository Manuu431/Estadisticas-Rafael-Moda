import Title from '../components/Title';

function Calendar(props) {
  return (
    <>
        <div className="row">
            <Title title={props.title} />
        </div>
    </>
  );
}

export default Calendar;
