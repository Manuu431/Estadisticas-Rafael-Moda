export function Skeleton({ className }) {
    return <span className={`panel-skeleton${className ? ` ${className}` : ''}`} />;
}

export function CardError({ onRetry }) {
    return (
        <div className="d-flex flex-column align-items-start gap-3 flex-grow-1" role="alert">
            <span className="panel-note">No se han podido cargar estos datos.</span>
            <button type="button" className="btn btn-brand-outline" onClick={onRetry}>Reintentar</button>
        </div>
    );
}