const COLUMNS = ['Nombre', 'Ciudad', 'Provincia', 'CP'];

function ClientsTable({ data }) {
    return (
        <div role="table" aria-label="Clientes">
            <div role="row" className="clients-row is-head">
                {COLUMNS.map((name) => (
                    <span role="columnheader" key={name} className={name === 'CP' ? 'clients-num' : ''}>{name}</span>
                ))}
            </div>
            {data.map((client) => (
                <div role="row" className="clients-row" key={client.id}>
                    <span role="cell" className="clients-name">{client.name}</span>
                    <span role="cell" className="clients-trunc">{client.city}</span>
                    <span role="cell" className="clients-trunc clients-muted">{client.province}</span>
                    <span role="cell" className="clients-num clients-muted">{client.postal_code}</span>
                </div>
            ))}
        </div>
    );
}

export default ClientsTable;