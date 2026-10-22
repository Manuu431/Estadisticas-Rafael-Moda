import { useId, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { DATABASE_TABLES } from "../config/database.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import BottomSheet from "./BottomSheet.jsx";
import { writeError } from '../utils/errors.js';
import { useRestoreFocus } from '../hooks/useRestoreFocus.js';

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
    first_year: Yup.number()
        .typeError('El año debe ser un número')
        .required('El año de inicio es obligatorio')
        .min(1975, 'Debe ser mayor a 1975')
        .max(2100, 'Debe ser menor a 2100'),
    last_year: Yup.number()
        .transform((value, original) => (original === '' || original === null ? undefined : value))
        .typeError('El año debe ser un número')
        .min(Yup.ref('first_year'), 'No puede ser anterior al año de inicio')
        .max(2100, 'Debe ser menor a 2100')
        .notRequired()
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
    repeats: "Se repite cada año", name: "Nombre", start_date: "Fecha de inicio", end_date: "Fecha de finalización",
    expenses: "Gastos", profits: "Beneficios", start_day: "Día de inicio", start_month: "Mes de inicio",
    end_day: "Día de fin", end_month: "Mes de fin", first_year: "Año de inicio",
    last_year: "Último año (opcional)"
};

const wideKeys = ['name', 'first_year'];

function DialogField({ name, label, wide, large, children }) {
  return (
    <div className={`dialog-field${wide ? ' is-wide' : ''}`}>
      <label className="sales-panel-label" htmlFor={`dialog-${name}`}>{label}</label>
      <span className={`panel-field is-plain${large ? ' is-large' : ''}`}>{children}</span>
      <ErrorMessage name={name} component="div" className="panel-note text-negative" />
    </div>
  );
}

function ModalComponent({ show, onHide, data = {}, mode, type }) {
  const endPoint = DATABASE_TABLES[type].endpoint;
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';
  const isMobile = useIsMobile();
  const titleId = useId();
  useRestoreFocus();
  const [error, setError] = useState('');

  const getDays = (month) => (month === '' ? [] : Array.from({ length: new Date(2000, month, 0).getDate() }, (_, i) => i + 1));

  const types = { campaigns: "campaña", seasons: "temporada", seasonTypes: "tipo de temporada", campaignTypes: "tipo de campaña" };
  const heading = `${isView ? 'Visualizar' : isEdit ? 'Editar' : 'Crear'} ${types[type]}`;

  const isCreateType = type === 'seasonTypes' || type === 'campaignTypes';
  const validationSchema = isCreateType ? validationSchemas.types : validationSchemas.default;

  const initialValues = isCreate
    ? isCreateType
        ? { name: '', first_year: '', repeats: true, last_year: '', start_month: '', start_day: '', end_month: '', end_day: '' }
        : { name: '', start_date: '', end_date: '', expenses: '', profits: '' }
    : isCreateType
        ? { id: data.id, name: data.name, first_year: data.first_year ?? '', repeats: Boolean(data.repeats), last_year: data.last_year ?? '', start_month: data.start_month, start_day: data.start_day, end_month: data.end_month, end_day: data.end_day }
        : { ...data };

  const started = !isCreateType && isEdit && Boolean(data.start_date) && String(data.start_date).slice(0, 10) <= new Date().toLocaleDateString('sv-SE');
  const payload = (values) => (isCreateType ? { ...values, repeats: values.repeats ? 1 : 0, last_year: values.repeats && values.last_year !== '' ? values.last_year : null } : values);
  const save = (values) => (isCreate ? axios.post(endPoint, payload(values)) : axios.put(`${endPoint}/${values.id}`, payload(values)));

  const renderFields = (values, setFieldValue) => (
    <div className="dialog-grid">
        {Object.keys(values).map(key => {
            const label = labels[key];
            if (!label) return null;
            const id = `dialog-${key}`;
            const wide = wideKeys.includes(key);

            if (['start_day', 'end_day'].includes(key)) {
                const isStart = key === 'start_day';
                const month = isStart ? values.start_month : values.end_month;
                return (
                    <DialogField key={key} name={key} label={label} large={isMobile}>
                        <Field as="select" id={id} name={key} disabled={isView}>
                            <option value="">Día</option>
                            {getDays(month).map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </Field>
                        <i className="bi bi-chevron-down" aria-hidden="true" />
                    </DialogField>
                );
            }

            if (['start_month', 'end_month'].includes(key)) {
                return (
                    <DialogField key={key} name={key} label={label} large={isMobile}>
                        <Field
                            as="select"
                            id={id}
                            name={key}
                            disabled={isView}
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
                        <i className="bi bi-chevron-down" aria-hidden="true" />
                    </DialogField>
                );
            }

            if (key === 'repeats') {
                return (
                    <div className="dialog-field is-wide" key={key}>
                        <label className="d-flex align-items-center gap-2">
                            <Field type="checkbox" name="repeats" id={id} disabled={isView} className="form-check-input m-0" />
                            <span className="sales-panel-label m-0">{label}</span>
                        </label>
                        {values.repeats ? null : <p className="panel-note m-0">Solo se crea la edición del año de inicio (por ejemplo, un aniversario).</p>}
                    </div>
                );
            }

            if (key === 'last_year' && !values.repeats) return null;

            const computed = !isCreateType && (key === 'name' || key === 'profits');
            const isDate = ['start_date', 'end_date'].includes(key);
            const isNumber = ['expenses', 'profits'].includes(key);
            const readOnly = isView || computed || (started && isDate);

            return (
                <DialogField key={key} name={key} label={label} wide={key === 'name' || wide} large={isMobile}>
                    <Field
                        id={id}
                        type={isDate ? 'date' : isNumber ? 'number' : 'text'}
                        name={key}
                        readOnly={readOnly}
                        className={readOnly ? 'is-readonly' : ''}
                    />
                </DialogField>
            );
        })}
        {started ? <p className="panel-note m-0 dialog-field is-wide">Esta edición ya empezó: sus fechas no se tocan para que las comparativas sigan siendo justas. Solo puedes corregir los gastos.</p> : null}
    </div>
  );

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
              {renderFields(values, setFieldValue)}
              {error ? <p className="panel-note text-negative m-0" role="alert">{error}</p> : null}
              {isView ? null : <div className="m-sheet-foot d-flex gap-2">{actions(isSubmitting)}</div>}
            </div>
          ) : (
            <>
              <Modal.Body className="dialog-body">
                {renderFields(values, setFieldValue)}
                {error ? <p className="panel-note text-negative mt-3 mb-0" role="alert">{error}</p> : null}
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

export default ModalComponent;
