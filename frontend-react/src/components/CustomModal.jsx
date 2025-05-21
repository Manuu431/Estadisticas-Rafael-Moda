import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import axios from 'axios';
import { DATABASE_TABLES } from '../../database';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(30, 'El nombre debe tener como máximo 30 caracteres'),

  start_date: Yup.date()
    .required('La fecha de inicio es obligatoria')
    .typeError('Fecha inválida'),

  end_date: Yup.date()
    .required('La fecha de fin es obligatoria')
    .typeError('Fecha inválida')
    .min(Yup.ref('start_date'), 'La fecha de fin debe ser posterior a la de inicio'),

  expenses: Yup.number()
    .typeError('Los gastos deben ser un número')
    .required('Los gastos son obligatorios')
    .min(1, 'Los gastos deben ser al menos 1')
    .max(9999999, 'El gasto no puede ser mayor que 9,999,999'),

  profits: Yup.number()
    .typeError('Los beneficios deben ser un número')
    .required('Los beneficios son obligatorios')
    .min(1, 'Los beneficios deben ser al menos 1')
    .max(9999999, 'El beneficio no puede ser mayor que 9,999,999'),
});

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

    async function create(data) {
        try {
            const response = await axios.post(endPoint, data);
            console.log('Campaña creada:', response.data);
        } catch (error) {
            console.error('Error al crear:', error);
        }
    }

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
                validationSchema={validationSchema}
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

                                    let inputType = 'text';
                                    let inputMin = undefined;
                                    let inputMax = undefined;
                                    let inputStep = undefined;

                                    if (isDateField) {
                                        inputType = 'date';
                                    } else if (key === 'expenses' || key === 'profits') {
                                        inputType = 'number';
                                        inputMin = 1;
                                        inputMax = 9999999;
                                        inputStep = '0.01';
                                    } else if (key === 'name') {
                                        inputMax = 30;
                                    }

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
                                                    type={inputType}
                                                    min={inputMin}
                                                    maxLength={inputMax}
                                                    step={inputStep}
                                                    value={isDateField ? dateValue : value}
                                                    className={`form-control ${isView ? 'bg-white border-0 ps-0' : ''}`}
                                                />
                                                <ErrorMessage name={key} component="div" className="text-danger small mt-1" />
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