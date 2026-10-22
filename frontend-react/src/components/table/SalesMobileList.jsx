import { useMemo } from 'react';
import ShowMoreButton from './ShowMoreButton.jsx';
import { formatEuros, formatEurosSigned, formatMoney } from '../../utils/format.js';
import { formatSaleTime } from '../../utils/dates.js';
import { dayTitle, groupByDay, remainingCount, saleMeta, sortLatestFirst } from '../../utils/salesDays.js';

function SalesMobileList({ rows, total, days, onMore }) {
    const sorted = useMemo(() => sortLatestFirst(rows), [rows]);
    const groups = groupByDay(sorted, sorted.length, days);
    const remaining = remainingCount(total, sorted.length);
    const today = new Date();
    return (
        <div className="sales-days">
            {groups.map((group) => (
                <section className="sales-day" key={group.date}>
                    <div className="sales-day-head">
                        <h2 className="sales-day-title">{dayTitle(group.date, today)}</h2>
                        <span className="sales-day-sum">{formatMoney(group.sumCents)}</span>
                    </div>
                    <ul className="m-list list-unstyled m-0">
                        {group.items.map((item) => (
                            <li className="sales-item" key={item.id}>
                                <span className="sales-item-time">{formatSaleTime(item.sold_at)}</span>
                                <span className="sales-item-main">
                                    <span className="sales-item-title">{item.product}</span>
                                    <span className="sales-item-meta">{saleMeta(item)}</span>
                                </span>
                                <span className="sales-item-side">
                                    <span className="sales-item-amount">{formatEuros(item.amount)}</span>
                                    <span className={`sales-item-profit${item.profit < 0 ? ' is-negative' : ''}`}>{formatEurosSigned(item.profit)}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
            <ShowMoreButton remaining={remaining} noun="ventas" onClick={onMore} />
        </div>
    );
}

export default SalesMobileList;