import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import axios from 'axios';
import { DATABASE_TABLES } from '../../database';

function CustomModal({ show, onHide, data, mode, type }) {
    if (!data) return null;

    const endPoint = DATABASE_TABLES[type].endpoint;
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

    // Función para crear
    async function create(data) {
        try {
            const response = await axios.post(endPoint, data);
            console.log('Campaña creada:', response.data);
        } catch (error) {
            console.error('Error al crear:', error);
        }
    }

    // Función para actualizar
    async function update(data) {
        try {
            const response = await axios.put(`${endPoint}/${data.id}`, data);
            console.log('Campaña actualizada:', response.data);
        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    }

    function returnFormattedValues(values) {
        const formatDate = (isoString) => {
            const date = new Date(isoString);
            const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            return offsetDate.toISOString().slice(0, 19).replace("T", " ");
        };

        const formattedValues = {
            ...values,
            start_date: formatDate(values.start_date),
            end_date: formatDate(values.end_date),
        };

        if (!formattedValues.id || isNaN(Number(formattedValues.id))) {
            delete formattedValues.id;
        }

        return formattedValues;
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton className="bg-orange text-white">
                <Modal.Title className="fw-semibold fs-4">
                    {isView ? 'Visualizar' : isEdit ? 'Editar' : 'Crear'} {types[type]}
                </Modal.Title>
            </Modal.Header>

            <Formik
                initialValues={data}
                onSubmit={async (values) => {                    
                    const formattedValues = returnFormattedValues(values);
                    
                    if (isCreate) {
                        await create(formattedValues);
                    } else if (isEdit) {
                        await update(formattedValues);
                    }
                    onHide();
                }}
            >
                {({ values }) => (
                    <FormikForm>
                        <Modal.Body className="bg-light px-4 py-3">
                            <Row className="g-3">
                                {Object.entries(values).map(([key, value], index) => {
                                    if (isCreate && key === 'id') return null;

                                    const label = labels[key];
                                    if (!label) return null;

                                    const goodLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

                                    const isDateField = ['start_date', 'end_date'].includes(key);

                                    const dateValue = isDateField && value ? value.split('T')[0] : value;

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
                                                    type={isDateField ? 'date' : 'text'}
                                                    value={isDateField ? dateValue : value}
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
                                    {isCreate ? 'Crear' : 'Guardar'}
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