import React from 'react';
import { FILTERS_CONFIG } from "../../filtersConfig.js";

function Filters({ type }) {
    const filtersConfig = FILTERS_CONFIG[type];

    return (
        <>
            <div className="row bg-gray">
                {filtersConfig.label.map((label, index) => (
                    <div className="col-4" key={index}>
                        <div className="d-flex flex-column m-3 gap-3">
                            <label>{label}</label>
                            <input
                                type={filtersConfig.inputType[index]}
                                id={filtersConfig.inputId[index]}
                                className="form-control"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Filters;