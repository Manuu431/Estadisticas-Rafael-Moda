export default function Card(props) {
    return (
        <div className="card">
            <h3 className="card-header bg-orange py-3 ps-4 text-white">Ventas últimos 12 meses</h3>
            <div className="card-body">
                {props.element}
            </div>
        </div>
    );
}