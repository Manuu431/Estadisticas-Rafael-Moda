import { useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import ComparativeFilters from "../components/ComparativeFilters";
import MainComparative from "../components/MainComparative";
import { groupSales } from "../utils/statisticsData";
import { DATABASE_TABLES } from "../../database.js";

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

    const fetchSalesData = async () => {
        try {
            const res = await axios.get(DATABASE_TABLES["sales"].endpoint);
            setSalesData(res.data);
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    const applyFilters = (allSales, filters) => {
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
            showBy: showBy,
            groupBy: groupBy
        };
    };

    const cleanComparativeData = (newFilters) => {
        setFilters(newFilters);
        const filteredData = applyFilters(salesData, newFilters);
        setComparativeData(filteredData);
    }


    const handleFilter = (newFilters) => {
        cleanComparativeData(newFilters);
    };

    const handleClear = () => {
        const cleanedFilters = { groupBy: "none", selectDateBy: filters.selectDateBy };
        cleanComparativeData(cleanedFilters);
    }

    const handleSelectDateByChange = (inputId, value) => {
        const cleanedFilters = { groupBy: "none", selectDateBy: value };
        cleanComparativeData(cleanedFilters);
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
            handleSelectDateByChange={handleSelectDateByChange}
            handleClear={handleClear}
            onFilter={handleFilter}
            classCols={classCols}
        />
        {comparativeData && <MainComparative allData={comparativeData} filters={filters} classCols={classCols} />}
        </>
    );
}

export default Comparative;