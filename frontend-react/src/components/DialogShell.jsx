import { useId, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Form as FormikForm } from 'formik';
import axios from 'axios';
import { DATABASE_TABLES } from "../config/database.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import BottomSheet from "./BottomSheet.jsx";
import { writeError } from '../utils/errors.js';
import { useRestoreFocus } from '../hooks/useRestoreFocus.js';

const TITLES = { campaigns: "campaña", seasons: "temporada", seasonTypes: "tipo de temporada", campaignTypes: "tipo de campaña" };

function DialogShell({ show, onHide, mode, type, initialValues, validationSchema, payload = (values) => values, children }) {
    const endPoint = DATABASE_TABLES[type].endpoint;
    const isView = mode === 'view';
    const isCreate = mode === 'create';
    const isMobile = useIsMobile();
    const titleId = useId();
    useRestoreFocus();
    const [error, setError] = useState('');
    const heading = `${isView ? 'Visualizar' : mode === 'edit' ? 'Editar' : 'Crear'} ${TITLES[type]}`;
    const save = (values) => (isCreate ? axios.post(endPoint, payload(values)) : axios.put(`${endPoint}/${values.id}`, payload(values)));
    const actions = (isSubmitting) => (
        <>
            {isMobile ? null : <button type="button" className="panel-ghost" onClick={onHide}>{isView ? 'Cerrar' : 'Cancelar'}</button>}
            {!isView && (
                <button type="submit" className={isMobile ? 'm-primary' : 'panel-primary'} disabled={isSubmitting}>
                    {isCreate ? 'Crear' : 'Guardar'}
                </button>
            )}
        </>
    );
    const form = (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async (values) => {
                setError('');
                try {
                    await save(values);
                } catch (err) {
                    console.error('Error al guardar:', err);
                    setError(writeError(err, isCreate ? 'No se ha podido crear.' : 'No se han podido guardar los cambios.'));
                    return;
                }
                onHide();
            }}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <FormikForm noValidate>
                    {isMobile ? (
                        <div className="d-flex flex-column gap-3">
                            {children({ values, setFieldValue, isMobile, isView })}
                            {error ? <p className="text-negative m-0 panel-note" role="alert">{error}</p> : null}
                            {isView ? null : <div className="m-sheet-foot d-flex gap-2">{actions(isSubmitting)}</div>}
                        </div>
                    ) : (
                        <>
                            <Modal.Body className="dialog-body">
                                {children({ values, setFieldValue, isMobile, isView })}
                                {error ? <p className="text-negative mt-3 mb-0 panel-note" role="alert">{error}</p> : null}
                            </Modal.Body>
                            <Modal.Footer className="dialog-foot">{actions(isSubmitting)}</Modal.Footer>
                        </>
                    )}
                </FormikForm>
            )}
        </Formik>
    );
    if (isMobile) {
        return (
            <BottomSheet show={show} onHide={onHide} title={heading}>
                {form}
            </BottomSheet>
        );
    }
    return (
        <Modal show={show} onHide={onHide} aria-labelledby={titleId} size="lg" centered backdrop="static" dialogClassName="rm-dialog" backdropClassName="rm-dialog-backdrop">
            <Modal.Header className="dialog-head">
                <Modal.Title id={titleId} className="dialog-title">{heading}</Modal.Title>
                <button type="button" className="panel-icon-btn" onClick={onHide} aria-label="Cerrar">
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            </Modal.Header>
            {form}
        </Modal>
    );
}

export default DialogShell;