// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import ControlPanel from './pages/ControlPanel';
import Sales from './pages/Sales';
import Clients from './pages/Clients';
import Comparison from './pages/Comparison';
import Calendar from './pages/Calendar';
import Campaigns from './pages/Campaigns';
import Expenses from './pages/Expenses';
import Seasons from './pages/Seasons';
import SeasonTypes from './pages/SeasonTypes';
import CampaignTypes from './pages/CampaignTypes';

const classFilterCols = "col-12 col-md-6";

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row min-vh-100">
          <Sidebar />
          <div className="col-12 col-xl-10 p-0">
            <div className="container-fluid">
                <Routes>
                    <Route path="/" element={<ControlPanel title="Panel de control" />} />
                    <Route path="/ventas" element={<Sales title="Ventas" classCols={classFilterCols} />} />
                    <Route path="/clientes" element={<Clients title="Clientes" classCols={classFilterCols} />} />
                    <Route path="/comparativa" element={<Comparison title="Comparativa" />} />
                    <Route path="/calendario" element={<Calendar title="Calendario" />} />
                    <Route path="/temporadas" element={<Seasons title="Temporadas" classCols={classFilterCols} />} />
                    <Route path="/campañas" element={<Campaigns title="Campañas" classCols={classFilterCols} />} />
                    <Route path="/gastos" element={<Expenses title="Gastos" />} />
                    <Route path="/tipos-temporadas" element={<SeasonTypes title="Tipos de temporada" classCols={classFilterCols} />} />
                    <Route path="/tipos-campañas" element={<CampaignTypes title="Tipos de campañas" classCols={classFilterCols} />} />
                </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
