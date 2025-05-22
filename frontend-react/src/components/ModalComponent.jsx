import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DATABASE_TABLES } from '../../database';

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const validationSchemas = {
  season_types: Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio').min(3).max(30),
    start_day: Yup.number().required('El día de inicio es obligatorio'),
    start_month: Yup.number().required('El mes de inicio es obligatorio'),
    end_day: Yup.number().required('El día de fin es obligatorio'),
    end_month: Yup.number().required('El mes de fin es obligatorio'),
    start_year: Yup.number()
        .typeError('El año debe ser un número')
        .required('El año de inicio es obligatorio')
        .min(2000, 'Debe ser mayor a 2000')
        .max(2100, 'Debe ser menor a 2100')
  }),
  default: Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio').min(3).max(50),
    start_date: Yup.date().required('La fecha de inicio es obligatoria').typeError('Fecha inválida'),
    end_date: Yup.date()
      .required('La fecha de fin es obligatoria')
      .typeError('Fecha inválida')
      .min(Yup.ref('start_date'), 'La fecha de fin debe ser posterior'),
    expenses: Yup.number().typeError('Debe ser un número').max(9999999),
    profits: Yup.number().typeError('Debe ser un número').max(9999999),
  })
};

const labels = {
    id: "ID", name: "Nombre", start_date: "Fecha de inicio", end_date: "Fecha de finalización",
    expenses: "Gastos", profits: "Beneficios", start_day: "Día de inicio", start_month: "Mes de inicio",
    end_day: "Día de fin", end_month: "Mes de fin", start_year: "Año de inicio"
};

function ModalComponent({ show, onHide, data = {}, mode, type }) {
  const endPoint = DATABASE_TABLES[type].endpoint;
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const getDays = (monthIndex) => (monthIndex === '' ? [] : Array.from({ length: daysInMonth[monthIndex] }, (_, i) => i + 1));

  const types = { campaigns: "campaña", seasons: "temporada", seasonTypes: "tipo de temporada", campaignTypes: "tipo de campañas" };
  const title = isView ? 'Visualizar' : isEdit ? 'Editar' : 'Crear';

  const isCreateType = type === 'seasonTypes' || type === 'campaignTypes';
  const validationSchema = isCreateType ? validationSchemas.season_types : validationSchemas.default;
  
  const initialValues = isCreate
    ? isCreateType
        ? { name: '', start_day: '', start_month: '', end_day: '', end_month: '', start_year: '' }
        : { name: '', start_date: '', end_date: '', expenses: '', profits: '' }
    : isCreateType
        ? { ...data, start_year: data.start_year ?? '' }
        : { ...data };

  const create = async (values) => {
    try {
      await axios.post(endPoint, values);
    } catch (error) {
      console.error('Error al crear:', error);
    }
  };

  const update = async (values) => {
    try {
      await axios.put(`${endPoint}/${values.id}`, values);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-orange text-white">
        <Modal.Title className="fw-semibold fs-4">{title} {types[type]}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (isCreate) await create(values);
          else if (isEdit) await update(values);
          onHide();
        }}
      >
        {({ values, setFieldValue }) => (
          <FormikForm>
            <Modal.Body className="bg-light px-4 py-3">
                <Row className="g-3">
                    {Object.entries(values).map(([key, value]) => {
                        if (isCreate && key === 'id') return null;
                        const label = labels[key];
                        if (!label) return null;
                        
                        if (['start_day', 'end_day'].includes(key)) {
                            const month = key === 'start_day' ? values.start_month : values.end_month;
                            return (
                                <Col md={3} key={key}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">{label}</Form.Label>
                                    <Field as="select" name={key} className="form-select">
                                        <option value="">Día</option>
                                        {getDays(month).map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name={key} component="div" className="text-danger small mt-1" />
                                </Form.Group>
                                </Col>
                            );
                        }

                        if (['start_month', 'end_month'].includes(key)) {
                            return (
                                <Col md={3} key={key}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">{label}</Form.Label>
                                        <Field
                                            as="select"
                                            name={key}
                                            className="form-select"
                                            onChange={(e) => {
                                                const val = e.target.value === '' ? '' : parseInt(e.target.value);
                                                setFieldValue(key, val);
                                                setFieldValue(key === 'start_month' ? 'start_day' : 'end_day', '');
                                            }}
                                        >
                                            <option value="">Mes</option>
                                            {monthNames.map((month, idx) => (
                                                <option key={idx} value={idx + 1}>{month}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name={key} component="div" className="text-danger small mt-1" />
                                    </Form.Group>
                                </Col>
                            );
                        }

                        if (key === 'name') {
                            const colSize = isCreate ? 12 : 6;
                            return (
                                <Col md={colSize} key={key}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">{label}</Form.Label>
                                    <Field
                                        as={Form.Control}
                                        type="text"
                                        name={key}
                                        readOnly={isView}
                                        plaintext={isView}
                                        className={`form-control ${isView ? 'bg-white border-0 ps-0' : ''}`}
                                    />
                                    <ErrorMessage name={key} component="div" className="text-danger small mt-1" />
                                </Form.Group>
                                </Col>
                            );
                        }

                        const isDate = ['start_date', 'end_date'].includes(key);
                        const isNumber = ['expenses', 'profits'].includes(key);

                        return (
                            <Col md={6} key={key}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">{label}</Form.Label>
                                    <Field
                                        as={Form.Control}
                                        type={isDate ? 'date' : isNumber ? 'number' : 'text'}
                                        name={key}
                                        readOnly={isView || key === 'id'}
                                        plaintext={isView}
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
              <Button variant="outline-secondary" onClick={onHide}>Cerrar</Button>
              {!isView && <Button type="submit" variant="primary">{isCreate ? 'Crear' : 'Guardar'}</Button>}
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
}

export default ModalComponent;