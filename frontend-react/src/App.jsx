import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';

const ControlPanel = lazy(() => import('./pages/controlPanel/ControlPanel'));
const Sales = lazy(() => import('./pages/Sales'));
const Clients = lazy(() => import('./pages/Clients'));
const Comparative = lazy(() => import('./pages/comparative/Comparative'));
const Calendar = lazy(() => import('./pages/calendar/Calendar'));
const Expenses = lazy(() => import('./pages/expenses/Expenses'));
const Planning = lazy(() => import('./pages/Planning'));
const More = lazy(() => import('./pages/More'));

function RouteLoading() {
    return (
        <div className="sales-state" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            Cargando…
        </div>
    );
}

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
                                <Suspense fallback={<RouteLoading />}>
                                <Routes>
                                <Route path="/" element={<ControlPanel title="Hoy en la tienda" />} />
                                <Route path="/ventas" element={<Sales title="Ventas" />} />
                                <Route path="/clientes" element={<Clients title="Clientes" />} />
                                <Route path="/comparativa" element={<Comparative title="Comparativa" />} />
                                <Route path="/calendario" element={<Calendar title="Calendario" />} />
                                <Route path="/planificacion" element={<Navigate to="/planificacion/campanas" replace />} />
                                <Route path="/planificacion/tipos-campanas" element={<Navigate to="/planificacion/campanas" replace />} />
                                <Route path="/planificacion/tipos-temporadas" element={<Navigate to="/planificacion/temporadas" replace />} />
                                <Route path="/planificacion/:tab" element={<Planning title="Campañas y temporadas" />} />
                                <Route path="/gastos" element={<Expenses title="Gastos" />} />
                                <Route path="/mas" element={<More title="Más" />} />
                                <Route path="/campañas" element={<Navigate to="/planificacion/campanas" replace />} />
                                <Route path="/temporadas" element={<Navigate to="/planificacion/temporadas" replace />} />
                                <Route path="/tipos-campañas" element={<Navigate to="/planificacion/campanas" replace />} />
                                <Route path="/tipos-temporadas" element={<Navigate to="/planificacion/temporadas" replace />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                                </Suspense>
                            </Layout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;