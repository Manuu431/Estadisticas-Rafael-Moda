import { Field } from 'formik';
import * as Yup from 'yup';
import DialogField from './DialogField.jsx';
import DialogShell from './DialogShell.jsx';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio').min(3).max(50),
    start_date: Yup.date().required('La fecha de inicio es obligatoria').typeError('Fecha inválida'),
    end_date: Yup.date()
        .required('La fecha de fin es obligatoria')
        .typeError('Fecha inválida')
        .min(Yup.ref('start_date'), 'La fecha de fin debe ser posterior'),
    expenses: Yup.number().typeError('Debe ser un número').max(9999999, 'No puede superar los 9.999.999').nullable(),
    profits: Yup.number().typeError('Debe ser un número').max(9999999, 'No puede superar los 9.999.999').nullable(),
});

const EMPTY = { name: '', start_date: '', end_date: '', expenses: '', profits: '' };

const LABELS = { name: "Nombre", start_date: "Fecha de inicio", end_date: "Fecha de finalización", expenses: "Gastos", profits: "Beneficios" };

function EditionDialog({ show, onHide, data, mode, type }) {
    const started = mode === 'edit' && Boolean(data.start_date) && String(data.start_date).slice(0, 10) <= new Date().toLocaleDateString('sv-SE');
    return (
        <DialogShell show={show} onHide={onHide} mode={mode} type={type} initialValues={mode === 'create' ? EMPTY : { ...data }} validationSchema={validationSchema}>
            {({ values, isMobile, isView }) => (
                <div className="dialog-grid">
                    {Object.keys(values).map((key) => {
                        const label = LABELS[key];
                        if (!label) return null;
                        const isDate = key === 'start_date' || key === 'end_date';
                        const isNumber = key === 'expenses' || key === 'profits';
                        const computed = key === 'name' || key === 'profits';
                        const readOnly = isView || computed || (started && isDate);
                        return (
                            <DialogField key={key} name={key} label={label} wide={key === 'name'} large={isMobile}>
                                <Field
                                    id={`dialog-${key}`}
                                    type={isDate ? 'date' : isNumber ? 'number' : 'text'}
                                    name={key}
                                    readOnly={readOnly}
                                    className={readOnly ? 'is-readonly' : ''}
                                />
                            </DialogField>
                        );
                    })}
                    {started ? <p className="m-0 panel-note dialog-field is-wide">Esta edición ya empezó: sus fechas no se tocan para que las comparativas sigan siendo justas. Solo puedes corregir los gastos.</p> : null}
                </div>
            )}
        </DialogShell>
    );
}

export default EditionDialog;