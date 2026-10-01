import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { MENU_ITEMS } from '../config/info.js';
import { readUser, isDemoUser, clearSession } from '../utils/session.js';

const NAV_GROUPS = MENU_ITEMS.reduce((groups, item) => {
    const current = groups[groups.length - 1];
    if (current && current.label === item.group) current.items.push(item);
    else groups.push({ label: item.group, items: [item] });
    return groups;
}, []);

function Sidebar() {
    const navigate = useNavigate();
    const user = readUser();
    const isDemo = isDemoUser(user);
    const handleLogout = () => {
        clearSession();
        navigate('/login');
    };

    return (
        <aside className="app-sidebar d-flex flex-column gap-4">
            <NavLink to="/" end className="app-brand">
                <Logo />
            </NavLink>
            <nav className="d-flex flex-column gap-4" aria-label="Principal">
                {NAV_GROUPS.map((group) => (
                    <div className="d-flex flex-column" key={group.label ?? 'inicio'}>
                        {group.label ? <span className="app-nav-group">{group.label}</span> : null}
                        {group.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) =>
                                    `app-nav-link d-flex align-items-center gap-3 text-decoration-none${isActive ? ' is-active' : ''}`
                                }
                            >
                                <i className={item.icon} aria-hidden="true" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="app-session d-flex align-items-center gap-2 mt-auto">
                <span className="app-avatar d-flex align-items-center justify-content-center" aria-hidden="true">RM</span>
                <span className="d-flex flex-column flex-grow-1 overflow-hidden">
                    <span className="fw-semibold text-truncate">{isDemo ? 'Modo demo' : user?.username ?? 'Mi cuenta'}</span>
                    <span className="app-session-note text-truncate">{isDemo ? 'Datos de ejemplo' : 'Sesión iniciada'}</span>
                </span>
                <button
                    type="button"
                    className="app-icon-btn d-flex align-items-center justify-content-center flex-shrink-0"
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                >
                    <i className="bi bi-box-arrow-right" aria-hidden="true" />
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;