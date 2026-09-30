import { useMemo, useState } from "react";
import Title from '../../components/Title';
import PeriodFilters from '../../components/PeriodFilters';
import MainExpenses from './MainExpenses';
import { DATABASE_TABLES } from "../../config/database.js";
import { useFetch } from "../../hooks/useFetch.js";
import {
    applyFiltersExpenses,
    handleFilter,
    handleClear,
    handleSelectDateByChange,
} from "../../utils/filterUtils.js";
const initialFilters = {
    start_date: "",
    end_date: "",
    showBy: "all",
    selectDateBy: "exact_date",
};
function Expenses({ title, classCols }) {
    const [filters, setFilters] = useState(initialFilters);
    const [appliedData, setAppliedData] = useState(null);
    const { data } = useFetch(DATABASE_TABLES["sales"].endpoint);
    const salesData = data ?? [];
    const initialData = useMemo(() => (data?.length > 0 ? applyFiltersExpenses(data, initialFilters) : null), [data]);
    const comparativeData = appliedData ?? initialData;
    return (
        <>
            <Title title={title} />
            <PeriodFilters
                periods={1}
                filters={filters}
                setFilters={setFilters}
                handleSelectDateByChange={(inputId, value) =>
                    handleSelectDateByChange(salesData, value, setFilters, setAppliedData, applyFiltersExpenses)
                }
                handleClear={() =>
                    handleClear(salesData, filters.selectDateBy, setFilters, setAppliedData, applyFiltersExpenses)
                }
                onFilter={(newFilters) =>
                    handleFilter(salesData, newFilters, setFilters, setAppliedData, applyFiltersExpenses)
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