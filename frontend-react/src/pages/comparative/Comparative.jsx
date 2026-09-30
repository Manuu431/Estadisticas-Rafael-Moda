import { useMemo, useState } from "react";
import Title from "../../components/Title.jsx";
import PeriodFilters from "../../components/PeriodFilters.jsx";
import MainComparative from "./MainComparative.jsx";
import { DATABASE_TABLES } from "../../config/database.js";
import { useFetch } from "../../hooks/useFetch.js";
import {
    applyFiltersComparative,
    handleFilter,
    handleClear,
    handleSelectDateByChange,
} from "../../utils/filterUtils.js";
const initialFilters = {
    start_date_1: "",
    end_date_1: "",
    start_date_2: "",
    end_date_2: "",
    showBy: "all",
    groupBy: "none",
    selectDateBy: "exact_date",
};
function Comparative({ title, classCols }) {
    const [filters, setFilters] = useState(initialFilters);
    const [appliedData, setAppliedData] = useState(null);
    const { data } = useFetch(DATABASE_TABLES["sales"].endpoint);
    const salesData = data ?? [];
    const initialData = useMemo(() => (data?.length > 0 ? applyFiltersComparative(data, initialFilters) : null), [data]);
    const comparativeData = appliedData ?? initialData;
    return (
        <>
            <Title title={title} />
            <PeriodFilters
                periods={2}
                filters={filters}
                setFilters={setFilters}
                handleSelectDateByChange={(inputId, value) =>
                    handleSelectDateByChange(salesData, value, setFilters, setAppliedData, applyFiltersComparative)
                }
                handleClear={() =>
                    handleClear(salesData, filters.selectDateBy, setFilters, setAppliedData, applyFiltersComparative)
                }
                onFilter={(newFilters) =>
                    handleFilter(salesData, newFilters, setFilters, setAppliedData, applyFiltersComparative)
                }
                classCols={classCols}
            />
            {comparativeData && (
                <MainComparative
                    allData={comparativeData}
                    filters={filters}
                    classCols={classCols}
                />
            )}
        </>
    );
}
export default Comparative;