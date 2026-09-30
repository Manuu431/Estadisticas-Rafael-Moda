import { getValueLabel } from "../config/labels.js";

export const filterOptions = (rows, inputId) => {
    const uniqueOptions = [...new Set(rows.map(item => item[inputId]))];

    let sortedOptions;
    if (inputId === "size") {
        const tallaOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
        sortedOptions = uniqueOptions.sort((a, b) => tallaOrder.indexOf(a) - tallaOrder.indexOf(b));
    } else if (typeof uniqueOptions[0] === "string") {
        sortedOptions = uniqueOptions.sort((a, b) => a.localeCompare(b));
    } else {
        sortedOptions = uniqueOptions.sort((a, b) => a - b);
    }

    return sortedOptions;
};

export const handleSelectChange = (inputId, selectedOptions, setSelectedValues) => {
    setSelectedValues(prev => ({
        ...prev,
        [inputId]: selectedOptions ? selectedOptions.map(opt => opt.value) : [],
    }));
};

export const handleRangeInputChange = (inputId, values, setRangeInputs) => {
    setRangeInputs(prev => ({
        ...prev,
        [inputId]: {
            min: values[0],
            max: values[1],
        }
    }));
};

export const handleTextInputChange = (e, setTextInputs) => {
    const { id, value } = e.target;
    setTextInputs(prev => ({ ...prev, [id]: value }));
};

export const handleManualClear = (
    setSelectedValues,
    setTextInputs,
    setRangeInputs,
    onFilterChange,
    setOptionFilters
) => {
    setSelectedValues({});
    setTextInputs({});
    setRangeInputs({});
    onFilterChange({});
    setOptionFilters({});
};

export const handleManualFilter = (
    selectedValues,
    textInputs,
    rangeInputs,
    onFilterChange,
    setOptionFilters
) => {
    const flattenedRangeInputs = {};
    for (const key in rangeInputs) {
        const range = rangeInputs[key];
        if (range.min !== "" && range.max !== "") {
            flattenedRangeInputs[`${key}_min`] = range.min;
            flattenedRangeInputs[`${key}_max`] = range.max;
        } else if (range.min !== "") {
            flattenedRangeInputs[`${key}_min`] = range.min;
        } else if (range.max !== "") {
            flattenedRangeInputs[`${key}_max`] = range.max;
        }
    }

    const filters = {
        ...selectedValues,
        ...textInputs,
        ...flattenedRangeInputs,
    };

    onFilterChange(filters);
    setOptionFilters(Object.fromEntries(Object.entries(filters).filter(([, value]) => value)));
};

export const buildSelectOptions = (rows, databaseTable) => {
    const options = {};
    if (!rows) return options;
    databaseTable.filters.inputId.forEach((inputId, index) => {
        if (databaseTable.filters.inputType[index] === "select") {
            options[inputId] = filterOptions(rows, inputId).map(value => ({ value, label: getValueLabel(inputId, value) }));
        }
    });
    return options;
};

export function updateSelectOptions(DATABASE_TABLE, setOptionsData) {
    const staticOptions = DATABASE_TABLE.filters.options || {};
    setOptionsData(staticOptions);
}


export const countActiveFilters = (filters) =>
    Object.values(filters).filter((value) => (Array.isArray(value) ? value.length > 0 : value !== '' && value != null)).length;

export const activeFiltersLabel = (filters) => {
    const total = countActiveFilters(filters);
    if (total === 0) return 'Sin filtros aplicados';
    return `${total} ${total === 1 ? 'filtro aplicado' : 'filtros aplicados'}`;
};

/**
 * COMPARATIVE AND EXPENSES FILTERS
 */

import { groupSales } from "./statisticsData.js";

export const applyFiltersComparative = (allSales, filters) => {
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

const cleanComparativeData = (salesData, newFilters, setFilters, setComparativeData, applyFilters) => {
  setFilters(newFilters);
  const filteredData = applyFilters(salesData, newFilters);
  setComparativeData(filteredData);
};

export const handleFilter = (salesData, newFilters, setFilters, setComparativeData, applyFilters) => {
  cleanComparativeData(salesData, newFilters, setFilters, setComparativeData, applyFilters);
};

export const handleClear = (salesData, selectDateBy, setFilters, setComparativeData, applyFilters) => {
  const cleanedFilters = { showBy: "all", groupBy: "none", selectDateBy };
  cleanComparativeData(salesData, cleanedFilters, setFilters, setComparativeData, applyFilters);
};

export const handleSelectDateByChange = (salesData, value, setFilters, setComparativeData, applyFilters) => {
  const cleanedFilters = { showBy: "all", groupBy: "none", selectDateBy: value };
  cleanComparativeData(salesData, cleanedFilters, setFilters, setComparativeData, applyFilters);
};

/**
 * EXPENSES
 */
import { groupExpenses } from "./statisticsData.js";

export const applyFiltersExpenses = (allSales, filters) => {  
    const { start_date, end_date, showBy } = filters;

    const inRange = (date, start, end) => {
        const d = new Date(date);
        return (!start || d >= new Date(start)) && (!end || d <= new Date(end));
    };

    const salesRange = allSales.filter(sale =>
        inRange(sale.sale_date, start_date, end_date)
    );

    return {
        data: groupExpenses(salesRange, showBy),
        showBy
    };
};