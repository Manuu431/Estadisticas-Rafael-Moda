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
            <div className="col-12 mt-4">
                <table className="table table-bordered border-dark table-striped table-hover w-100 text-center">
                    <thead className="bg-light-gray text-white">
                        <tr>
                            {config.columns.map((columnName, index) => (
                                <th className="px-2 py-1" key={index}>{columnName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 0 ? 'bg-gray' : 'bg-light-gray'}
                            >
                                {config.values.map((columnName, colIndex) => (
                                    <td className="px-1 py-1" key={colIndex}>
                                        {item[columnName]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Table;