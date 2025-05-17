import { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import Card from '../components/Card';
import Chart from '../components/Chart';
import { groupSalesByMonth } from '../utils/statisticsData';
import { CONFIG } from '../../config.js';


function ControlPanel(props) {
    const [groupedSales, setGroupedSales] = useState([]);
    const config = CONFIG["sales"];
    
    useEffect(() => {
        const fetchSales = async () => {
        try {
            const response = await axios.get(config.endpoint);
            const grouped = groupSalesByMonth(response.data);
            setGroupedSales(grouped);
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
                    <div className='col-lg-8'>
                        <Card element={<Chart height={300} data={groupedSales} dataKey="sales" />} />
                    </div>
                    <div className="col-lg-4">
                        <Card element={<></>} />
                    </div>
                </div>
        </>
    );
}

export default ControlPanel;