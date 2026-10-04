import DeltaPill from '../../components/DeltaPill.jsx';
import { getValueLabel } from '../../config/labels.js';
import { COMPARE_GROUPS, deltaPercent } from '../../utils/compare.js';
import { formatEurosRound } from '../../utils/format.js';

function CompareBreakdown({ rows, group, names, isMobile }) {
    const nameOf = (row) => getValueLabel(group, row.name);

    if (rows.length === 0) return <p className="panel-note m-0">No hay ventas en estos periodos.</p>;

    if (isMobile) {
        return (
            <ul className="compare-list list-unstyled m-0">
                {rows.map((row) => (
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
        );
    }

    return (
        <div className="compare-table" role="table" aria-label={`Desglose por ${COMPARE_GROUPS.find((item) => item.value === group).label.toLowerCase()}`}>
            <div className="compare-row is-head" role="row">
                <span role="columnheader" />
                <span role="columnheader" className="compare-num">{names.shortA}</span>
                <span role="columnheader" className="compare-num">{names.shortB}</span>
                <span role="columnheader" className="compare-num">Diferencia</span>
            </div>
            {rows.map((row) => (
                <div className="compare-row" role="row" key={row.name}>
                    <span role="cell" className="compare-name">{nameOf(row)}</span>
                    <span role="cell" className="compare-num compare-strong">{formatEurosRound(row.a)}</span>
                    <span role="cell" className="compare-num compare-soft">{formatEurosRound(row.b)}</span>
                    <span role="cell" className="compare-num"><DeltaPill value={deltaPercent(row.a, row.b)} /></span>
                </div>
            ))}
        </div>
    );
}

export default CompareBreakdown;
