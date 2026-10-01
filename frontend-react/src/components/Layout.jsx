import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileTabBar from './MobileTabBar';
import { useIsMobile } from '../utils/useIsMobile.js';

function Layout({ children }) {
    const isMobile = useIsMobile();

    return (
        <div className="app-shell d-flex flex-column flex-xl-row min-vh-100">
            {isMobile ? <MobileHeader /> : <Sidebar />}
            <main className="app-main flex-grow-1">
                <div className="container-fluid px-0">
                    {children}
                </div>
            </main>
            {isMobile && <MobileTabBar />}
        </div>
    );
}

export default Layout;