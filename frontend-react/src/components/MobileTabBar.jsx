import { NavLink } from 'react-router-dom';
import { MOBILE_TABS } from '../config/info.js';

function MobileTabBar() {
    return (
        <nav className="m-tabbar" aria-label="Principal">
            {MOBILE_TABS.map((tab) => (
                <NavLink
                    key={tab.path}
                    to={tab.path}
                    end={tab.path === '/'}
                    className={({ isActive }) => `m-tab${isActive ? ' is-on' : ''}`}
                >
                    <span className="m-tab-ico d-flex align-items-center justify-content-center">
                        <i className={tab.icon} aria-hidden="true" />
                    </span>
                    {tab.name}
                </NavLink>
            ))}
        </nav>
    );
}

export default MobileTabBar;