import { useState } from 'react';
import DeltaPill from '../../components/DeltaPill.jsx';
import { getValueLabel } from '../../config/labels.js';
import Pagination from '../../components/Pagination.jsx';
import { BREAKDOWN_PAGE_SIZE, COMPARE_GROUPS, deltaPercent } from '../../utils/compare.js';
import { formatEurosRound } from '../../utils/format.js';

function CompareBreakdown({ rows, group, names, isMobile }) {
    const [page, setPage] = useState(1);
    const { label, plural } = COMPARE_GROUPS.find((item) => item.value === group);
    const totalPages = Math.ceil(rows.length / BREAKDOWN_PAGE_SIZE);
    const visible = rows.slice((page - 1) * BREAKDOWN_PAGE_SIZE, page * BREAKDOWN_PAGE_SIZE);
    const nameOf = (row) => getValueLabel(group, row.name);
    if (rows.length === 0) return <p className="m-0 panel-note">No hay ventas en estos periodos.</p>;
    const list = isMobile ? (
        <ul className="list-unstyled m-0 compare-list">
            {visible.map((row) => (
                <li className="compare-item" key={row.name}>
                    <span className="compare-item-main">
                        <span className="compare-item-name">{nameOf(row)}</span>
                        <span className="compare-item-meta">{names.shortB}: {formatEurosRound(row.b)}</span>
                    </span>
                    <span className="compare-item-side">
                        <span className="compare-item-amount">{formatEurosRound(row.a)}</span>
                        <DeltaPill value={deltaPercent(row.a, row.b)} />
                    </span>
                </li>
            ))}
        </ul>
    ) : (
        <div className="compare-table" role="table" aria-label={`Desglose por ${label.toLowerCase()}`}>
            <div className="compare-row is-head" role="row">
                <span role="columnheader" />
                <span role="columnheader" className="compare-num">{names.shortA}</span>
                <span role="columnheader" className="compare-num">{names.shortB}</span>
                <span role="columnheader" className="compare-num">Diferencia</span>
            </div>
            {visible.map((row) => (
                <div className="compare-row" role="row" key={row.name}>
                    <span role="cell" className="compare-name">{nameOf(row)}</span>
                    <span role="cell" className="compare-num compare-strong">{formatEurosRound(row.a)}</span>
                    <span role="cell" className="compare-num compare-soft">{formatEurosRound(row.b)}</span>
                    <span role="cell" className="compare-num"><DeltaPill value={deltaPercent(row.a, row.b)} /></span>
                </div>
            ))}
        </div>
    );
    return (
        <>
            <div className="compare-body">{list}</div>
            <div className="compare-foot">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    totalItems={rows.length}
                    pageSize={BREAKDOWN_PAGE_SIZE}
                    itemLabel={plural}
                />
            </div>
        </>
    );
}

export default CompareBreakdown;