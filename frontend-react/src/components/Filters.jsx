import React, { useEffect, useState } from 'react'
import { CMultiSelect } from '@coreui/react-pro'
import { FILTERS_CONFIG } from "../../filtersConfig.js"
import { CONFIG } from "../../config.js"
import axios from "axios"

const classCols = "col-12 col-md-6";

function Filters({ type }) {
    const filtersConfig = FILTERS_CONFIG[type];
    const [optionsData, setOptionsData] = useState({});
    const config = CONFIG[type];

    useEffect(() => {
        filtersConfig.inputType.forEach((inputType, index) => {
            if (inputType === "select") {
                const inputId = filtersConfig.inputId[index];
                axios.get(config.endpoint)
                    .then(response => {
                        const uniqueOptions = filterOptions(response, inputId);

                        const options = uniqueOptions.map(value => ({
                            value,
                            label: value,
                        }));

                        setOptionsData(prev => ({ ...prev, [inputId]: options }));
                    })
                    .catch(error => {
                        console.error(`Error loading options for ${inputId}:`, error.response ? error.response.data : error);
                    });
            }
        });
    }, [config.endpoint]);

    return (
        <>
      <div className="row bg-gray py-2">
        {filtersConfig.label.map((label, index) => (
          <div className={`${classCols} col-xl-4`} key={index}>
                <div className="form-floating mb-3 gap-3">
                    <div className="form-floating m-3 gap-3">
                        {filtersConfig.inputType[index] === "select" ? (
                            <select
                            id={filtersConfig.inputId[index]}
                            name={filtersConfig.inputId[index]}
                            className="form-select"
                            defaultValue=""
                            >
                            <option value="">Selecciona una opción</option>
                                {(optionsData[filtersConfig.inputId[index]] || []).map((option, i) => (
                                    <option key={i} value={option.value}>
                                    {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                            type={filtersConfig.inputType[index]}
                            id={filtersConfig.inputId[index]}
                            name={filtersConfig.inputId[index]}
                            className="form-control"
                            placeholder={label}
                            />
                        )}
                        <label htmlFor={filtersConfig.inputId[index]}>{label}</label>
                    </div>
              </div>
          </div>
        ))}
      </div>

      <div className='row bg-gray py-2'>
        <div className="col-xl-4"></div>
        <div className="col-xl-4"></div>
        {createButtons("justify-content-lg-start", "btn-secondary", "bi bi-trash", "Netejar")}
        {createButtons("justify-content-lg-end", "bg-orange", "bi bi-funnel", "Filtrar")}
      </div>
    </>
    );
}

const createButtons = (divClasses, buttonClasses, iconClasses, text) => {
    return (
        <>
            <div className={`${classCols} col-xl-2`}>
                <div className={`d-flex justify-content-center m-3 justify-content-xl-end ${divClasses}`}>
                    <button className={`btn ${buttonClasses} ps-2 text-white w-100 w-lg-auto py-3 py-xl-2`}>
                        <i className={`${iconClasses} px-1 text-white`}></i>{text}
                    </button>
                </div>
            </div>
        </>
    )
};

const filterOptions = (response, inputId) => {
    const uniqueOptions = [
        ...new Set(
            response.data.map(item => item[inputId])
        ),
    ];
    
    let sortedOptions;
    if (inputId === "size") {
        const tallaOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

        sortedOptions = uniqueOptions.sort((a, b) => {
            return tallaOrder.indexOf(a) - tallaOrder.indexOf(b);
        });
    } else {
        sortedOptions = uniqueOptions.sort((a, b) => a.localeCompare(b));
    }

    return sortedOptions;
};

export default Filters;