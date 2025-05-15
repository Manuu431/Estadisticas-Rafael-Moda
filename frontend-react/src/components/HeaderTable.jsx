import { Button } from '../utils/smallComponents';

function HeaderTable({ classCols }) {
    return (
        <div className="row">
            <div className={`col-12 mt-3`}>
                <div className="container-fluid bg-dark-gray rounded-top-3 px-0">
                    <div className="row">
                        <div className="col-md-6 col-xl-4"></div>
                        <div className="col-xl-6 d-xl-flex d-none"></div>
                        <div className={`${classCols} col-xl-2`}>
                            <div className={`d-flex justify-content-center mx-3 my-3 my-md-2`}>
                                <Button
                                    buttonClasses={"btn-info"}
                                    onClickFunction={() => {console.log("crear")}}
                                    iconClasses={"bi-plus-circle"}
                                    text={"Crear"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderTable;