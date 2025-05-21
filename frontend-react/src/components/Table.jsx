import { useState, useEffect } from 'react';
import axios from 'axios';
import { DATABASE_TABLES } from "../../database.js";
import HeaderTable from './HeaderTable.jsx';
import Pagination from './Pagination.jsx';
import CustomModal from './CustomModal.jsx';
import {
    handleSort,
    getSortedData,
    formatDate,
    serializeParams,
    getSortIconClass
} from '../utils/tableUtils.js';
import { TableIconButton } from '../utils/smallComponents.jsx'

function Table({ type, filters = {}, classCols }) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit'

    const itemsPerPage = 10;
    const DATABASE_TABLE = DATABASE_TABLES[type];
    const haveHeader = type === "campaigns" || type === "seasons";

    const sortedData = getSortedData(data, sortConfig);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(DATABASE_TABLE.endpoint, {
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
    }, [DATABASE_TABLE.endpoint, filters]);

    const handleVisualize = (item) => {
        setModalData(item);
        setModalMode('view');
        setModalVisible(true);
    };

    const handleEdit = (item) => {
        setModalData(item);
        setModalMode('edit');
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setModalData(null);
        setModalMode('view');
    };

    const handleCreate = () => {
        const emptyItem = {};
        DATABASE_TABLE.tables.values.forEach((key) => {
            emptyItem[key] = '';
        });
        setModalData(emptyItem);
        setModalMode('create');
        setModalVisible(true);
    };
    
    return (
        <>
            {haveHeader && <HeaderTable classCols={classCols} onCreate={handleCreate} />}
            <div className={`row ${!haveHeader ? 'mt-3' : ''}`}>
                <div className="col-12">
                    <div className={`${!haveHeader ? 'rounded-top-3 overflow-hidden' : ''}`}>
                        <table className="table table-bordered border-dark table-striped table-hover w-100 text-center">
                            <thead>
                                <tr>
                                    {DATABASE_TABLE.tables.columns.map((columnName, index) => {
                                        const columnKey = DATABASE_TABLE.tables.values[index];
                                        const iconClass = getSortIconClass(columnKey, sortConfig);

                                        return (
                                            <th className="text-white align-middle" key={index}>
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
                                    {(type === "campaigns" || type === "seasons") && (
                                        <th className="text-white align-middle">
                                            <div className="d-flex justify-content-center">
                                                <span className='fs-5'>Acciones</span>
                                            </div>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, index) => (
                                    <tr key={index}>
                                        {DATABASE_TABLE.tables.values.map((columnName, colIndex) => {
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

                                        {(type === "campaigns" || type === "seasons") && (
                                            <td className="py-1 align-middle">
                                                <div className="d-flex justify-content-center gap-4">
                                                    <TableIconButton onClickFunction={() => handleVisualize(item)} title="visualizar" classIcon="bi bi-eye" />
                                                    <TableIconButton onClickFunction={() => handleEdit(item)} title="editar" classIcon="bi bi-pencil-square" />
                                                    <TableIconButton onClickFunction={() => alert("eliminar")} title="eliminar" classIcon="bi bi-trash" />
                                                </div>
                                            </td>
                                        )}
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

            {modalVisible && (
                <CustomModal
                    show={modalVisible}
                    data={modalData}
                    mode={modalMode}
                    onHide={handleCloseModal}
                    type={type}
                />
            )}
        </>
    );
}

function remove({ props }) {

}

export default Table;