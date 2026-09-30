import { formatNumber } from '../utils/format.js';

function Pagination({ currentPage, totalPages, onPageChange, totalItems = 0, pageSize = 0, itemLabel = 'registros' }) {
    const pages = Math.max(totalPages, 1);
    const handleClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= pages) onPageChange(pageNumber);
    };
    const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const last = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="data-foot d-flex flex-wrap align-items-center justify-content-between gap-3">
            <span>Mostrando {first}–{last} de {formatNumber(totalItems)} {itemLabel}</span>
            <div className="d-flex align-items-center gap-2">
                <button
                    type="button"
                    className="data-page"
                    onClick={() => handleClick(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Página anterior"
                >
                    <i className="bi bi-chevron-left" aria-hidden="true" />
                </button>
                <span className="px-1">Página <strong className="text-body">{currentPage}</strong> de {pages}</span>
                <button
                    type="button"
                    className="data-page"
                    onClick={() => handleClick(currentPage + 1)}
                    disabled={currentPage >= pages}
                    aria-label="Página siguiente"
                >
                    <i className="bi bi-chevron-right" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export default Pagination;