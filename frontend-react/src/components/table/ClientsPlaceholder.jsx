import { CardError } from '../../pages/controlPanel/cards/CardState.jsx';
import ClientsTable from './ClientsTable.jsx';

function ClientsPlaceholder({ state, onRetry }) {
    return (
        <>
            <ClientsTable data={[]} />
            <div className="sales-state">
                {state.kind === 'loading' && (
                    <p className="sales-state-text" role="status">
                        <span className="spinner-border spinner-border-sm sales-spinner" aria-hidden="true" />
                        Cargando clientes…
                    </p>
                )}
                {state.kind === 'empty' && <p className="sales-state-text">{state.message}</p>}
                {state.kind === 'error' && <CardError onRetry={onRetry} />}
            </div>
        </>
    );
}

export default ClientsPlaceholder;