import { getValueLabel } from '../../config/labels.js';
import { formatEuros, formatEurosSigned } from '../../utils/format.js';
import { formatSaleDay, formatSaleTime } from '../../utils/dates.js';

const COLUMNS = ['Fecha', 'Prenda', 'Marca', 'Sección', 'Talla', 'Uds.', 'Importe', 'Beneficio'];
const NUMERIC = ['Uds.', 'Importe', 'Beneficio'];

function SalesTable({ data }) {
    const today = new Date();
    return (
        <div role="table" aria-label="Ventas" className="sales-scroll">
            <div role="row" className="sales-row is-head">
                {COLUMNS.map((name) => (
                    <span role="columnheader" key={name} className={NUMERIC.includes(name) ? 'sales-num' : ''}>{name}</span>
                ))}
            </div>
            {data.map((item) => (
                <div role="row" className="sales-row" key={item.id}>
                    <span role="cell" className="sales-stack">
                        <span className="sales-strong">{formatSaleDay(item.sale_date, today)}</span>
                        <span className="sales-sub">{formatSaleTime(item.sold_at)}</span>
                    </span>
                    <span role="cell" className="sales-stack">
                        <span className="sales-name">{item.product}</span>
                        {item.color ? <span className="sales-sub">{item.color}</span> : null}
                    </span>
                    <span role="cell" className="sales-trunc">{item.brand}</span>
                    <span role="cell">
                        <span className={`sales-pill is-${item.section}`}>{getValueLabel('section', item.section)}</span>
                    </span>
                    <span role="cell">{item.size}</span>
                    <span role="cell" className="sales-num">{item.units}</span>
                    <span role="cell" className="sales-num sales-amount">{formatEuros(item.amount)}</span>
                    <span role="cell" className={`sales-num sales-profit${item.profit < 0 ? ' is-negative' : ''}`}>{item.profit < 0 ? formatEurosSigned(item.profit) : formatEuros(item.profit)}</span>
                </div>
            ))}
        </div>
    );
}

export default SalesTable;