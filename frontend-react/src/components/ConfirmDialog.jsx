import { useId, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useIsMobile } from "../utils/useIsMobile.js";
import BottomSheet from "./BottomSheet.jsx";
import { useRestoreFocus } from '../hooks/useRestoreFocus.js';

function ConfirmDialog({ title, message, confirmLabel = 'Eliminar', onConfirm, onHide }) {
    const isMobile = useIsMobile();
    const [busy, setBusy] = useState(false);
    const titleId = useId();
    const cancelRef = useRef(null);
    const focusCancel = () => cancelRef.current?.focus();
    useRestoreFocus();
    const confirm = async () => {
        setBusy(true);
        try {
            await onConfirm();
        } finally {
            setBusy(false);
        }
    };
    const actions = (
        <>
            <button type="button" ref={cancelRef} className={isMobile ? 'm-ghost' : 'panel-ghost'} onClick={onHide} disabled={busy}>Cancelar</button>
            <button type="button" className={`${isMobile ? 'm-primary' : 'panel-primary'} is-danger`} onClick={confirm} disabled={busy}>
                {confirmLabel}
            </button>
        </>
    );
    if (isMobile) {
        return (
            <BottomSheet show onHide={onHide} onEntered={focusCancel} title={title} footer={actions}>
                <p className="m-0 dialog-message">{message}</p>
            </BottomSheet>
        );
    }
    return (
        <Modal show onHide={onHide} onEntered={focusCancel} aria-labelledby={titleId} centered backdrop="static" dialogClassName="rm-dialog is-confirm" backdropClassName="rm-dialog-backdrop">
            <Modal.Header className="dialog-head">
                <Modal.Title id={titleId} className="dialog-title">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="dialog-body">
                <p className="m-0 dialog-message">{message}</p>
            </Modal.Body>
            <Modal.Footer className="dialog-foot">{actions}</Modal.Footer>
        </Modal>
    );
}

export default ConfirmDialog;