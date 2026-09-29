import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { DATABASE_TABLES } from "../config/database.js";
import 'bootstrap-icons/font/bootstrap-icons.css'; // importa los iconos

function Login() {
    const navigate = useNavigate();
    const endpoint = DATABASE_TABLES['users'].endpoint;
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('El usuario es requerido'),
            password: Yup.string().required('La contraseña es requerida'),
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            setStatus('');
            try {
                const response = await axios.post(endpoint, values);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/');
            } catch (err) {
                if (err.response?.status === 401) {
                    setStatus('Credenciales inválidas.');
                } else {
                    setStatus('Error en el servidor.');
                }
            }
            setSubmitting(false);
        },
    });

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-gray">
            <div className="card shadow p-4 loginDiv" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="text-center mb-4">Iniciar sesión</h3>

                {formik.status && <div className="alert alert-danger">{formik.status}</div>}

                <form onSubmit={formik.handleSubmit} noValidate>
                    {inputField(formik, 'email', 'Usuario')}

                    {inputField(formik, 'password', 'Contraseña', showPassword ? 'text' : 'password', () =>
                    setShowPassword(!showPassword)
                    )}

                    <Button
                    className="btn w-100 btn-modal btn-create-modify"
                    type="submit"
                    disabled={formik.isSubmitting}
                    >
                    Acceder
                    </Button>
                </form>
            </div>
        </div>
    );
}

const inputField = (formik, name, label, type = 'text', toggleVisibility) => {
    const touched = formik.touched[name];
    const error = formik.errors[name];

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <div className="input-group">
                <input
                    name={name}
                    type={type}
                    className={`form-control${touched && error ? ' is-invalid' : ''}`}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={`Ingresa tu ${label.toLowerCase()}`}
                    autoComplete={name === 'password' ? 'current-password' : 'username'}
                    required
                />
                {toggleVisibility && (
                    <span
                    className="input-group-text password-toggle-icon"
                    onClick={toggleVisibility}
                    role="button"
                    title={type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                    aria-label={type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                    >
                    <i className={`bi ${type === 'password' ? 'bi-eye-slash' : 'bi-eye'}`} />
                    </span>
                )}
            </div>
            {touched && error ? <div className="invalid-feedback d-block">{error}</div> : null}
        </div>
    );
};

export default Login;