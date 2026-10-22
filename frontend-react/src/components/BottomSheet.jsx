import { useId } from 'react';
import { Offcanvas } from 'react-bootstrap';

function BottomSheet({ show, onHide, onEntered, title, children, footer, className = '' }) {
    const titleId = useId();
    return (
        <Offcanvas show={show} onHide={onHide} onEntered={onEntered} placement="bottom" className={`m-sheet ${className}`} aria-labelledby={titleId}>
            <span className="m-sheet-grip" aria-hidden="true" />
            <Offcanvas.Header className="m-sheet-head">
                <Offcanvas.Title id={titleId} className="m-sheet-title">{title}</Offcanvas.Title>
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