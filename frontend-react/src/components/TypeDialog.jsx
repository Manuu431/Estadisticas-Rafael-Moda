import { Field } from 'formik';
import * as Yup from 'yup';
import DialogField from './DialogField.jsx';
import DialogShell from './DialogShell.jsx';

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const validationSchema = Yup.object().shape({
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
});

const EMPTY = { name: '', first_year: '', repeats: true, last_year: '', start_month: '', start_day: '', end_month: '', end_day: '' };

const getDays = (month) => (month === '' ? [] : Array.from({ length: new Date(2000, month, 0).getDate() }, (_, i) => i + 1));

const payload = (values) => ({ ...values, repeats: values.repeats ? 1 : 0, last_year: values.repeats && values.last_year !== '' ? values.last_year : null });

function MonthField({ name, label, dayName, setFieldValue, large, disabled }) {
    return (
        <DialogField name={name} label={label} large={large}>
            <Field
                as="select"
                id={`dialog-${name}`}
                name={name}
                disabled={disabled}
                onChange={(e) => {
                    setFieldValue(name, e.target.value === '' ? '' : parseInt(e.target.value));
                    setFieldValue(dayName, '');
                }}
            >
                <option value="">Mes</option>
                {MONTH_NAMES.map((month, idx) => (
                    <option key={idx} value={idx + 1}>{month}</option>
                ))}
            </Field>
            <i className="bi bi-chevron-down" aria-hidden="true" />
        </DialogField>
    );
}

function DayField({ name, label, month, large, disabled }) {
    return (
        <DialogField name={name} label={label} large={large}>
            <Field as="select" id={`dialog-${name}`} name={name} disabled={disabled}>
                <option value="">Día</option>
                {getDays(month).map((day) => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </Field>
            <i className="bi bi-chevron-down" aria-hidden="true" />
        </DialogField>
    );
}

function TextField({ name, label, large, readOnly }) {
    return (
        <DialogField name={name} label={label} wide large={large}>
            <Field id={`dialog-${name}`} type="text" name={name} readOnly={readOnly} className={readOnly ? 'is-readonly' : ''} />
        </DialogField>
    );
}

function TypeDialog({ show, onHide, data, mode, type }) {
    const initialValues = mode === 'create'
        ? EMPTY
        : { id: data.id, name: data.name, first_year: data.first_year ?? '', repeats: Boolean(data.repeats), last_year: data.last_year ?? '', start_month: data.start_month, start_day: data.start_day, end_month: data.end_month, end_day: data.end_day };
    return (
        <DialogShell show={show} onHide={onHide} mode={mode} type={type} initialValues={initialValues} validationSchema={validationSchema} payload={payload}>
            {({ values, setFieldValue, isMobile, isView }) => (
                <div className="dialog-grid">
                    <TextField name="name" label="Nombre" large={isMobile} readOnly={isView} />
                    <TextField name="first_year" label="Año de inicio" large={isMobile} readOnly={isView} />
                    <div className="dialog-field is-wide">
                        <label className="d-flex align-items-center gap-2">
                            <Field type="checkbox" name="repeats" id="dialog-repeats" disabled={isView} className="m-0 form-check-input" />
                            <span className="m-0 sales-panel-label">Se repite cada año</span>
                        </label>
                        {values.repeats ? null : <p className="m-0 panel-note">Solo se crea la edición del año de inicio (por ejemplo, un aniversario).</p>}
                    </div>
                    {values.repeats ? <TextField name="last_year" label="Último año (opcional)" large={isMobile} readOnly={isView} /> : null}
                    <MonthField name="start_month" label="Mes de inicio" dayName="start_day" setFieldValue={setFieldValue} large={isMobile} disabled={isView} />
                    <DayField name="start_day" label="Día de inicio" month={values.start_month} large={isMobile} disabled={isView} />
                    <MonthField name="end_month" label="Mes de fin" dayName="end_day" setFieldValue={setFieldValue} large={isMobile} disabled={isView} />
                    <DayField name="end_day" label="Día de fin" month={values.end_month} large={isMobile} disabled={isView} />
                </div>
            )}
        </DialogShell>
    );
}

export default TypeDialog;