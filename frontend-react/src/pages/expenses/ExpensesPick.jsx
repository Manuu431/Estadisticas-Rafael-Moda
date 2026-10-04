import { parseISO } from 'date-fns';
import FieldDropdown from '../../components/FieldDropdown.jsx';
import { CustomDates } from '../../components/SalesFields.jsx';
import { formatCompactRange } from '../../utils/dates.js';

const LABELS = { campaign: 'Campaña', season: 'Temporada' };

function ExpensesPick({ kind, items, loading, value, onChange, dates, onDatesChange }) {
    if (kind === 'year') return null;

    if (kind === 'dates') {
        return (
            <div className="expenses-extra">
                <CustomDates period={dates} onChange={onDatesChange} />
            </div>
        );
    }

    const options = items.length > 0
        ? items.map((item) => ({
            value: String(item.id),
            label: item.name,
            detail: formatCompactRange(parseISO(item.start_date), parseISO(item.end_date))
        }))
        : [{ value: '', label: loading ? 'Cargando…' : 'Todavía no hay ninguna' }];

    return (
        <div className="expenses-extra">
            <FieldDropdown label={LABELS[kind]} value={value} options={options} onChange={onChange} className="expenses-pick" />
        </div>
    );
}

export default ExpensesPick;