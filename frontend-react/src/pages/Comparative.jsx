import { useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import ComparativeFilters from "../components/ComparativeFilters";
import MainComparative from "../components/MainComparative";
import { groupSales } from "../utils/statisticsData";
import { DATABASE_TABLES } from "../../database.js";

function Comparative({ title, classCols }) {
  const [filters, setFilters] = useState({
    date_start_1: "",
    date_end_1: "",
    date_start_2: "",
    date_end_2: "",
    showBy: "day",
    groupBy: "brand",
  });

  const [salesData, setSalesData] = useState([]);
  const [comparativeData, setComparativeData] = useState(null);

  const fetchSalesData = async () => {
    try {
      const res = await axios.get(DATABASE_TABLES["sales"].endpoint);
      setSalesData(res.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const applyFilters = (allSales, filters) => {
    const { date_start_1, date_end_1, date_start_2, date_end_2, showBy, groupBy } = filters;

    const inRange = (date, start, end) => {
      const d = new Date(date);
      return (!start || d >= new Date(start)) && (!end || d <= new Date(end));
    };

    const range1 = allSales.filter(sale =>
      inRange(sale.date, date_start_1, date_end_1)
    );

    const range2 = allSales.filter(sale =>
      inRange(sale.date, date_start_2, date_end_2)
    );

    return {
      series1: groupSales(range1, showBy, groupBy),
      series2: groupSales(range2, showBy, groupBy),
      showBy1: showBy,
      groupBy1: groupBy,
      showBy2: showBy,
      groupBy2: groupBy,
    };
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    const filteredData = applyFilters(salesData, newFilters);
    setComparativeData(filteredData);
  };

  const handleClear = () => {
    const emptyFilters = {
      date_start_1: "",
      date_end_1: "",
      date_start_2: "",
      date_end_2: "",
      showBy: "day",
      groupBy: "brand",
    };
    setFilters(emptyFilters);
    const filteredData = applyFilters(salesData, emptyFilters);
    setComparativeData(filteredData);
  };

  useEffect(() => {
    fetchSalesData();
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
        onFilter={handleFilter}
        onClear={handleClear}
        classCols={classCols}
      />
      {comparativeData && <MainComparative data1={comparativeData} data2={comparativeData} classCols={classCols} />}
    </>
  );
}

export default Comparative;