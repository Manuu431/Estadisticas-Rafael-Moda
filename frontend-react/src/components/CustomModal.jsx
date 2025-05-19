import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';

function CustomModal({ show, onHide, data, mode, type }) {
    if (!data) return null;

    const isView = mode === 'view';
    const isEdit = mode === 'edit';
    const isCreate = mode === 'create';

    const types = {
        campaigns: "campaña",
        seasons: "temporada"
    };

    const labels = {
        id: "ID",
        name: "Nombre",
        start_date: "Fecha de inicio",
        end_date: "Fecha de finalización",
        expenses: "Gastos",
        profits: "Beneficios",
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton className="bg-orange text-white">
                <Modal.Title className="fw-semibold fs-4">
                    {isView ? 'Visualizar' : isEdit ? 'Editar' : 'Crear'} {types[type]}
                </Modal.Title>
            </Modal.Header>

            <Formik
                initialValues={data}
                onSubmit={(values) => {
                    console.log("Guardar valores:", values);
                    onHide();
                }}
            >
                {({ values }) => (
                    <FormikForm>
                        <Modal.Body className="bg-light px-4 py-3">
                            <Row className="g-3">
                                {Object.entries(values).map(([key, value], index) => {
                                    if (isCreate && key === 'id') return null;

                                    let label = labels[key];
                                    const goodLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

                                    return (
                                        <Col md={6} key={index}>
                                            <Form.Group controlId={key}>
                                                <Form.Label className="fw-semibold">
                                                    {goodLabel}
                                                </Form.Label>
                                                <Field
                                                    as={Form.Control}
                                                    name={key}
                                                    readOnly={isView || key === 'id'}
                                                    plaintext={isView}
                                                    className={`form-control ${isView ? 'bg-white border-0 ps-0' : ''}`}
                                                />
                                            </Form.Group>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Modal.Body>

                        <Modal.Footer className="bg-secondary-subtle px-4">
                            <Button variant="outline-secondary" onClick={onHide}>
                                Cerrar
                            </Button>
                            {!isView && (
                                <Button variant="primary" type="submit">
                                    Guardar
                                </Button>
                            )}
                        </Modal.Footer>
                    </FormikForm>
                )}
            </Formik>
        </Modal>
    );
}

function create({ props }) {

}

function update({ props }) {

}

function remove({ props }) {

}

export default CustomModal;