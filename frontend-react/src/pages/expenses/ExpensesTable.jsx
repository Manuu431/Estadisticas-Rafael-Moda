const FOOT = 'En los meses de rebajas el porcentaje baja porque se vende con descuento.';
const FOOT_COMPACT = 'En rebajas el porcentaje baja porque se vende con descuento.';

function ExpensesTable({ grain, table, compact }) {
    const foot = compact ? FOOT_COMPACT : FOOT;
    const title = grain === 'year' ? 'Año a año' : 'Mes a mes';

    return (
        <section className="panel-card expenses-card is-table" aria-label={title}>
            <h2 className="panel-card-title m-0">{title}</h2>
            <div className="expenses-table" role="table" aria-label="Ingresos, gastos y beneficio">
                <div role="row" className="expenses-row is-head">
                    <span role="columnheader"><span className="visually-hidden">Periodo</span></span>
                    <span role="columnheader">Ingresos</span>
                    <span role="columnheader" className="expenses-cell-cost">Gastos</span>
                    <span role="columnheader">Beneficio</span>
                    <span role="columnheader">%</span>
                </div>
                {table.rows.map((row) => (
                    <div role="row" className="expenses-row" key={row.key}>
                        <span role="cell" className="expenses-cell-name">{row.name}</span>
                        <span role="cell">{row.amount}</span>
                        <span role="cell" className="expenses-cell-cost">{row.cost}</span>
                        <span role="cell" className="expenses-cell-profit">{row.profit}</span>
                        <span role="cell" className={`expenses-pct${row.low ? ' is-low' : ''}`}>{row.share}</span>
                    </div>
                ))}
            </div>
            <p className="expenses-foot">{table.note ? `${table.note} ${foot}` : foot}</p>
        </section>
    );
}

export default ExpensesTable;