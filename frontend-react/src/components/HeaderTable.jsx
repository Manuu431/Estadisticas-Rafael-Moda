import { Button } from './smallComponents';

function HeaderTable({ onCreate, onRefresh, type, reloadTable }) {
    const isCreateType = type === 'seasonTypes' || type === 'campaignTypes';
    const types = { campaigns: "campañas", seasons: "temporadas", seasonTypes: "temporada", campaignTypes: "campaña" };
    const classCols = isCreateType ? "col-12 col-md-6" : "col-12 col-md-4";

    return (
        <div className="row">
            <div className={`col-12 mt-3`}>
                <div className="container-fluid bg-dark-gray rounded-top-3 px-0">
                    <div className="row">
                        <DivButton
                            classCols={classCols}
                            buttonClasses={"btn-success"}
                            onClickFunction={onRefresh}
                            iconClasses={"bi bi-arrow-clockwise"}
                            text="Actualizar"
                        />
                        <DivButton
                            classCols={classCols}
                            buttonClasses={"btn-info"}
                            onClickFunction={onCreate}
                            iconClasses={"bi bi-plus-circle"}
                            text={`Crear ${types[type]}`}
                        />
                        {!isCreateType && (
                            <DivButton
                                classCols={classCols}
                                buttonClasses={"btn-success"}
                                onClickFunction={reloadTable}
                                iconClasses={"bi bi-arrow-repeat"}
                                text={`Sincronizar`}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DivButton(props) {
    return (
        <div className={props.classCols}>
            <div className="d-flex justify-content-center mx-3 my-2">
                <Button
                    buttonClasses={props.buttonClasses}
                    onClickFunction={props.onClickFunction}
                    iconClasses={props.iconClasses}
                    text={props.text}
                />
            </div>
        </div>
    );
}

export default HeaderTable;