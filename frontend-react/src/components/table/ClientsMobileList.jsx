import ShowMoreButton from './ShowMoreButton.jsx';
import { useShowMore } from '../../hooks/useShowMore.js';
import { clientInitials, clientMeta } from '../../utils/clientsList.js';

function ClientsMobileList({ rows }) {
    const { visible, remaining, showMore } = useShowMore(rows);
    return (
        <div className="clients-list">
            <ul className="m-list list-unstyled m-0">
                {visible.map((client) => (
                    <li className="clients-item" key={client.id}>
                        <span className="clients-avatar" aria-hidden="true">{clientInitials(client.name)}</span>
                        <span className="clients-item-main">
                            <span className="clients-item-name">{client.name}</span>
                            <span className="clients-item-meta">{clientMeta(client)}</span>
                        </span>
                    </li>
                ))}
            </ul>
            <ShowMoreButton remaining={remaining} noun="clientes" onClick={showMore} />
        </div>
    );
}

export default ClientsMobileList;