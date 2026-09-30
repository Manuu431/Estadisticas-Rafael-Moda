function Title(props) {
  return (
      <div className="row">
        <div className="col-12 py-3 bg-primary border-bottom border-dark">
            <h1 className='text-center m-0'>{props.title}</h1>
        </div>
      </div>
  );
}

export default Title;