export const filterOptions = (response, inputId) => {
    const uniqueOptions = [...new Set(response.data.map(item => item[inputId]))];

    let sortedOptions;
    if (inputId === "size") {
        const tallaOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
        sortedOptions = uniqueOptions.sort((a, b) => tallaOrder.indexOf(a) - tallaOrder.indexOf(b));
    } else {
        sortedOptions = uniqueOptions.sort((a, b) => a.localeCompare(b));
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

export const handleClear = (setSelectedValues, setTextInputs, setRangeInputs, onFilterChange) => {
    setSelectedValues({});
    setTextInputs({});
    setRangeInputs({});
    onFilterChange({});
};

export const handleFilter = (selectedValues, textInputs, rangeInputs, onFilterChange) => {
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

    onFilterChange({
        ...selectedValues,
        ...textInputs,
        ...flattenedRangeInputs,
    });
};
