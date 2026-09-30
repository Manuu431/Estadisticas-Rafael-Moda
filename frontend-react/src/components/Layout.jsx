import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout({ children }) {
    const location = useLocation();
    const hideSidebar = location.pathname === '/login';

    return (
        <div className="app-shell d-flex flex-column flex-xl-row min-vh-100">
            {!hideSidebar && <Sidebar />}
            <main className="app-main flex-grow-1">
                <div className="container-fluid px-0">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default Layout;