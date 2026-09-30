import { useMemo, useState } from 'react';
import {
    PanelCard,
    MonthSummary,
    StackedBarChart,
    Select,
    GroupBySelector,
    PieChart,
    SectionBreakdown,
    UpcomingCampaigns,
    CampaignButtons
} from './ControlPanelComponents.jsx';
import { getUniqueBrands, groupSalesByMonthAndBrand } from '../../utils/statisticsData.js';
import { DATABASE_TABLES } from "../../config/database.js";
import { useFetch } from '../../hooks/useFetch.js';
import { GROUP_BY_OPTIONS } from '../../config/info.js';
import { startOfMonth, format, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const groupByLabel = (groupBy) => GROUP_BY_OPTIONS.find((option) => option.value === groupBy)?.label ?? groupBy;

function ControlPanel(props) {
    const { data: sales } = useFetch(DATABASE_TABLES["sales"].endpoint);
    const { data: campaigns } = useFetch(DATABASE_TABLES["campaigns"].endpoint);
    const salesData = sales ?? [];
    const campaignsData = campaigns ?? [];
    const salesByMonthAndBrand = useMemo(() => (sales?.length > 0 ? groupSalesByMonthAndBrand(sales) : []), [sales]);
    const brandList = useMemo(() => (sales?.length > 0 ? getUniqueBrands(sales) : []), [sales]);
    const [groupBy, setGroupBy] = useState("family");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingCampaigns = campaignsData.filter(c => new Date(c.start_date) >= today);
    const [campaignIndex, setCampaignIndex] = useState(0);
    const initialMonth = startOfMonth(new Date());
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const monthSales = useMemo(() => (sales ?? []).filter(sale => isSameMonth(parseISO(sale.sale_date), selectedMonth)), [sales, selectedMonth]);
    const monthLabel = format(selectedMonth, 'MMMM', { locale: es });

    return (
        <>
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
                <div className="d-flex flex-column gap-1">
                    <span className="panel-kicker">{capitalize(format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }))}</span>
                    <h1 className="panel-title m-0">{props.title}</h1>
                </div>
                <Select selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
            </header>
            <div className="row g-4 align-items-start">
                <div className="col-12 col-xl-5">
                    <PanelCard title={`Resumen de ${monthLabel}`} note="Sobre las ventas registradas">
                        <MonthSummary sales={monthSales} />
                    </PanelCard>
                </div>
                <div className="col-12 col-xl-7">
                    <PanelCard title="Ventas por marca" note="Prendas de los últimos 12 meses">
                        <StackedBarChart data={salesByMonthAndBrand} brands={brandList} />
                    </PanelCard>
                </div>
                <div className="col-12 col-xl-7">
                    <PanelCard
                        title={`Ventas por ${groupByLabel(groupBy)} de ${monthLabel}`}
                        note="Prendas vendidas"
                        action={<GroupBySelector groupBy={groupBy} setGroupBy={setGroupBy} />}
                    >
                        <PieChart salesData={salesData} selectedMonth={selectedMonth} groupBy={groupBy} />
                    </PanelCard>
                </div>
                <div className="col-12 col-xl-5">
                    <PanelCard
                        title="Próximas campañas"
                        action={
                            <CampaignButtons
                                currentIndex={campaignIndex}
                                setCurrentIndex={setCampaignIndex}
                                total={upcomingCampaigns.length}
                            />
                        }
                    >
                        <UpcomingCampaigns data={campaignsData} startIndex={campaignIndex} />
                    </PanelCard>
                </div>
                <div className="col-12">
                    <PanelCard title={`Ventas por sección de ${monthLabel}`}>
                        <SectionBreakdown sales={monthSales} />
                    </PanelCard>
                </div>
            </div>
        </>
    );
}

export default ControlPanel;