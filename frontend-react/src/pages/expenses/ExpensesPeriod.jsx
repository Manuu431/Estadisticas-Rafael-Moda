import Segments from '../../components/Segments.jsx';
import FieldDropdown from '../../components/FieldDropdown.jsx';

function ExpensesPeriod({ menu, kind, onKindChange, grainOptions, grain, onGrainChange, large }) {
    return (
        <div className="expenses-tools">
            <FieldDropdown label="Periodo" value={kind} options={menu} onChange={onKindChange} className="expenses-period" large={large} />
            <Segments options={grainOptions} value={grain} onChange={onGrainChange} label="Mostrar por" className="is-plus panel-head-segs" />
        </div>
    );
}

export default ExpensesPeriod;