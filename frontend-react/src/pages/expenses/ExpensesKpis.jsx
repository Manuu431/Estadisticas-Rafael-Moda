import { expensesKpis } from '../../utils/expenses.js';

function ExpensesKpis({ totals, compact }) {
    const kpis = expensesKpis(totals);
    const blocks = [
        { key: 'amount', label: 'Ingresos', dot: 'is-income', value: kpis.amount, note: 'Lo que han pagado los clientes' },
        {
            key: 'cost',
            label: 'Gastos en mercancía',
            dot: 'is-cost',
            value: kpis.cost,
            note: `Lo que costó la ropa vendida · ${kpis.costShare}${compact ? '' : ' de lo ingresado'}`
        },
        { key: 'profit', label: 'Beneficio', value: kpis.profit, positive: true, note: `Te quedas con el ${kpis.profitShare} de cada venta` }
    ];
    const content = (block) => (
        <>
            <span className="expenses-kpi-label">
                {block.dot && <span className={`panel-dot ${block.dot}`} aria-hidden="true" />}
                {block.label}
            </span>
            <span className={`expenses-kpi-value${block.positive ? ' text-positive' : ''}`}>{block.value}</span>
            <span className="expenses-kpi-note">{block.note}</span>
        </>
    );

    if (compact) {
        return (
            <section className="panel-card expenses-kpis-card" aria-label="Resumen">
                {blocks.map((block) => (
                    <div className="expenses-kpi-block" key={block.key}>{content(block)}</div>
                ))}
            </section>
        );
    }

    return (
        <div className="expenses-kpis">
            {blocks.map((block) => (
                <section className="panel-card expenses-kpi" key={block.key}>{content(block)}</section>
            ))}
        </div>
    );
}

export default ExpensesKpis;