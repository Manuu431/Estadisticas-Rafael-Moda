import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { MENU_ITEMS } from '../../info.js';

function Sidebar() {
    const handleClick = () => {
        if (window.innerWidth < 992) {
            const toggler = document.querySelector('.navbar-toggler');
            const sidebarMenu = document.getElementById('sidebarMenu');

            if (sidebarMenu.classList.contains('show') && toggler) {
                toggler.click();
            }
        }
    };

    return (
        <nav className="navbar navbar-expand-xl navbar-light bg-light p-0">
            <div className="container-fluid flex-xl-column align-items-stretch p-0">
                <div className="d-flex justify-content-between justify-content-xl-center align-items-center w-100 border-bottom border-dark bg-orange">
                    <NavLink to="/" onClick={() => handleClick()}>
                        <Logo />
                    </NavLink>
                    <div className='me-4 me-xl-0'>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#sidebarMenu"
                            aria-controls="sidebarMenu"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                    </div>
                </div>
                <div className="collapse navbar-collapse flex-column w-100 border-end border-black" id="sidebarMenu">
                    <ul className="navbar-nav w-100 flex-column">
                        {MENU_ITEMS.map((item, idx) =>
                            item.icon ? (
                            <li className="nav-item w-100" key={idx}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => handleClick()}
                                    className={({ isActive }) =>
                                        `nav-link rounded-0 border-bottom border-black ${idx % 2 === 0 ? 'bg-orange' : 'bg-gray'} ${isActive ? 'text-white' : 'text-dark'} ps-4 p-3`
                                    }
                                >
                                    {({ isActive }) => (
                                        <div className="nav-link-content">
                                            <i className={item.icon} /> <span className={isActive ? 'fst-italic' : ''}>{item.name}</span>
                                        </div>
                                    )}
                                </NavLink>
                            </li>
                            ) : null
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Sidebar;