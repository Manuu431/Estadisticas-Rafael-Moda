import { useMemo, useState } from 'react';
import Filters from "../components/Filters.jsx";
import Table from "../components/table/Table.jsx";
import PanelCard from "../components/PanelCard.jsx";
import SectionBreakdown from "../components/SectionBreakdown.jsx";
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { summarizeBySection } from "../utils/statisticsData.js";
import { formatNumber, formatMoney } from "../utils/format.js";

const countActive = (filters) =>
    Object.values(filters).filter((value) => (Array.isArray(value) ? value.length > 0 : value !== '' && value != null)).length;

function Sales(props) {
    const [filters, setFilters] = useState({});
    const { data } = useFetch(DATABASE_TABLES["sales"].endpoint, filters);
    const summary = useMemo(() => summarizeBySection(data ?? []), [data]);
    const active = countActive(filters);

    return (
        <>
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
                <div className="d-flex flex-column gap-1">
                    <span className="panel-kicker">
                        {active === 0 ? 'Sin filtros aplicados' : `${active} ${active === 1 ? 'filtro aplicado' : 'filtros aplicados'}`}
                    </span>
                    <h1 className="panel-title m-0">{props.title}</h1>
                </div>
                <p className="panel-kicker text-md-end m-0">
                    <strong className="text-body">{formatNumber(summary.total.units)}</strong> prendas ·{' '}
                    <strong className="text-body">{formatMoney(summary.total.profitCents)}</strong> de beneficio
                    <br />
                    {formatNumber(summary.total.sales)} líneas de venta
                </p>
            </header>
            <div className="d-flex flex-column gap-4">
                <Filters type="sales" onFilterChange={setFilters} />
                <PanelCard title="Ventas por sección" note="Sobre el resultado filtrado">
                    <SectionBreakdown sales={data} />
                </PanelCard>
                <Table type="sales" filters={filters} />
            </div>
        </>
    );
}

export default Sales;