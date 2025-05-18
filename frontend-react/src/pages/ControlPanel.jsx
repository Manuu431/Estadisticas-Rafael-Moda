import { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import Card from '../components/Card';
import { StackedBarChart, Select, GroupBySelector, PieChart, Campaigns, CampaignButtons } from '../utils/ControlPanelComponents.jsx';
import { getUniqueBrands, groupSalesByMonthAndBrand } from '../utils/statisticsData';
import { DATABASE_TABLES } from "../../database.js";
import { startOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

const groupByLabels = {
    brand: "marca",
    family: "familia",
    size: "talla",
    color: "color",
};

function ControlPanel(props) {
    const [salesData, setSalesData] = useState([]);
    const [salesByMonthAndBrand, setSalesByMonthAndBrand] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [groupBy, setGroupBy] = useState("brand");
    const [campaignsData, setCampaignsData] = useState([]);
    const [campaignIndex, setCampaignIndex] = useState(0);
    const initialMonth = startOfMonth(new Date());
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const responseSales = await axios.get(DATABASE_TABLES["sales"].endpoint);
                setSalesData(responseSales.data);

                const responseCampaigns = await axios.get(DATABASE_TABLES["campaigns"].endpoint);
                setCampaignsData(responseCampaigns.data);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };

        fetchSales();
    }, []);

    useEffect(() => {
        if (salesData.length > 0) {
            const grouped = groupSalesByMonthAndBrand(salesData);
            setSalesByMonthAndBrand(grouped);
            const brands = getUniqueBrands(salesData);
            setBrandList(brands);
        }
    }, [salesData]);

    return (
        <>
            <Title title={props.title} />
            <div className='row my-3'>
                <div className='col-lg-7'>
                    <Card 
                        element={<StackedBarChart data={salesByMonthAndBrand} brands={brandList} />} 
                        title="Ventas por marca últimos 12 meses"
                    />
                </div>
                <div className="col-lg-5">
                    <Card 
                        element={<Campaigns data={campaignsData} startIndex={campaignIndex} />} 
                        secondaryElement={
                            <CampaignButtons 
                            currentIndex={campaignIndex} 
                            setCurrentIndex={setCampaignIndex} 
                            total={campaignsData.length} 
                            />
                        } 
                        title="Campañas" 
                    />
                </div>
                <div className='col-lg-7 mt-3'>
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
                </div>
            </div>
        </>
    );
}

export default ControlPanel;