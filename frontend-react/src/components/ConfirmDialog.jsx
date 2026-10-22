import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useIsMobile } from "../utils/useIsMobile.js";
import BottomSheet from "./BottomSheet.jsx";

function ConfirmDialog({ title, message, confirmLabel = 'Eliminar', onConfirm, onHide }) {
    const isMobile = useIsMobile();
    const [busy, setBusy] = useState(false);

    const confirm = async () => {
        setBusy(true);
        await onConfirm();
    };

    const actions = (
        <>
            <button type="button" className={isMobile ? 'm-ghost' : 'panel-ghost'} onClick={onHide} disabled={busy}>Cancelar</button>
            <button type="button" className={`${isMobile ? 'm-primary' : 'panel-primary'} is-danger`} onClick={confirm} disabled={busy}>
                {confirmLabel}
            </button>
        </>
    );

    if (isMobile) {
        return (
            <BottomSheet show onHide={onHide} title={title} footer={actions}>
                <p className="dialog-message m-0">{message}</p>
            </BottomSheet>
        );
    }

    return (
        <Modal show onHide={onHide} centered backdrop="static" dialogClassName="rm-dialog is-confirm" backdropClassName="rm-dialog-backdrop">
            <Modal.Header className="dialog-head">
                <Modal.Title className="dialog-title">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="dialog-body">
                <p className="dialog-message m-0">{message}</p>
            </Modal.Body>
            <Modal.Footer className="dialog-foot">{actions}</Modal.Footer>
        </Modal>
    );
}

export default ConfirmDialog;
