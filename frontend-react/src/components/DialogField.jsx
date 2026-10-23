import { ErrorMessage } from 'formik';

function DialogField({ name, label, wide, large, children }) {
    return (
        <div className={`dialog-field${wide ? ' is-wide' : ''}`}>
            <label className="sales-panel-label" htmlFor={`dialog-${name}`}>{label}</label>
            <span className={`panel-field is-plain${large ? ' is-large' : ''}`}>{children}</span>
            <ErrorMessage name={name} component="div" className="text-negative panel-note" />
        </div>
    );
}

export default DialogField;