import { NavLink, useNavigate } from 'react-router-dom';
import { MORE_ITEMS } from '../config/info.js';
import { readUser, isDemoUser, clearSession } from '../utils/session.js';

function More(props) {
    const navigate = useNavigate();
    const user = readUser();
    const isDemo = isDemoUser(user);
    const handleLogout = () => {
        clearSession();
        navigate('/login');
    };
    return (
        <>
            <header className="d-flex flex-column gap-1 mb-4">
                <span className="panel-kicker">Todo lo demás</span>
                <h1 className="m-0 panel-title">{props.title}</h1>
            </header>
            <div className="d-flex flex-column gap-4">
                <section className="d-flex flex-column gap-2" aria-labelledby="more-analisis">
                    <h2 id="more-analisis" className="m-section-title m-0">Análisis</h2>
                    <nav className="m-list" aria-label="Más secciones">
                        {MORE_ITEMS.map((item) => (
                            <NavLink key={item.path} to={item.path} className="m-row d-flex align-items-center gap-3">
                                <span className="d-flex align-items-center justify-content-center m-row-ico">
                                    <i className={item.icon} aria-hidden="true" />
                                </span>
                                <span className="flex-grow-1">{item.name}</span>
                                <i className="bi bi-chevron-right m-row-chevron" aria-hidden="true" />
                            </NavLink>
                        ))}
                    </nav>
                </section>
                <section className="d-flex flex-column gap-2" aria-labelledby="more-cuenta">
                    <h2 id="more-cuenta" className="m-section-title m-0">Cuenta</h2>
                    <div className="m-list">
                        <div className="m-row d-flex align-items-center gap-3">
                            <span className="m-avatar d-flex align-items-center justify-content-center flex-shrink-0" aria-hidden="true">RM</span>
                            <span className="d-flex flex-column overflow-hidden">
                                <span className="fw-semibold text-truncate">{isDemo ? 'Modo demo' : user?.username ?? 'Mi cuenta'}</span>
                                <span className="text-truncate app-session-note">
                                    {isDemo ? 'Estás viendo datos de ejemplo' : 'Sesión iniciada'}
                                </span>
                            </span>
                        </div>
                        <button type="button" className="m-row m-row-danger d-flex align-items-center gap-3 w-100" onClick={handleLogout}>
                            <span className="d-flex align-items-center justify-content-center m-row-ico is-danger">
                                <i className="bi bi-box-arrow-right" aria-hidden="true" />
                            </span>
                            Cerrar sesión
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}

export default More;