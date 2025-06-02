import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout({ children }) {
    const location = useLocation();
    const hideSidebar = location.pathname === '/login';

    return (
        <div className="container-fluid">
            <div className="row">
                {!hideSidebar && (
                    <div className="col-12 col-xl-2 p-0">
                    <Sidebar />
                    </div>
                )}
                <div className={hideSidebar ? 'col-12 p-0' : 'col-12 col-xl-10 p-0'}>
                    <div className="container-fluid">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;