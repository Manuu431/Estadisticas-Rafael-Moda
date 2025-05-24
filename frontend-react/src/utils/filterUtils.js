import axios from "axios";
import qs from "qs";

export const filterOptions = (response, inputId) => {
    const uniqueOptions = [...new Set(response.data.map(item => item[inputId]))];

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

export const handleManualClear = async (
    setSelectedValues,
    setTextInputs,
    setRangeInputs,
    onFilterChange,
    databaseTable,
    setOptionsData
) => {
    setSelectedValues({});
    setTextInputs({});
    setRangeInputs({});
    onFilterChange({});
    await updateMultiSelectOptions(databaseTable, {}, setOptionsData);
};

export const handleManualFilter = async (
    selectedValues,
    textInputs,
    rangeInputs,
    onFilterChange,
    databaseTable,
    setOptionsData
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
    await updateMultiSelectOptions(databaseTable, filters, setOptionsData);
};

export const updateMultiSelectOptions = async (
    databaseTable,
    filters,
    setOptionsData
) => {
    try {
        const queryParams = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value)
        );
        
        const response = await axios.get(databaseTable.endpoint, {
            params: queryParams,
            paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" })
        });

        databaseTable.filters.inputId.forEach((inputId, index) => {
            const inputType = databaseTable.filters.inputType[index];
            if (inputType === "select") {
                const uniqueOptions = filterOptions(response, inputId);
                const options = uniqueOptions.map(value => ({
                    value,
                    label: value,
                }));
                setOptionsData(prev => ({ ...prev, [inputId]: options }));
            }
        });
    } catch (error) {
        console.error("Error loading options:", error.response ? error.response.data : error);
    }
};

export function updateSelectOptions(DATABASE_TABLE, filters, setOptionsData) {
    const staticOptions = DATABASE_TABLE.filters.options || {};
    setOptionsData(staticOptions);
}