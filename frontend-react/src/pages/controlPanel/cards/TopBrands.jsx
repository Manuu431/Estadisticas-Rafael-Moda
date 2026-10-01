import { formatEuros, formatEurosRound, formatShare, formatUnits, barWidth } from '../../../utils/format.js';
import { CardError, Skeleton } from './CardState.jsx';

function BrandsSkeleton() {
    return (
        <div className="d-flex flex-column gap-4 flex-grow-1">
            <div className="d-flex align-items-end justify-content-between gap-3 panel-divider-bottom pb-3">
                <div className="d-flex flex-column gap-2 w-50">
                    <Skeleton className="w-25" />
                    <Skeleton className="is-hero" />
                </div>
                <div className="d-flex flex-column gap-2 w-25">
                    <Skeleton className="is-stat" />
                    <Skeleton />
                </div>
            </div>
            <div className="d-flex flex-column gap-3">
                {[0, 1, 2, 3, 4].map((slot) => <Skeleton key={slot} />)}
            </div>
            <Skeleton className="w-50 mt-auto" />
        </div>
    );
}

export default function TopBrands({ brands, error, onRetry }) {
    if (error) return <CardError onRetry={onRetry} />;
    if (!brands) return <BrandsSkeleton />;

    const { ranking, total } = brands;
    const top = ranking[0];

    if (!top) return <p className="panel-muted m-0 d-flex align-items-center flex-grow-1">Todavía no hay ventas en este periodo.</p>;

    return (
        <div className="d-flex flex-column gap-4 flex-grow-1">
            <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap panel-divider-bottom pb-3">
                <div className="d-flex flex-column gap-1">
                    <span className="panel-label is-accent">N.º 1</span>
                    <span className="panel-display panel-display-brand">{top.name}</span>
                </div>
                <div className="panel-top-brand d-flex flex-column gap-1">
                    <span className="panel-stat">{formatEurosRound(top.total)}</span>
                    <span className="panel-muted">{formatUnits(top.units)} · {formatShare(top.total, total)} de las ventas</span>
                </div>
            </div>
            <ol className="list-unstyled d-flex flex-column gap-3 m-0">
                {ranking.map((brand, index) => (
                    <li className="panel-rank" key={brand.name}>
                        <span className="panel-muted">{index + 1}</span>
                        <span className="fw-medium text-truncate">{brand.name}</span>
                        <span className="panel-track">
                            <span className={`panel-fill d-block${index === 0 ? '' : ' is-soft'}`} style={barWidth(brand.total, top.total)} />
                        </span>
                        <span className="text-end fw-semibold">{formatEurosRound(brand.total)}</span>
                        <span className="text-end panel-muted">{formatUnits(brand.units)}</span>
                    </li>
                ))}
            </ol>
            <div className="panel-note mt-auto">Total del periodo: <strong>{formatEuros(total)}</strong></div>
        </div>
    );
}
