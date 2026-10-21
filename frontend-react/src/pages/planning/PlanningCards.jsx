import { CardError, Skeleton } from '../controlPanel/cards/CardState.jsx';
import { formatEuros } from '../../utils/format.js';
import { editionDates } from '../../utils/planning.js';
import { ActionButton, Balance, Profit, StatusPill } from './PlanningParts.jsx';

function Card({ row, open, onToggle, onEdit, onDelete, onEditEdition, highlightId }) {
    const panelId = `editions-${row.type.id}`;

    return (
        <article className={`planning-m-card${open ? ' is-open' : ''}`}>
            <button type="button" className="planning-m-head" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
                <span className="planning-m-text">
                    <span className="planning-m-name">{row.type.name}</span>
                    <span className="planning-m-meta">{row.range} · {row.count}</span>
                    <span className="planning-m-status">
                        <StatusPill status={row.status} />
                        <span className="planning-m-last">
                            {row.last ? (
                                <>Última: <Profit value={row.last.profit} /> en {row.last.year}</>
                            ) : (
                                'Sin ediciones terminadas'
                            )}
                        </span>
                    </span>
                </span>
                <i className={`planning-chevron bi ${open ? 'bi-chevron-down is-open' : 'bi-chevron-right'}`} aria-hidden="true" />
            </button>
            {open ? (
                <div className="planning-m-body" id={panelId}>
                    {row.editions.length === 0 ? (
                        <p className="panel-muted planning-m-empty">Sin ediciones. Pulsa «Generar años pendientes» para crearlas.</p>
                    ) : (
                        row.editions.map((edition) => (
                            <div
                                className={`planning-m-edition${highlightId === edition.id ? ' is-highlighted' : ''}`}
                                id={`edition-${edition.id}`}
                                key={edition.id}
                            >
                                <div className="planning-m-edition-head">
                                    <span className="planning-m-edition-name">{edition.name}</span>
                                    <ActionButton icon="bi-pencil" label={`Editar ${edition.name}`} onClick={() => onEditEdition(edition)} />
                                </div>
                                <span className="planning-m-edition-dates">{editionDates(edition.start_date, edition.end_date)}</span>
                                <dl className="planning-m-figures">
                                    <div><dt>Gastos</dt><dd>{formatEuros(edition.expenses)}</dd></div>
                                    <div><dt>Beneficio</dt><dd>{formatEuros(edition.profits)}</dd></div>
                                    <div><dt>Balance</dt><dd><Balance value={edition.balance} /></dd></div>
                                </dl>
                            </div>
                        ))
                    )}
                    <div className="planning-m-actions">
                        <button type="button" className="planning-m-action" onClick={() => onEdit(row)}>
                            <i className="bi bi-pencil" aria-hidden="true" />
                            Editar
                        </button>
                        <button type="button" className="planning-m-action" onClick={() => onDelete(row)}>
                            <i className="bi bi-trash3" aria-hidden="true" />
                            Eliminar
                        </button>
                    </div>
                </div>
            ) : null}
        </article>
    );
}

export function PlanningCards({ tab, rows, state, openId, onToggle, onEdit, onDelete, onEditEdition, onRetry, highlightId }) {
    if (state === 'loading') {
        return (
            <div className="planning-m-list" aria-busy="true">
                {[0, 1, 2].map((index) => <Skeleton key={index} className="planning-skeleton-card" />)}
            </div>
        );
    }
    if (state === 'error') return <div className="planning-m-card planning-m-state"><CardError onRetry={onRetry} /></div>;
    if (state === 'empty') return <div className="planning-m-card planning-m-state"><p className="sales-state-text">{tab.empty}</p></div>;

    return (
        <div className="planning-m-list">
            {rows.map((row) => (
                <Card
                    key={row.type.id}
                    row={row}
                    open={openId === row.type.id}
                    onToggle={() => onToggle(row.type.id)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onEditEdition={onEditEdition}
                    highlightId={highlightId}
                />
            ))}
        </div>
    );
}
