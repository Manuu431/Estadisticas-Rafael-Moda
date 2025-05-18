import { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import Card from '../components/Card';
import { TinyBarChart, PieChart } from '../utils/ControlPanelComponents.jsx';
import { groupSalesByMonth, groupSalesByBrand } from '../utils/statisticsData';
import { CONFIG } from '../../config.js';


function ControlPanel(props) {
    const [salesByMonth, setSalesByMonth] = useState([]);
    const [salesByBrand, setSalesByBrand] = useState([]);
    const config = CONFIG["sales"];
    
    useEffect(() => {
        const fetchSales = async () => {
        try {
            const response = await axios.get(config.endpoint);
            const groupedByMonth = groupSalesByMonth(response.data);
            const groupedByBrand = groupSalesByBrand(response.data);
            setSalesByMonth(groupedByMonth);
            setSalesByBrand(groupedByBrand);
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
        };

        fetchSales();
    }, []);

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
                        <Card element={<PieChart data={salesByBrand} />} title="Ventas por marca" />
                    </div>
                </div>
        </>
    );
}

export default ControlPanel;