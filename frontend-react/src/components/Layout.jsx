import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileTabBar from './MobileTabBar';
import { useIsMobile } from '../utils/useIsMobile.js';

function Layout({ children }) {
    const isMobile = useIsMobile();
    return (
        <div className="d-flex flex-column flex-lg-row app-shell min-vh-100">
            {isMobile ? <MobileHeader /> : <Sidebar />}
            <main className="flex-grow-1 app-main">
                <div className="container-fluid px-0">
                    {children}
                </div>
            </main>
            {isMobile && <MobileTabBar />}
        </div>
    );
}

export default Layout;