import { Offcanvas } from 'react-bootstrap';

function BottomSheet({ show, onHide, title, children, footer, className = '' }) {
    return (
        <Offcanvas show={show} onHide={onHide} placement="bottom" className={`m-sheet ${className}`}>
            <span className="m-sheet-grip" aria-hidden="true" />
            <Offcanvas.Header className="m-sheet-head">
                <Offcanvas.Title className="m-sheet-title">{title}</Offcanvas.Title>
                <button type="button" className="m-ghost" onClick={onHide}>Cerrar</button>
            </Offcanvas.Header>
            <Offcanvas.Body className="m-sheet-body">
                {children}
            </Offcanvas.Body>
            {footer ? <div className="m-sheet-foot d-flex gap-2">{footer}</div> : null}
        </Offcanvas>
    );
}

export default BottomSheet;