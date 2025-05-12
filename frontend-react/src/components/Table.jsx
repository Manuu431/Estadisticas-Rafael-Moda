import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CONFIG } from '../../config.js';

function SalesTable({ type }) { // Cambia {props} a { type }
    const [data, setData] = useState([]);
    const config = CONFIG[type]; // Usa 'type' directamente, sin 'props.'

    useEffect(() => {
        axios.get(config.endpoint)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error(`Error obtaining ${type} data:`, error.response ? error.response.data : error);
            });
    }, [config.endpoint]);
    console.log(`data ${type}`, data);
    return (
        <>
            <table>
                <thead>
                <tr>
                    {config.columns.map((columnName, index) => (
                        <th key={index}>{columnName}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {config.values.map((columnName, colIndex) => (
                                <td key={colIndex}>{item[columnName.toLowerCase().replace(/\s/g, '_')]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default SalesTable;