import { useEffect, useState } from "react";
import Title from "../../components/Title.jsx";
import ComparativeFilters from "./ComparativeFilters.jsx";
import MainComparative from "./MainComparative.jsx";

import {
  fetchSalesData,
  applyFilters,
  handleFilter,
  handleClear,
  handleSelectDateByChange,
} from "./comparativeFunctions.js";

function Comparative({ title, classCols }) {
  const [filters, setFilters] = useState({
    start_date_1: "",
    end_date_1: "",
    start_date_2: "",
    end_date_2: "",
    showBy: "",
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
      const initialData = applyFilters(salesData, filters);
      setComparativeData(initialData);
    }
  }, [salesData]);

  return (
    <>
        <Title title={title} />
        <ComparativeFilters
            filters={filters}
            setFilters={setFilters}
            handleSelectDateByChange={(inputId, value) =>
                handleSelectDateByChange(salesData, value, setFilters, setComparativeData)
            }
            handleClear={() =>
                handleClear(salesData, filters.selectDateBy, setFilters, setComparativeData)
            }
            onFilter={(newFilters) =>
                handleFilter(salesData, newFilters, setFilters, setComparativeData)
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