import { addMonths, format, startOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);


export function CalendarToolbar({ date, onNavigate, mobile = false }) {
    const today = (
        <button type="button" className="calendar-btn is-today" onClick={() => onNavigate(startOfMonth(new Date()))}>
            Hoy
        </button>
    );
    return (
        <div className={`calendar-toolbar d-flex align-items-center${mobile ? ' is-mobile' : ''}`}>
            {mobile ? null : today}
            <button type="button" className="calendar-btn is-arrow" onClick={() => onNavigate(subMonths(date, 1))} aria-label="Mes anterior">
                <i className="bi bi-chevron-left" aria-hidden="true" />
            </button>
            <span className="text-center calendar-title" aria-live="polite">
                {capitalize(format(date, 'MMMM yyyy', { locale: es }))}
            </span>
            <button type="button" className="calendar-btn is-arrow" onClick={() => onNavigate(addMonths(date, 1))} aria-label="Mes siguiente">
                <i className="bi bi-chevron-right" aria-hidden="true" />
            </button>
            {mobile ? today : null}
        </div>
    );
}