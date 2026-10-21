import { useState, useEffect } from 'react';
import Pagination from '../Pagination.jsx';
import { getSortedData } from '../../utils/tableUtils.js';
import SalesTable from './SalesTable.jsx';

const PAGE_SIZE = 12;
const SORT = { key: 'sold_at', direction: 'desc' };

function Table({ rows }) {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => setCurrentPage(1), [rows]);

    const sortedData = getSortedData(rows, SORT);
    const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
    const currentData = sortedData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="d-flex flex-column gap-3">
            {currentData.length === 0 ? (
                <div className="data-card">
                    <p className="data-empty text-center m-0">No hay resultados con estos filtros.</p>
                </div>
            ) : (
                <div className="data-card">
                    <SalesTable data={currentData} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={sortedData.length}
                        pageSize={PAGE_SIZE}
                        itemLabel="líneas"
                        edges
                    />
                </div>
            )}
        </div>
    );
}

export default Table;
