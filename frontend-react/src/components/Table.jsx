import { useState, useEffect } from 'react';
import axios from 'axios';
import { DATABASE_TABLES } from "../../database.js";
import HeaderTable from './HeaderTable.jsx';
import Pagination from './Pagination.jsx';
import {
    handleSort,
    getSortedData,
    formatDate,
    serializeParams,
    getSortIconClass
} from '../utils/tableUtils.js';
import { TableIconButton } from '../utils/smallComponents.jsx'



import ModalComponent from './ModalComponent.jsx';

function Table({ type, filters = {}, classCols, externalCampaign = null, setExternalCampaign }) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalMode, setModalMode] = useState('view');

    const itemsPerPage = 10;
    const DATABASE_TABLE = DATABASE_TABLES[type];
    const isCreateType = type === 'seasonTypes' || type === 'campaignTypes';
    const haveHeader = type === "campaigns" || type === "seasons" || isCreateType;
    const types = { campaigns: "campañas", seasons: "temporadas" };

    const sortedData = getSortedData(data, sortConfig);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const fetchData = async () => {
        try {
            const response = await axios.get(DATABASE_TABLE.endpoint, {
                params: filters,
                paramsSerializer: serializeParams
            });

            let result = response.data;

            if (isCreateType) {
                result = result.map(item => ({
                    ...item,
                    start_date_formatted: `${item.start_day}/${item.start_month}`,
                    end_date_formatted: `${item.end_day}/${item.end_month}`,
                }));
            }

            setData(result);
            setCurrentPage(1);
            setTotalPages(Math.ceil(result.length / itemsPerPage));
        } catch (error) {
            console.error(`Error obtaining ${type} data:`, error.response ? error.response.data : error);
        }
    };

    const reloadTable = async () => {
        try {
            let endpointType;

            if(type === 'seasons'){
                endpointType = DATABASE_TABLES["seasonTypes"].endpointSync;
            } else if(type === 'campaigns'){
                endpointType = DATABASE_TABLES["campaignTypes"].endpointSync;
            }

            await axios.post(endpointType);
            await fetchData();
            
            alert(`Se han sincronizado los datos de las ${types[type]}.`);
        } catch (error) {
            console.error(`Error reloading ${type} data:`, error.response ? error.response.data : error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [DATABASE_TABLE.endpoint, filters]);

    const openModal = ({ item, modalMode }) => {
        setModalData(item);
        setModalMode(modalMode);
        setModalVisible(true);
    };

    const handleVisualize = (item) => {
        openModal({ item, modalMode: 'view' });
    };

    const handleEdit = (item) => {
        openModal({ item, modalMode: 'edit' });
    };

    const handleDelete = async (item) => {
        const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar "${item.name || 'este elemento'}"?`);
        if (!confirmDelete) return;

        try {
            await axios.delete(`${DATABASE_TABLE.endpoint}/${item.id}`);
            const updatedData = data.filter((d) => d.id !== item.id);
            setData(updatedData);
            setTotalPages(Math.ceil(updatedData.length / itemsPerPage));
        } catch (error) {
            console.error("Error al eliminar el elemento:", error.response ? error.response.data : error);
            alert("No se pudo eliminar el elemento.");
        }
    };

    const handleCreate = () => {
        const emptyItem = {};
        DATABASE_TABLE.tables.values.forEach((key) => {
            emptyItem[key] = '';
        });
        openModal({ item: emptyItem, modalMode: 'create' });
    };
    
    const handleCloseModal = () => {
        localStorage.removeItem("temporalCampaign");
        if(setExternalCampaign){
            setExternalCampaign(null);
        }
        setModalVisible(false);
        setModalData(null);
        setModalMode('view');
    };

    useEffect(() => {
        if (externalCampaign && data.length > 0) {
            const itemToOpen = data.find(item => item.id === externalCampaign.id);
            if (itemToOpen) {
                handleVisualize(itemToOpen);
            }
        }
    }, [externalCampaign, data]);

    return (
        <>
            {haveHeader && <HeaderTable onCreate={handleCreate} onRefresh={fetchData} type={type} reloadTable={reloadTable} />}
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
                                                        className={`${iconClass} icon fs-4`}
                                                        onClick={() => handleSort(sortConfig, setSortConfig, columnKey)}
                                                        title={`Ordenar por ${columnName.toLowerCase()}`}
                                                    ></i>
                                                </div>
                                            </th>
                                        );
                                    })}
                                    {(type === "campaigns" || type === "seasons" || isCreateType) && (
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

                                            if(!isCreateType){
                                                if (columnName.toLowerCase().includes("date") && item[columnName]) {
                                                    formattedValue = formatDate(item[columnName]);
                                                }
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
                                                    {(item.expenses == null || item.profits == null || item.expenses == 0 || item.profits == 0) ? (
                                                        <TableIconButton
                                                            onClickFunction={() => handleEdit(item)}
                                                            title="añadir gastos o beneficios"
                                                            classIcon="bi bi-plus-circle"
                                                        />
                                                    ) : (
                                                        <>
                                                            <TableIconButton
                                                                onClickFunction={() => handleVisualize(item)}
                                                                title="visualizar"
                                                                classIcon="bi bi-eye"
                                                            />
                                                            <TableIconButton
                                                                onClickFunction={() => handleEdit(item)}
                                                                title="editar"
                                                                classIcon="bi bi-pencil-square"
                                                            />
                                                        </>
                                                    )}
                                                    <TableIconButton
                                                        onClickFunction={() => handleDelete(item)}
                                                        title="eliminar"
                                                        classIcon="bi bi-trash"
                                                    />
                                                </div>
                                            </td>
                                        )}
                                        {isCreateType && (
                                            <td className="py-1 align-middle">
                                                <div className="d-flex justify-content-center gap-4">
                                                    <TableIconButton
                                                        onClickFunction={() => handleVisualize(item)}
                                                        title="visualizar"
                                                        classIcon="bi bi-eye"
                                                    />
                                                    <TableIconButton
                                                        onClickFunction={() => handleEdit(item)}
                                                        title="editar"
                                                        classIcon="bi bi-pencil-square"
                                                    />
                                                    <TableIconButton
                                                        onClickFunction={() => handleDelete(item)}
                                                        title="eliminar"
                                                        classIcon="bi bi-trash"
                                                    />
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
                <ModalComponent
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

export default Table;