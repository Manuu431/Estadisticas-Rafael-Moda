import { useEffect, useState } from "react";
import Title from '../../components/Title';
import ExpensesFilters from './ExpensesFilters';
import MainExpenses from './MainExpenses';

import {
    fetchSalesData,
    applyFiltersExpenses,
    handleFilter,
    handleClear,
    handleSelectDateByChange,
} from "../../utils/filterUtils.js";

function Expenses({ title, classCols }) {
    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        showBy: "all",
        selectDateBy: "exact_date",
    });

    const [salesData, setSalesData] = useState([]);
    const [comparativeData, setComparativeData] = useState(null);

    useEffect(() => {
        fetchSalesData().then(setSalesData);
    }, []);

    useEffect(() => {
        if (salesData.length > 0) {
            const initialData = applyFiltersExpenses(salesData, filters);            
            setComparativeData(initialData);
        }
    }, [salesData]);
        
    return (
        <>
            <Title title={title} />
            <ExpensesFilters
                filters={filters}
                setFilters={setFilters}
                handleSelectDateByChange={(inputId, value) =>
                    handleSelectDateByChange(salesData, value, setFilters, setComparativeData, applyFiltersExpenses)
                }
                handleClear={() =>
                    handleClear(salesData, filters.selectDateBy, setFilters, setComparativeData, applyFiltersExpenses)
                }
                onFilter={(newFilters) =>
                    handleFilter(salesData, newFilters, setFilters, setComparativeData, applyFiltersExpenses)
                }
                classCols={classCols}
            />
            {comparativeData && (
                <MainExpenses
                    allData={comparativeData}
                    filters={filters}
                />
            )}
        </>
    );
}

export default Expenses;