import { Button } from '../utils/smallComponents';

function HeaderTable({ classCols, onCreate, onRefresh, type }) {
    return (
        <div className="row">
            <div className={`col-12 mt-3`}>
                <div className="container-fluid bg-dark-gray rounded-top-3 px-0">
                    <div className="row">
                        <div className={`${classCols} col-xl-3`}>
                            <div className="d-flex justify-content-center mx-3 my-3 my-md-2">
                                <Button
                                    buttonClasses={"btn-success"}
                                    onClickFunction={onRefresh}
                                    iconClasses={"bi bi-arrow-clockwise"}
                                    text={"Actualizar"}
                                />
                            </div>
                        </div>
                        <div className="col-xl-3 d-xl-flex d-none"></div>
                        <div className="col-xl-4 d-xl-flex d-none"></div>
                        <div className={`${classCols} col-xl-2`}>
                            {type === "seasonTypes" && 
                                <div className="d-flex justify-content-center mx-3 my-3 my-md-2">
                                    <Button
                                        buttonClasses={"btn-info"}
                                        onClickFunction={onCreate}
                                        iconClasses={"bi-plus-circle"}
                                        text={"Crear"}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderTable;