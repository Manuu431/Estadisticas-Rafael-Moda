import { NavLink } from 'react-router-dom';
import Logo from './Logo';

function MobileHeader() {
    return (
        <header className="m-header d-flex align-items-center justify-content-between">
            <NavLink to="/" end className="app-brand" aria-label="Rafael Moda, inicio">
                <Logo />
            </NavLink>
            <NavLink to="/mas" className="m-avatar d-flex align-items-center justify-content-center" aria-label="Tu cuenta y más opciones">
                RM
            </NavLink>
        </header>
    );
}

export default MobileHeader;