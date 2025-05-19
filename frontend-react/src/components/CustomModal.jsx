import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import { se } from 'date-fns/locale';

function CustomModal({ show, onHide, data, mode, type }) {
    if (!data) return null;

    const isView = mode === 'view';

    const types = {
        campaigns: "campaña",
        seasons: "temporada"
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton className="bg-orange text-white">
                <Modal.Title className="fw-semibold fs-4">
                    {isView ? 'Visualizar' : 'Editar'} {types[type]}
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
                                {Object.entries(values).map(([key, value], index) => (
                                    <Col md={6} key={index}>
                                        <Form.Group controlId={key}>
                                            <Form.Label className="fw-semibold text-capitalize">
                                                {key.replace(/_/g, ' ')}
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
                                ))}
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

export default CustomModal;