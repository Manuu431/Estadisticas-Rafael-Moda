import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { DATABASE_TABLES } from "../config/database.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import BottomSheet from "./BottomSheet.jsx";

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const validationSchemas = {
  types: Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio').min(3).max(30),
    start_day: Yup.number().required('El día de inicio es obligatorio'),
    start_month: Yup.number().required('El mes de inicio es obligatorio'),
    end_day: Yup.number().required('El día de fin es obligatorio'),
    end_month: Yup.number().required('El mes de fin es obligatorio'),
    start_year: Yup.number()
        .typeError('El año debe ser un número')
        .required('El año de inicio es obligatorio')
        .min(1975, 'Debe ser mayor a 1975')
        .max(2100, 'Debe ser menor a 2100')
  }),
  default: Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio').min(3).max(50),
    start_date: Yup.date().required('La fecha de inicio es obligatoria').typeError('Fecha inválida'),
    end_date: Yup.date()
      .required('La fecha de fin es obligatoria')
      .typeError('Fecha inválida')
      .min(Yup.ref('start_date'), 'La fecha de fin debe ser posterior'),
    expenses: Yup.number().typeError('Debe ser un número').max(9999999, 'No puede superar los 9.999.999').nullable(),
    profits: Yup.number().typeError('Debe ser un número').max(9999999, 'No puede superar los 9.999.999').nullable(),
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
  const isMobile = useIsMobile();

  const getDays = (month, year) => (month === '' ? [] : Array.from({ length: new Date(Number(year) || 2001, month, 0).getDate() }, (_, i) => i + 1));

  const types = { campaigns: "campaña", seasons: "temporada", seasonTypes: "tipo de temporada", campaignTypes: "tipo de campaña" };
  const heading = `${isView ? 'Visualizar' : isEdit ? 'Editar' : 'Crear'} ${types[type]}`;

  const isCreateType = type === 'seasonTypes' || type === 'campaignTypes';
  const validationSchema = isCreateType ? validationSchemas.types : validationSchemas.default;

  const initialValues = isCreate
    ? isCreateType
        ? { name: '', start_year: '', start_month: '', start_day: '', end_month: '', end_day: '' }
        : { name: '', start_date: '', end_date: '', expenses: '', profits: '' }
    : isCreateType
        ? { id: data.id, name: data.name, start_year: data.start_year ?? '', start_month: data.start_month, start_day: data.start_day, end_month: data.end_month, end_day: data.end_day }
        : { ...data };

  const create = async (values) => {
    try {
      await axios.post(endPoint, values);
      alert('Elemento creado correctamente.');
    } catch (error) {
      console.error('Error al crear:', error);
      alert('No se pudo crear el elemento.');
    }
  };

  const update = async (values) => {
    try {
      await axios.put(`${endPoint}/${values.id}`, values);
      alert('Elemento actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('No se pudo actualizar el elemento.');
    }
  };

  const renderFields = (values, setFieldValue) => (
    <Row className="g-3">
        {Object.keys(values).map(key => {
            if (isCreate && key === 'id') return null;
            const label = labels[key];
            if (!label) return null;

            if (['start_day', 'end_day'].includes(key)) {
                const isStart = key === 'start_day';
                const month = isStart ? values.start_month : values.end_month;
                const crossesYear = !isStart && values.start_month !== '' && values.end_month !== '' && values.end_month < values.start_month;
                const year = values.start_year === '' ? '' : crossesYear ? Number(values.start_year) + 1 : values.start_year;
                return (
                    <Col xs={6} md={3} key={key}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">{label}</Form.Label>
                        <Field as="select" name={key} className="form-select">
                            <option value="">Día</option>
                            {getDays(month, year).map(day => (
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
                    <Col xs={6} md={3} key={key}>
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
  );

  const actions = (
    <>
      {isMobile ? null : <button type="button" className="panel-ghost" onClick={onHide}>Cerrar</button>}
      {!isView && (
        <button type="submit" className={isMobile ? 'm-primary' : 'panel-primary'}>
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
        if (isCreate) await create(values);
        else if (isEdit) await update(values);
        onHide();
      }}
    >
      {({ values, setFieldValue }) => (
        <FormikForm>
          {isMobile ? (
            <div className="d-flex flex-column gap-3">
              {renderFields(values, setFieldValue)}
              {isView ? null : <div className="m-sheet-foot d-flex gap-2">{actions}</div>}
            </div>
          ) : (
            <>
              <Modal.Body className="bg-light px-4 py-3">{renderFields(values, setFieldValue)}</Modal.Body>
              <Modal.Footer className="bg-secondary-subtle px-4">{actions}</Modal.Footer>
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
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="fw-semibold fs-4">{heading}</Modal.Title>
      </Modal.Header>
      {form}
    </Modal>
  );
}

export default ModalComponent;