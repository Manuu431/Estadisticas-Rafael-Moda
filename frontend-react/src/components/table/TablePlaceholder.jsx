import { useIsMobile } from '../../utils/useIsMobile.js';
import { CardError } from '../../pages/controlPanel/cards/CardState.jsx';

export function TableState({ state, loadingText, onRetry }) {
    return (
        <div className="sales-state">
            {state.kind === 'loading' && (
                <p className="sales-state-text" role="status">
                    <span className="spinner-border spinner-border-sm sales-spinner" aria-hidden="true" />
                    {loadingText}
                </p>
            )}
            {state.kind === 'empty' && <p className="sales-state-text">{state.message}</p>}
            {state.kind === 'error' && <CardError onRetry={onRetry} />}
        </div>
    );
}

function TablePlaceholder({ header, ...props }) {
    const isMobile = useIsMobile();
    return (
        <>
            {isMobile ? null : header}
            <TableState {...props} />
        </>
    );
}

export default TablePlaceholder;