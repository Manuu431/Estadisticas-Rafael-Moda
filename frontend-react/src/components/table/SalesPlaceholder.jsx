import { useIsMobile } from '../../utils/useIsMobile.js';
import { CardError } from '../../pages/controlPanel/cards/CardState.jsx';
import SalesTable from './SalesTable.jsx';

function SalesPlaceholder({ state, onRetry }) {
    const isMobile = useIsMobile();

    return (
        <div className="data-card">
            {isMobile ? null : <SalesTable data={[]} />}
            <div className="sales-state">
                {state.kind === 'loading' && (
                    <p className="sales-state-text" role="status">
                        <span className="spinner-border spinner-border-sm sales-spinner" aria-hidden="true" />
                        Cargando ventas…
                    </p>
                )}
                {state.kind === 'empty' && <p className="sales-state-text">{state.message}</p>}
                {state.kind === 'error' && <CardError onRetry={onRetry} />}
            </div>
        </div>
    );
}

export default SalesPlaceholder;