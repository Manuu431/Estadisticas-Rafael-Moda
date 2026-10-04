import DeltaPill from '../../components/DeltaPill.jsx';
import { formatEuros, formatNumber } from '../../utils/format.js';

const FORMATS = { money: formatEuros, number: formatNumber };

function CompareKpis({ kpis, shortB, isMobile }) {
    return (
        <div className="compare-kpis">
            {kpis.map((kpi) => {
                const format = FORMATS[kpi.kind];
                return (
                    <section className="compare-kpi" key={kpi.key} aria-label={kpi.label}>
                        <span className="compare-kpi-label">{kpi.label}</span>
                        <span className="compare-kpi-delta"><DeltaPill value={kpi.delta} /></span>
                        <span className="compare-kpi-value">{format(kpi.a)}</span>
                        <span className="compare-kpi-note">
                            {isMobile ? `${shortB}: ${format(kpi.b)}` : `frente a ${format(kpi.b)} en ${shortB}`}
                        </span>
                    </section>
                );
            })}
        </div>
    );
}

export default CompareKpis;
