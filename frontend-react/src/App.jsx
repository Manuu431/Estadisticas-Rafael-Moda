import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import ControlPanel from './pages/controlPanel/ControlPanel';
import Sales from './pages/Sales';
import Clients from './pages/Clients';
import Comparative from './pages/comparative/Comparative';
import Calendar from './pages/calendar/Calendar';
import Expenses from './pages/expenses/Expenses';
import Planning from './pages/Planning';
import More from './pages/More';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Routes>
                                <Route path="/" element={<ControlPanel title="Panel de control" />} />
                                <Route path="/ventas" element={<Sales title="Ventas" />} />
                                <Route path="/clientes" element={<Clients title="Clientes" />} />
                                <Route path="/comparativa" element={<Comparative title="Comparativa" />} />
                                <Route path="/calendario" element={<Calendar title="Calendario" />} />
                                <Route path="/planificacion" element={<Planning title="Campañas y temporadas" />} />
                                <Route path="/planificacion/:tab" element={<Planning title="Campañas y temporadas" />} />
                                <Route path="/gastos" element={<Expenses title="Gastos" />} />
                                <Route path="/mas" element={<More title="Más" />} />
                                <Route path="/campañas" element={<Navigate to="/planificacion/campanas" replace />} />
                                <Route path="/temporadas" element={<Navigate to="/planificacion/temporadas" replace />} />
                                <Route path="/tipos-campañas" element={<Navigate to="/planificacion/tipos-campanas" replace />} />
                                <Route path="/tipos-temporadas" element={<Navigate to="/planificacion/tipos-temporadas" replace />} />
                                </Routes>
                            </Layout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;