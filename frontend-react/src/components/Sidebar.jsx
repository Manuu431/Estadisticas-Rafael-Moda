import { NavLink } from 'react-router-dom';
import Logo from '../components/Logo';
import '../App.css';
import { MENU_ITEMS } from '../../info.js';

function Sidebar() {
  return (
    <div className="col-12 col-xl-2 p-0">
      <div className="d-flex justify-content-center border border-dark">
        <NavLink to="/">
          <Logo />
        </NavLink>
      </div>
      <ul className="nav nav-pills flex-column border border-dark">
        {MENU_ITEMS.map((item, idx) => (
            item.icon ? (
                <li className="nav-item" key={idx}>
                <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                    `nav-link rounded-0 border-bottom border-black ${idx % 2 === 0 ? 'bg-orange' : 'bg-gray'} ${isActive ? 'text-white' : 'text-dark'} px-4 py-3`
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
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;