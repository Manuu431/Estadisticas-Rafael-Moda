import { format, isSameMonth  } from 'date-fns';
import { es } from 'date-fns/locale';

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function CustomToolbar({ onNavigate, date }) {
    const today = new Date();

    const isCurrentMonth = isSameMonth(date, today);

    const formatted = isCurrentMonth
        ? capitalize(format(date, "EEEE, dd 'de' MMMM yyyy", { locale: es }))
        : capitalize(format(date, "MMMM yyyy", { locale: es }));

    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button onClick={() => onNavigate('PREV')}>Anterior</button>
                <button onClick={() => onNavigate('TODAY')}>Hoy</button>
                <button onClick={() => onNavigate('NEXT')}>Siguiente</button>
            </span>
            <span className="rbc-toolbar-label">{formatted}</span>
        </div>
    );
}