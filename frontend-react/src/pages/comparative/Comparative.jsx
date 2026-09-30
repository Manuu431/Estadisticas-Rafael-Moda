import { useEffect, useState } from "react";
import Title from "../../components/Title.jsx";
import PeriodFilters from "../../components/PeriodFilters.jsx";
import MainComparative from "./MainComparative.jsx";

import {
  fetchSalesData,
  applyFiltersComparative,
  handleFilter,
  handleClear,
  handleSelectDateByChange,
} from "../../utils/filterUtils.js";

function Comparative({ title, classCols }) {
  const [filters, setFilters] = useState({
    start_date_1: "",
    end_date_1: "",
    start_date_2: "",
    end_date_2: "",
    showBy: "all",
    groupBy: "none",
    selectDateBy: "exact_date",
  });

  const [salesData, setSalesData] = useState([]);
  const [comparativeData, setComparativeData] = useState(null);

  useEffect(() => {
    fetchSalesData().then(setSalesData);
  }, []);

  useEffect(() => {
    if (salesData.length > 0) {
      const initialData = applyFiltersComparative(salesData, filters);
      setComparativeData(initialData);
    }
  }, [salesData]);
  
  return (
    <>
        <Title title={title} />
        <PeriodFilters
            periods={2}
            filters={filters}
            setFilters={setFilters}
            handleSelectDateByChange={(inputId, value) =>
                handleSelectDateByChange(salesData, value, setFilters, setComparativeData, applyFiltersComparative)
            }
            handleClear={() =>
                handleClear(salesData, filters.selectDateBy, setFilters, setComparativeData, applyFiltersComparative)
            }
            onFilter={(newFilters) =>
                handleFilter(salesData, newFilters, setFilters, setComparativeData, applyFiltersComparative)
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