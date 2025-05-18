export function Button(props) {
    return (
        <button
            className={`btn ${props.buttonClasses} ps-2 text-white w-100 w-lg-auto py-3 py-xl-2 fs-5 d-flex align-items-center justify-content-center gap-2`}
            onClick={props.onClickFunction}
        >
            <i className={`${props.iconClasses} px-1 text-white`}></i>{props.text}
        </button>
    );
};

export function TableIconButton (props) {
    return (
        <button 
            className="btn p-0 d-flex border-0 tableIcon"
            onClick={props.onClickFunction}
            title={props.title}
        >
            <i className={`${props.classIcon} fs-5`}></i>
        </button>
    );
}