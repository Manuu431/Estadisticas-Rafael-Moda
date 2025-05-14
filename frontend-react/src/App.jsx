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
                    <Route path="/ventas" element={<Sales title="Ventas" />} />
                    <Route path="/clientes" element={<Clients title="Clientes" />} />
                    <Route path="/comparativa" element={<Comparison title="Comparativa" />} />
                    <Route path="/calendario" element={<Calendar title="Calendario" />} />
                    <Route path="/campañas" element={<Campaigns title="Campañas" />} />
                    <Route path="/gastos" element={<Expenses title="Gastos" />} />
                    <Route path="/temporadas" element={<Seasons title="Temporadas" />} />
                </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
