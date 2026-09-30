import { useMemo, useState } from 'react';
import Title from '../../components/Title.jsx';
import Card from '../../components/Card.jsx';
import SectionSummary from '../../components/SectionSummary.jsx';
import { StackedBarChart, Select, GroupBySelector, PieChart, UpcomingCampaigns, CampaignButtons } from './ControlPanelComponents.jsx';
import { getUniqueBrands, groupSalesByMonthAndBrand } from '../../utils/statisticsData.js';
import { DATABASE_TABLES } from "../../config/database.js";
import { useFetch } from '../../hooks/useFetch.js';
import { startOfMonth, format, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const groupByLabels = {
    section: "sección",
    brand: "marca",
    family: "familia",
    size: "talla",
    color: "color",
};

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

    return (
        <>
            <Title title={props.title} />
            <div className='row my-3'>
                <div className='col-lg-7 d-flex flex-column gap-3'>
                    <Card 
                        element={<StackedBarChart data={salesByMonthAndBrand} brands={brandList} />} 
                        title="Ventas por marca últimos 12 meses"
                    />
                    <Card 
                        element={
                            <>
                                <div className='d-flex align-items-center justify-content-between gap-3'>
                                    <Select selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
                                    <GroupBySelector groupBy={groupBy} setGroupBy={setGroupBy} />
                                </div>
                                <PieChart salesData={salesData} selectedMonth={selectedMonth} groupBy={groupBy} />
                            </>
                        }
                        title={`Ventas por ${groupByLabels[groupBy]} de ${format(selectedMonth, 'MMMM', { locale: es })}`}
                    />
                    <Card
                        element={<SectionSummary sales={monthSales} />}
                        title={`Ventas por sección de ${format(selectedMonth, 'MMMM', { locale: es })}`}
                    />
                </div>
                <div className="col-lg-5 mt-3 mt-xl-0">
                    <Card
                        element={<UpcomingCampaigns data={campaignsData} startIndex={campaignIndex} />}
                        secondaryElement={
                            <CampaignButtons
                                currentIndex={campaignIndex}
                                setCurrentIndex={setCampaignIndex}
                                total={upcomingCampaigns.length}
                            />
                        } 
                        title="Proximas campañas" 
                    />
                </div>
            </div>
        </>
    );
}

export default ControlPanel;