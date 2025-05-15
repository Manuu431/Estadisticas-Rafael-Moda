import { useState, useEffect } from 'react';
import axios from 'axios';
import { CONFIG } from '../../config.js';
import HeaderTable from './HeaderTable.jsx';
import Pagination from './Pagination.jsx';
import {
    handleSort,
    getSortedData,
    formatDate,
    serializeParams,
    getSortIconClass
} from '../utils/tableUtils.js';

function Table({ type, filters = {}, classCols }) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const itemsPerPage = 10;
    const config = CONFIG[type];
    const haveHeader = type === "campaigns" || type === "seasons";

    const sortedData = getSortedData(data, sortConfig);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(config.endpoint, {
                    params: filters,
                    paramsSerializer: serializeParams
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

    return (
        <>
            {haveHeader ? <HeaderTable classCols={classCols} /> : null}
            <div className={`row ${!haveHeader ? 'mt-3' : ''}`}>
                <div className="col-12">
                    <div className={`${!haveHeader ? 'rounded-top-3 overflow-hidden' : ''}`}>
                        <table className="table table-bordered border-dark table-striped table-hover w-100 text-center">
                            <thead>
                                <tr>
                                    {config.columns.map((columnName, index) => {
                                        const columnKey = config.values[index];
                                        const iconClass = getSortIconClass(columnKey, sortConfig);

                                        return (
                                            <th className="text-white" key={index}>
                                                <div className="d-flex justify-content-between align-items-center ms-2">
                                                    <span className='fs-5'>{columnName}</span>
                                                     <i
                                                        className={`${iconClass} cursor-pointer fs-4`}
                                                        onClick={() => handleSort(sortConfig, setSortConfig, columnKey)}
                                                        title={`Ordenar por ${columnName.toLowerCase()}`}
                                                        style={{ cursor: 'pointer' }}
                                                    ></i>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={index}>
                                        {config.values.map((columnName, colIndex) => {
                                            let formattedValue = item[columnName];

                                            if (columnName.toLowerCase().includes("date") && item[columnName]) {
                                                formattedValue = formatDate(item[columnName]);
                                            }

                                            return (
                                                <td className="py-1 align-middle" key={colIndex}>
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