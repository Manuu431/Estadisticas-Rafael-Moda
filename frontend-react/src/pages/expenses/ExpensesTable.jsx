import { useState } from 'react';
import Pagination from '../../components/Pagination.jsx';
import { TABLE_ROWS, tablePage } from '../../utils/expenses.js';

const FOOT = 'En rebajas el porcentaje baja porque se vende con descuento.';

function ExpensesTable({ title, itemLabel, table }) {
    const [requested, setRequested] = useState(1);
    const { rows, pages, page } = tablePage(table.rows, requested);
    const paged = pages > 1;
    return (
        <section className="panel-card expenses-card is-table" aria-label={title}>
            <h2 className="m-0 panel-card-title">{title}</h2>
            <div className={`expenses-table${paged ? ' is-paged' : ''}`} role="table" aria-label="Ingresos, gastos y beneficio">
                <div role="row" className="expenses-row is-head">
                    <span role="columnheader"><span className="visually-hidden">Periodo</span></span>
                    <span role="columnheader">Ingresos</span>
                    <span role="columnheader" className="expenses-cell-cost">Gastos</span>
                    <span role="columnheader">Beneficio</span>
                    <span role="columnheader">%</span>
                </div>
                {rows.map((row) => (
                    <div role="row" className="expenses-row" key={row.key}>
                        <span role="cell" className="expenses-cell-name">{row.name}</span>
                        <span role="cell">{row.amount}</span>
                        <span role="cell" className="expenses-cell-cost">{row.cost}</span>
                        <span role="cell" className={`expenses-cell-profit${row.loss ? ' is-loss' : ''}`}>{row.profit}</span>
                        <span role="cell" className={`expenses-pct${row.low ? ' is-low' : ''}`}>{row.share}</span>
                    </div>
                ))}
            </div>
            <div className="expenses-tail">
                <p className="expenses-foot">{table.note ? `${table.note} ${FOOT}` : FOOT}</p>
                {paged && (
                    <Pagination
                        currentPage={page}
                        totalPages={pages}
                        onPageChange={setRequested}
                        totalItems={table.rows.length}
                        pageSize={TABLE_ROWS}
                        itemLabel={itemLabel}
                    />
                )}
            </div>
        </section>
    );
}

export default ExpensesTable;