import { useState } from 'react';
import { formatNumber } from '../../utils/format.js';
import { clientInitials, clientMeta } from '../../utils/clientsList.js';
import { remainingCount } from '../../utils/salesDays.js';

const PAGE = 12;

function ClientsMobileList({ rows }) {
    const [shown, setShown] = useState({ rows, count: PAGE });
    const count = shown.rows === rows ? shown.count : PAGE;
    const remaining = remainingCount(rows.length, count);
    return (
        <div className="clients-list">
            <ul className="m-list list-unstyled m-0">
                {rows.slice(0, count).map((client) => (
                    <li className="clients-item" key={client.id}>
                        <span className="clients-avatar" aria-hidden="true">{clientInitials(client.name)}</span>
                        <span className="clients-item-main">
                            <span className="clients-item-name">{client.name}</span>
                            <span className="clients-item-meta">{clientMeta(client)}</span>
                        </span>
                    </li>
                ))}
            </ul>
            {remaining > 0 && (
                <button type="button" className="m-btn w-100" onClick={() => setShown({ rows, count: count + PAGE })}>
                    Ver más clientes ({formatNumber(remaining)})
                </button>
            )}
        </div>
    );
}

export default ClientsMobileList;