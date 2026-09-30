import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { MENU_ITEMS } from '../config/info.js';

const NAV_GROUPS = MENU_ITEMS.reduce((groups, item) => {
    const current = groups[groups.length - 1];
    if (current && current.label === item.group) current.items.push(item);
    else groups.push({ label: item.group, items: [item] });
    return groups;
}, []);

function readUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function Sidebar() {
    const navigate = useNavigate();
    const user = readUser();
    const isDemo = user?.id === 0;
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    const handleClick = () => {
        if (window.innerWidth >= 1200) return;
        const toggler = document.querySelector('.navbar-toggler');
        const sidebarMenu = document.getElementById('sidebarMenu');
        if (sidebarMenu?.classList.contains('show') && toggler) toggler.click();
    };

    return (
        <aside className="app-sidebar navbar navbar-expand-xl p-0">
            <div className="container-fluid flex-xl-column align-items-stretch gap-xl-4 p-0">
                <div className="d-flex justify-content-between align-items-center">
                    <NavLink to="/" className="app-brand" onClick={handleClick}>
                        <Logo />
                    </NavLink>
                    <button
                        className="navbar-toggler border-0 shadow-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#sidebarMenu"
                        aria-controls="sidebarMenu"
                        aria-expanded="false"
                        aria-label="Abrir el menú"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                </div>
                <div className="collapse navbar-collapse flex-column align-items-stretch" id="sidebarMenu">
                    <nav className="d-flex flex-column gap-4 pt-3 pt-xl-0" aria-label="Principal">
                        {NAV_GROUPS.map((group) => (
                            <div className="d-flex flex-column" key={group.label ?? 'inicio'}>
                                {group.label ? <span className="app-nav-group">{group.label}</span> : null}
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/'}
                                        onClick={handleClick}
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
                    <div className="app-session d-flex align-items-center gap-2 mt-3 mt-xl-auto">
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
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;