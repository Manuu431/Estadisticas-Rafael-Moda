import { formatNumber } from '../utils/format.js';

function PageButton({ label, icon, disabled, onClick }) {
    return (
        <button type="button" className="data-page" onClick={onClick} disabled={disabled} aria-label={label}>
            <i className={`bi ${icon}`} aria-hidden="true" />
        </button>
    );
}

function Pagination({ currentPage, totalPages, onPageChange, totalItems = 0, pageSize = 0, itemLabel = 'registros', edges = false }) {
    const pages = Math.max(totalPages, 1);
    const goTo = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= pages) onPageChange(pageNumber);
    };
    const first = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const last = Math.min(currentPage * pageSize, totalItems);
    const atStart = currentPage <= 1;
    const atEnd = currentPage >= pages;
    return (
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 data-foot">
            <span>Mostrando {formatNumber(first)}–{formatNumber(last)} de {formatNumber(totalItems)} {itemLabel}</span>
            <div className="d-flex align-items-center gap-2">
                {edges && <PageButton label="Primera página" icon="bi-chevron-double-left" disabled={atStart} onClick={() => goTo(1)} />}
                <PageButton label="Página anterior" icon="bi-chevron-left" disabled={atStart} onClick={() => goTo(currentPage - 1)} />
                <span className="data-page-label">Página <strong className="data-page-current">{formatNumber(currentPage)}</strong> de {formatNumber(pages)}</span>
                <PageButton label="Página siguiente" icon="bi-chevron-right" disabled={atEnd} onClick={() => goTo(currentPage + 1)} />
                {edges && <PageButton label="Última página" icon="bi-chevron-double-right" disabled={atEnd} onClick={() => goTo(pages)} />}
            </div>
        </div>
    );
}

export default Pagination;