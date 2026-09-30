import { addMonths, subMonths, startOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export function CustomToolbar({ date, onNavigate }) {
    return (
        <div className="d-flex align-items-center gap-2">
            <button type="button" className="panel-btn" onClick={() => onNavigate(startOfMonth(new Date()))}>
                Hoy
            </button>
            <button
                type="button"
                className="calendar-arrow"
                onClick={() => onNavigate(subMonths(date, 1))}
                aria-label="Mes anterior"
            >
                <i className="bi bi-chevron-left" aria-hidden="true" />
            </button>
            <span className="calendar-title text-center" aria-live="polite">
                {capitalize(format(date, 'MMMM yyyy', { locale: es }))}
            </span>
            <button
                type="button"
                className="calendar-arrow"
                onClick={() => onNavigate(addMonths(date, 1))}
                aria-label="Mes siguiente"
            >
                <i className="bi bi-chevron-right" aria-hidden="true" />
            </button>
        </div>
    );
}