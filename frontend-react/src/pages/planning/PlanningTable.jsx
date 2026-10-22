import { CardError, Skeleton } from '../controlPanel/cards/CardState.jsx';
import { formatEuros } from '../../utils/format.js';
import { editionDates, isStarted } from '../../utils/planning.js';
import { ActionButton, Balance, Profit, StatusPill } from './PlanningParts.jsx';

function Editions({ row, id, highlightId, onEditEdition, onSkip }) {
    if (row.editions.length === 0) {
        return <p className="panel-muted planning-empty-editions" id={id}>Sin ediciones. Pulsa «Generar años pendientes» para crearlas.</p>;
    }
    return (
        <div className="planning-editions" id={id} role="table" aria-label={`Ediciones de ${row.type.name}`}>
            <div className="planning-editions-head" role="row">
                <span role="columnheader">Edición</span>
                <span role="columnheader">Fechas</span>
                <span className="planning-num" role="columnheader">Gastos</span>
                <span className="planning-num" role="columnheader">Beneficio</span>
                <span className="planning-num" role="columnheader">Balance</span>
                <span role="columnheader" className="visually-hidden">Acciones</span>
            </div>
            {row.editions.map((edition) => (
                <div
                    className={`planning-edition${highlightId === edition.id ? ' is-highlighted' : ''}${edition.skipped ? ' is-skipped' : ''}`}
                    id={`edition-${edition.id}`}
                    role="row"
                    key={edition.id}
                >
                    <span className="planning-edition-name" role="cell">{edition.name}{edition.skipped ? ' · saltada' : ''}</span>
                    <span className="planning-edition-dates" role="cell">{editionDates(edition.start_date, edition.end_date)}</span>
                    <span className="planning-num" role="cell">{formatEuros(edition.expenses)}</span>
                    <span className="planning-num" role="cell">{formatEuros(edition.profits)}</span>
                    <span className="planning-num" role="cell"><Balance value={edition.balance} /></span>
                    <span className="planning-edition-action" role="cell">
                        <ActionButton icon="bi-pencil" label={`Editar ${edition.name}`} onClick={() => onEditEdition(edition)} />
                        {isStarted(edition, new Date()) ? null : (
                            <ActionButton
                                icon={edition.skipped ? 'bi-arrow-counterclockwise' : 'bi-slash-circle'}
                                label={`${edition.skipped ? 'Recuperar' : 'Saltar'} ${edition.name}`}
                                onClick={() => onSkip(edition)}
                            />
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
}

function Row({ row, open, onToggle, onEdit, onDelete, onEditEdition, onSkip, highlightId }) {
    const panelId = `editions-${row.type.id}`;
    return (
        <div className={`planning-type${open ? ' is-open' : ''}`}>
            <div className="planning-row planning-grid" onClick={onToggle}>
                <button
                    type="button"
                    className="planning-toggle"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggle();
                    }}
                >
                    <i className={`planning-chevron bi ${open ? 'bi-chevron-down is-open' : 'bi-chevron-right'}`} aria-hidden="true" />
                    <span className="planning-name">
                        <span className="planning-name-main">{row.type.name}</span>
                        <span className="planning-name-sub">{row.range}</span>
                    </span>
                </button>
                <div className="planning-cell"><StatusPill status={row.status} /></div>
                <div className="planning-cell">
                    {row.last ? (
                        <span className="planning-last">
                            <Profit value={row.last.profit} />
                            <span className="planning-name-sub">de beneficio en {row.last.year}</span>
                        </span>
                    ) : (
                        <span className="planning-last">
                            <span className="planning-profit">—</span>
                            <span className="planning-name-sub">sin ediciones terminadas</span>
                        </span>
                    )}
                </div>
                <div className="planning-cell planning-count-text">{row.count}</div>
                <div className="planning-actions">
                    <ActionButton icon="bi-pencil" label={`Editar ${row.type.name}`} onClick={() => onEdit(row)} />
                    <ActionButton icon="bi-trash3" label={`Eliminar ${row.type.name}`} onClick={() => onDelete(row)} />
                </div>
            </div>
            {open ? (
                <div className="planning-open">
                    <Editions row={row} id={panelId} highlightId={highlightId} onEditEdition={onEditEdition} onSkip={onSkip} />
                </div>
            ) : null}
        </div>
    );
}

function SkeletonRows() {
    return [0, 1, 2, 3].map((index) => (
        <div className="planning-row planning-grid is-skeleton" key={index} aria-hidden="true">
            <span />
            <div className="d-flex flex-column gap-2"><Skeleton className="w-50 planning-skeleton-line" /><Skeleton className="w-25 planning-skeleton-line" /></div>
            <Skeleton className="w-75 planning-skeleton-pill" />
            <div className="d-flex flex-column gap-2"><Skeleton className="w-50 planning-skeleton-line" /><Skeleton className="w-75 planning-skeleton-line" /></div>
            <Skeleton className="w-50 planning-skeleton-line" />
            <span />
        </div>
    ));
}

export function PlanningTable({ tab, rows, state, openId, onToggle, onEdit, onDelete, onEditEdition, onSkip, onNew, onSync, syncing, message, onRetry, highlightId, foot }) {
    return (
        <section className="data-card planning-card" role="tabpanel" aria-labelledby={`tab-${tab.slug}`}>
            <div className="planning-bar">
                <div className="planning-bar-text">
                    <p className="planning-intro">{tab.intro}</p>
                    {message ? <p className="m-0 panel-note planning-message" role="status">{message}</p> : null}
                </div>
                <div className="planning-bar-actions">
                    <button type="button" className="panel-btn planning-btn" onClick={onSync} disabled={syncing}>
                        {syncing ? <span className="spinner-border spinner-border-sm planning-spinner" aria-hidden="true" /> : <i className="bi bi-arrow-clockwise" aria-hidden="true" />}
                        Generar años pendientes
                    </button>
                    <button type="button" className="btn btn-brand planning-btn is-brand" onClick={onNew}>
                        <i className="bi bi-plus-lg" aria-hidden="true" />
                        {tab.newLabel}
                    </button>
                </div>
            </div>
            <div className="sales-scroll">
                <div className="planning-table">
                    <div className="planning-head planning-grid" role="row">
                        <span />
                        <span>Nombre</span>
                        <span>Estado</span>
                        <span>Última vez</span>
                        <span>Ediciones</span>
                        <span className="planning-head-actions">Acciones</span>
                    </div>
                    {state === 'loading' ? <SkeletonRows /> : null}
                    {state === 'error' ? <div className="sales-state"><CardError onRetry={onRetry} /></div> : null}
                    {state === 'empty' ? <div className="sales-state"><p className="sales-state-text">{tab.empty}</p></div> : null}
                    {state === 'ready'
                        ? rows.map((row) => (
                              <Row
                                  key={row.type.id}
                                  row={row}
                                  open={openId === row.type.id}
                                  onToggle={() => onToggle(row.type.id)}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  onEditEdition={onEditEdition}
                                  onSkip={onSkip}
                                  highlightId={highlightId}
                              />
                          ))
                        : null}
                </div>
            </div>
            {foot}
        </section>
    );
}