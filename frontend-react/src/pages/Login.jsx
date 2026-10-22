import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { DATABASE_TABLES } from "../config/database.js";
import logoMonogram from '../assets/logo/logo-monogram.svg';
import logoRafael from '../assets/logo/logo-rafael.svg';
import logoUnderline from '../assets/logo/logo-underline.svg';
import logoModa from '../assets/logo/logo-moda.svg';
import 'bootstrap-icons/font/bootstrap-icons.css';

const logoLayers = [
    { src: logoMonogram, className: 'login-logo-r' },
    { src: logoRafael, className: 'login-logo-rafael' },
    { src: logoUnderline, className: 'login-logo-underline' },
    { src: logoModa, className: 'login-logo-moda' },
];

function Login() {
    const navigate = useNavigate();
    const from = useLocation().state?.from ?? '/';
    const { endpoint, endpointDemo } = DATABASE_TABLES['users'];
    const [showPassword, setShowPassword] = useState(false);
    const startSession = ({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate(from, { replace: true });
    };
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('El correo es requerido'),
            password: Yup.string().required('La contraseña es requerida'),
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            setStatus('');
            try {
                const response = await axios.post(endpoint, values);
                startSession(response.data);
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
    const enterDemo = async () => {
        formik.setStatus('');
        try {
            const response = await axios.post(endpointDemo);
            startSession(response.data);
        } catch {
            formik.setStatus('El modo demo no está disponible.');
        }
    };
    return (
        <div className="d-flex login-page min-vh-100">
            <aside className="bg-primary d-none d-lg-flex flex-column justify-content-between position-relative overflow-hidden p-5 login-brand">
                <div className="login-logo" role="img" aria-label="Rafael Moda">
                    {logoLayers.map(({ src, className }) => (
                        <img key={className} className={`login-logo-layer ${className}`} src={src} alt="" />
                    ))}
                </div>
                <span className="position-relative login-kicker">Desde hace más de 50 años</span>
                <div className="position-relative d-flex flex-column gap-1">
                    <span className="fw-bold fs-4">Estadísticas de la tienda</span>
                    <span className="fw-medium">Ventas, campañas y temporadas en un solo sitio.</span>
                </div>
            </aside>
            <main className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
                <div className="w-100 d-flex flex-column gap-4 login-panel">
                    <div className="d-flex flex-column gap-2">
                        <h1 className="m-0 login-title">Iniciar sesión</h1>
                        <p className="text-body-secondary m-0">Accede al panel de la tienda.</p>
                    </div>
                    <form onSubmit={formik.handleSubmit} noValidate className="d-flex flex-column gap-3">
                        {formik.status && <div className="m-0 alert alert-danger" role="alert">{formik.status}</div>}
                        {inputField(formik, 'email', 'Correo electrónico', 'nombre@correo.com', 'email', 'email')}
                        {inputField(formik, 'password', 'Contraseña', 'Tu contraseña', 'current-password', showPassword ? 'text' : 'password', () => setShowPassword(!showPassword))}
                        <button type="submit" className="btn btn-brand w-100" disabled={formik.isSubmitting}>Entrar</button>
                    </form>
                    <div className="d-flex align-items-center gap-3 small text-body-secondary" aria-hidden="true">
                        <span className="flex-grow-1 border-top"></span>o<span className="flex-grow-1 border-top"></span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        <button type="button" className="btn btn-brand-outline w-100 d-flex align-items-center justify-content-center gap-2" onClick={enterDemo} disabled={formik.isSubmitting}>
                            <i className="bi bi-play fs-5" aria-hidden="true" />Entrar en modo demo
                        </button>
                        <p className="small text-body-secondary text-center m-0">Explora la aplicación con datos de ejemplo.<br />No necesitas cuenta.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

const inputField = (formik, name, label, placeholder, autoComplete, type, toggleVisibility) => {
    const invalid = formik.touched[name] && formik.errors[name];
    return (
        <div className="d-flex flex-column gap-2">
            <label htmlFor={name} className="fw-semibold small">{label}</label>
            <div className="position-relative">
                <input
                    id={name}
                    name={name}
                    type={type}
                    className={`form-control login-input${invalid ? ' is-invalid' : ''}${toggleVisibility ? ' pe-5' : ''}`}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                />
                {toggleVisibility && (
                    <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 me-3 p-0 translate-middle-y login-toggle"
                        onClick={toggleVisibility}
                        aria-label={type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                    >
                        <i className={`bi ${type === 'password' ? 'bi-eye-slash' : 'bi-eye'}`} />
                    </button>
                )}
            </div>
            {invalid ? <div className="invalid-feedback d-block">{formik.errors[name]}</div> : null}
        </div>
    );
};

export default Login;