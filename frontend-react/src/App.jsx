import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import ControlPanel from './pages/controlPanel/ControlPanel';
import Sales from './pages/Sales';
import Clients from './pages/Clients';
import Comparative from './pages/comparative/Comparative';
import Calendar from './pages/calendar/Calendar';
import Campaigns from './pages/Campaigns';
import Expenses from './pages/expenses/Expenses';
import Seasons from './pages/Seasons';
import SeasonTypes from './pages/SeasonTypes';
import CampaignTypes from './pages/CampaignTypes';

const classFilterCols = "col-12 col-md-6";

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
                  <Route path="/ventas" element={<Sales title="Ventas" classCols={classFilterCols} />} />
                  <Route path="/clientes" element={<Clients title="Clientes" classCols={classFilterCols} />} />
                  <Route path="/comparativa" element={<Comparative title="Comparativa" classCols={classFilterCols} />} />
                  <Route path="/calendario" element={<Calendar title="Calendario" />} />
                  <Route path="/temporadas" element={<Seasons title="Temporadas" classCols={classFilterCols} />} />
                  <Route path="/campañas" element={<Campaigns title="Campañas" classCols={classFilterCols} />} />
                  <Route path="/gastos" element={<Expenses title="Gastos" classCols={classFilterCols} />} />
                  <Route path="/tipos-temporadas" element={<SeasonTypes title="Tipos de temporada" classCols={classFilterCols} />} />
                  <Route path="/tipos-campañas" element={<CampaignTypes title="Tipos de campañas" classCols={classFilterCols} />} />
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