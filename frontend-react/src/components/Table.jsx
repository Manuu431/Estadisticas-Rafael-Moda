import { useState, useEffect } from 'react';
import axios from 'axios';
import { CONFIG } from '../../config.js';
import HeaderTable from './HeaderTable.jsx';
import Pagination from './Pagination.jsx';

function Table({ type, filters = {}, classCols }) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const config = CONFIG[type];
    const haveHeader = type === "campaigns" || type === "seasons";

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
                setCurrentPage(1);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            } catch (error) {
                console.error(`Error obtaining ${type} data:`, error.response ? error.response.data : error);
            }
        };

        fetchData();
    }, [config.endpoint, filters]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            {haveHeader ? <HeaderTable classCols={classCols} /> : null}
            <div className={`row ${!haveHeader ? 'mt-3' : ''}`}>
                <div className="col-12">
                    <div className={`${!haveHeader ? 'rounded-top-3 overflow-hidden' : ''}`}>
                        <table className="table table-bordered border-dark table-striped table-hover w-100 text-center">
                            <thead>
                                <tr>
                                    {config.columns.map((columnName, index) => (
                                        <th className='text-white' key={index}>{columnName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, index) => (
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
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </>
    );
}

export default Table;