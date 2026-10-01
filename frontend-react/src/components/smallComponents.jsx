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