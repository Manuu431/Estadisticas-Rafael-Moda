import { useState, useEffect } from 'react';
import axios from 'axios';
import { CONFIG } from '../../config.js';

function Table({ type, filters = {} }) {
    const [data, setData] = useState([]);
    const config = CONFIG[type];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(config.endpoint, {
                    params: filters,
                    paramsSerializer: params => {
                        return Object.entries(params)
                            .map(([key, val]) => {
                                if (Array.isArray(val)) {
                                    return val.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
                                }
                                return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
                            }).join('&');
                    }
                });

                setData(response.data);
            } catch (error) {
                console.error(`Error obtaining ${type} data:`, error.response ? error.response.data : error);
            }
        };

        fetchData();
    }, [config.endpoint, filters]);

    return (
        <div className="row">
            <div className="col-12 mt-4">
                <table className="table table-bordered border-dark table-striped table-hover w-100 text-center">
                    <thead>
                        <tr>
                            {config.columns.map((columnName, index) => (
                                <th className="py-1" key={index}>{columnName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {config.values.map((columnName, colIndex) => {
                                    let formattedValue = item[columnName];

                                    if (columnName.toLowerCase().includes("date") && item[columnName]) {
                                        formattedValue = new Date(item[columnName]).toLocaleDateString('es-ES');
                                    }

                                    return (
                                        <td className="py-1" key={colIndex}>
                                            {formattedValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
