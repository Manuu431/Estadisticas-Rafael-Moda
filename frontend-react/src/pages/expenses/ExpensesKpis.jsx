import { expensesKpis } from '../../utils/expenses.js';

function ExpensesKpis({ totals }) {
    const kpis = expensesKpis(totals);

    return (
        <div className="expenses-kpis">
            <section className="panel-card expenses-kpi">
                <span className="expenses-kpi-label">
                    <span className="panel-dot is-income" aria-hidden="true" />
                    Ingresos
                </span>
                <span className="expenses-kpi-value">{kpis.amount}</span>
                <span className="expenses-kpi-note">Lo que han pagado los clientes</span>
            </section>
            <section className="panel-card expenses-kpi">
                <span className="expenses-kpi-label">
                    <span className="panel-dot is-cost" aria-hidden="true" />
                    Gastos en mercancía
                </span>
                <span className="expenses-kpi-value">{kpis.cost}</span>
                <span className="expenses-kpi-note">Lo que costó la ropa vendida · {kpis.costShare} de lo ingresado</span>
            </section>
            <section className="panel-card expenses-kpi">
                <span className="expenses-kpi-label">Beneficio</span>
                <span className="expenses-kpi-value text-positive">{kpis.profit}</span>
                <span className="expenses-kpi-note">Te quedas con el {kpis.profitShare} de cada venta</span>
            </section>
        </div>
    );
}

export default ExpensesKpis;