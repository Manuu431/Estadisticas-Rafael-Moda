import axios from "axios";
import { groupSales } from "../../utils/statisticsData.js";
import { DATABASE_TABLES } from "../../../database.js";

export const fetchSalesData = async () => {
  try {
    const res = await axios.get(DATABASE_TABLES["sales"].endpoint);
    return res.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return [];
  }
};

export const applyFilters = (allSales, filters) => {
  const { start_date_1, end_date_1, start_date_2, end_date_2, showBy, groupBy } = filters;

  const inRange = (date, start, end) => {
    const d = new Date(date);
    return (!start || d >= new Date(start)) && (!end || d <= new Date(end));
  };

  const salesRange1 = allSales.filter(sale =>
    inRange(sale.sale_date, start_date_1, end_date_1)
  );

  const salesRange2 = allSales.filter(sale =>
    inRange(sale.sale_date, start_date_2, end_date_2)
  );

  return {
    data1: groupSales(salesRange1, showBy, groupBy),
    data2: groupSales(salesRange2, showBy, groupBy),
    showBy,
    groupBy
  };
};

const cleanComparativeData = (salesData, newFilters, setFilters, setComparativeData) => {
  setFilters(newFilters);
  const filteredData = applyFilters(salesData, newFilters);
  setComparativeData(filteredData);
};

export const handleFilter = (salesData, newFilters, setFilters, setComparativeData) => {
  cleanComparativeData(salesData, newFilters, setFilters, setComparativeData);
};

export const handleClear = (salesData, selectDateBy, setFilters, setComparativeData) => {
  const cleanedFilters = { groupBy: "none", selectDateBy };
  cleanComparativeData(salesData, cleanedFilters, setFilters, setComparativeData);
};

export const handleSelectDateByChange = (salesData, value, setFilters, setComparativeData) => {
  const cleanedFilters = { groupBy: "none", selectDateBy: value };
  cleanComparativeData(salesData, cleanedFilters, setFilters, setComparativeData);
};