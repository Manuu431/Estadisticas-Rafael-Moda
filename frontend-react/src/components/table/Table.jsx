import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DATABASE_TABLES } from "../../config/database.js";
import HeaderTable from '../HeaderTable.jsx';
import Pagination from '../Pagination.jsx';
import { getSortedData } from '../../utils/tableUtils.js';
import ModalComponent from '../ModalComponent.jsx';
import { DesktopTable, MobileTable } from './componentsTable.jsx';
import { useIsMobile } from '../../utils/useIsMobile.js'
import { useFetch } from '../../hooks/useFetch.js';
const itemsPerPage = 10;
const ITEM_LABELS = { sales: 'líneas', clients: 'clientes', campaigns: 'campañas', seasons: 'temporadas', seasonTypes: 'tipos', campaignTypes: 'tipos' };
function Table({ type, filters = {}, external = null, setExternal }) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalMode, setModalMode] = useState('view');

    const DATABASE_TABLE = DATABASE_TABLES[type];
    const { data: fetched, refetch } = useFetch(DATABASE_TABLE.endpoint, filters);
    const isCreateType = type === 'seasonTypes' || type === 'campaignTypes';
    const haveHeader = type === "campaigns" || type === "seasons" || isCreateType;
    const types = { campaigns: "campañas", seasons: "temporadas", seasonTypes: "temporadas", campaignTypes: "campañas" };

    const sortedData = getSortedData(data, sortConfig);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (!fetched) return;
        const result = isCreateType
            ? fetched.map(item => ({
                ...item,
                start_date_formatted: `${item.start_day}/${item.start_month}`,
                end_date_formatted: `${item.end_day}/${item.end_month}`,
            }))
            : fetched;
        setData(result);
        setCurrentPage(1);
        setTotalPages(Math.ceil(result.length / itemsPerPage));
    }, [fetched, isCreateType]);

    const reloadTable = async () => {
        try {
            let endpointType;

            if(type === 'seasons'){
                endpointType = DATABASE_TABLES["seasonTypes"].endpointSync;
            } else if(type === 'campaigns'){
                endpointType = DATABASE_TABLES["campaignTypes"].endpointSync;
            }

            await axios.post(endpointType);
            await refetch();

            alert(`Se han sincronizado los datos de las ${types[type]}.`);
        } catch (error) {
            console.error(`Error reloading ${type} data:`, error.response ? error.response.data : error);
        }
    };

    const onRefreshTable = async() => {
        try {
            await refetch();
            alert('Tabla actualizada correctamente.');
        } catch (error) {
            console.error(`Error reloading ${type} data:`, error.response ? error.response.data : error);
        }
    }

    const openModal = useCallback(({ item, modalMode }) => {
        setModalData(item);
        setModalMode(modalMode);
        setModalVisible(true);
    }, []);

    const handleVisualize = useCallback((item) => {
        openModal({ item, modalMode: 'view' });
    }, [openModal]);

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
            alert(`No se pudo eliminar "${item.name || 'este elemento'}", tienes que eliminar primero las ${types[type]} asociadas.`);
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
        localStorage.removeItem("temporalItem");
        if(setExternal){
            setExternal(null);
        }
        setModalVisible(false);
        setModalData(null);
        setModalMode('view');
    };

    useEffect(() => {
        if (external && data.length > 0) {
            const itemToOpen = data.find(item => item.id === external.id);
            if (itemToOpen) {
                handleVisualize(itemToOpen);
            }
        }
    }, [external, data, handleVisualize]);

    return (
        <>
            <div className="d-flex flex-column gap-3">
                {haveHeader && <HeaderTable onCreate={handleCreate} onRefresh={onRefreshTable} type={type} reloadTable={reloadTable} />}
                <div className="data-card">
                    {currentData.length === 0 ? (
                        <p className="data-empty text-center m-0">No hay resultados con estos filtros.</p>
                    ) : isMobile ? (
                        <MobileTable
                            data={currentData}
                            DATABASE_TABLE={DATABASE_TABLE}
                            type={type}
                            isCreateType={isCreateType}
                            handleVisualize={handleVisualize}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ) : (
                        <DesktopTable
                            data={currentData}
                            DATABASE_TABLE={DATABASE_TABLE}
                            type={type}
                            isCreateType={isCreateType}
                            handleVisualize={handleVisualize}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            sortConfig={sortConfig}
                            setSortConfig={setSortConfig}
                        />
                    )}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={sortedData.length}
                        pageSize={itemsPerPage}
                        itemLabel={ITEM_LABELS[type] ?? 'registros'}
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