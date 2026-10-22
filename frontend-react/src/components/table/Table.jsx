import Pagination from '../Pagination.jsx';
import { PAGE_SIZE } from '../../utils/salesPage.js';
import SalesTable from './SalesTable.jsx';

function Table({ rows, total, page, onPageChange }) {
    return (
        <div className="d-flex flex-column gap-3">
            <div className="data-card">
                <SalesTable data={rows} />
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(total / PAGE_SIZE)}
                    onPageChange={onPageChange}
                    totalItems={total}
                    pageSize={PAGE_SIZE}
                    itemLabel="líneas"
                    edges
                />
            </div>
        </div>
    );
}

export default Table;