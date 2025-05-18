import { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import Card from '../components/Card';
import { TinyBarChart, PieChart, Select } from '../utils/ControlPanelComponents.jsx';
import { groupSalesByMonth, groupSalesByBrandForMonth } from '../utils/statisticsData';
import { CONFIG } from '../../config.js';
import { subMonths, startOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

function ControlPanel(props) {
    const [salesData, setSalesData] = useState([]);
    const [salesByMonth, setSalesByMonth] = useState([]);
    const [salesByBrand, setSalesByBrand] = useState([]);

    const initialMonth = startOfMonth(subMonths(new Date(), 11));
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);

    const config = CONFIG["sales"];

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get(config.endpoint);
                setSalesData(response.data);

                const groupedByMonth = groupSalesByMonth(response.data);
                setSalesByMonth(groupedByMonth);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };

        fetchSales();
    }, []);

    useEffect(() => {
        if (salesData.length > 0) {
            const filteredBrands = groupSalesByBrandForMonth(salesData, selectedMonth);
            setSalesByBrand(filteredBrands);
        }
    }, [selectedMonth, salesData]);

    return (
        <>
            <Title title={props.title} />
            <div className='row my-3'>
                <div className='col-lg-7'>
                    <Card element={<TinyBarChart data={salesByMonth} />} title="Ventas últimos 12 meses" />
                </div>
                <div className="col-lg-5">
                    <Card element={<>A</>} title="Eventos" />
                </div>
                <div className='col-lg-7 mt-3'>
                    <Card 
                      element={<PieChart data={salesByBrand} />} 
                      select={<Select selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />} 
                      title={`Ventas por marca de ${format(selectedMonth, 'MMMM', { locale: es })}`} 
                    />
                </div>
            </div>
        </>
    );
}

export default ControlPanel;