export default function Card(props) {
    return (
        <div className="card">
            <h3 className="card-header bg-orange py-4 px-4 text-white d-flex justify-content-between">
                <div className="d-flex align-items-center">
                    {props.title}
                </div>
                <div className="d-flex align-items-center">
                    {props.secondaryElement}
                </div>
            </h3>
            <div className="card-body bg-light-gray">
                {props.element}
            </div>
        </div>
    );
}