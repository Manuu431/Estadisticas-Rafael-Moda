export default function Card(props) {
    return (
        <div className="card">
            <h3 className="card-header bg-orange py-3 ps-4 text-white">{props.title}</h3>
            <div className="card-body">
                {props.element}
            </div>
        </div>
    );
}