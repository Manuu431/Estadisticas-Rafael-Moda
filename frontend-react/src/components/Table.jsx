import { useState, useEffect } from 'react';
import axios from 'axios';
import { CONFIG } from '../../config.js';

function Table({ type }) {
    const [data, setData] = useState([]);
    const config = CONFIG[type];

    useEffect(() => {
        axios.get(config.endpoint)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error(`Error obtaining ${type} data:`, error.response ? error.response.data : error);
            });
    }, [config.endpoint]);

    return (
        <>
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
                                <tr
                                    key={index}
                                >
                                    {config.values.map((columnName, colIndex) => {
                                        const value = item[columnName.toLowerCase().replace(/\s/g, '_')];

                                        let formattedValue = value;

                                        if (columnName.toLowerCase().includes("date") && value) {
                                            formattedValue = new Date(value).toLocaleDateString('es-ES');
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
        </>
    );
}

export default Table;