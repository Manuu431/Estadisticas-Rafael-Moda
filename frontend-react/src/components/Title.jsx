import '../App.css';

function Title(props) {
  return (
    <div className="col-12 py-3 bg-orange border-bottom border-dark">
        <h1 className='text-center m-0'>{props.title}</h1>
    </div>
  );
}

export default Title;