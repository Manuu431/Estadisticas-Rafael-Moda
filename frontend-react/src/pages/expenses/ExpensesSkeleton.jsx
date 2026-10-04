import { Skeleton } from '../controlPanel/cards/CardState.jsx';

const KPIS = [0, 1, 2];
function ExpensesSkeleton({ rows, compact }) {
    return (
        <>
            {compact ? (
                <section className="panel-card expenses-kpis-card" aria-busy="true" aria-label="Cargando los totales">
                    {KPIS.map((index) => (
                        <div className="expenses-kpi-block" key={index}>
                            <Skeleton className="expenses-skeleton-label" />
                            <Skeleton className="expenses-skeleton-value" />
                            <Skeleton className="expenses-skeleton-note" />
                        </div>
                    ))}
                </section>
            ) : (
                <div className="expenses-kpis">
                    {KPIS.map((index) => (
                        <section className="panel-card expenses-kpi" aria-busy="true" aria-label="Cargando los totales" key={index}>
                            <Skeleton className="expenses-skeleton-label" />
                            <Skeleton className="expenses-skeleton-value" />
                            <Skeleton className="expenses-skeleton-note" />
                        </section>
                    ))}
                </div>
            )}
            <div className="expenses-main">
                <section className="panel-card expenses-card" aria-busy="true" aria-label="Cargando la gráfica">
                    <div className="expenses-card-head">
                        <Skeleton className="expenses-skeleton-title" />
                        <Skeleton className="expenses-skeleton-legend" />
                    </div>
                    <div className="expenses-chart">
                        <Skeleton className="expenses-skeleton-chart" />
                    </div>
                </section>
                <section className="panel-card expenses-card is-table" aria-busy="true" aria-label="Cargando la tabla">
                    <Skeleton className="expenses-skeleton-title" />
                    <div className="expenses-table">
                        <div className="expenses-skeleton-head" />
                        {Array.from({ length: rows }, (_, index) => (
                            <div className="expenses-skeleton-row" key={index}>
                                <Skeleton className="expenses-skeleton-line" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="expenses-skeleton-foot" />
                </section>
            </div>
        </>
    );
}

export default ExpensesSkeleton;