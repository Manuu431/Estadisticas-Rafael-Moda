export function Button(props) {
    return (
        <button
            className={`btn ${props.buttonClasses} ps-2 text-white w-100 w-lg-auto py-3 py-xl-2 fs-5 d-flex align-items-center justify-content-center gap-2`}
            onClick={props.onClickFunction}
        >
            <i className={`${props.iconClasses} px-1 text-white`}></i>{props.text}
        </button>
    );
};

export function TableIconButton (props) {
    return (
        <button 
            className="btn p-0 d-flex border-0 tableIcon"
            onClick={props.onClickFunction}
            title={props.title}
        >
            <i className={`${props.classIcon} fs-5`}></i>
        </button>
    );
}

export function CampaignButtons({ currentIndex, setCurrentIndex, total }) {
    const campaignNumber = 10;
    
    const handleUp = () => {
        setCurrentIndex((prev) => Math.max(prev - campaignNumber, 0));
    };

    const handleDown = () => {
        setCurrentIndex((prev) => (prev + campaignNumber < total ? prev + campaignNumber : prev));
    };

    return (
        <div className="d-flex flex-column me-2">
            <CampaignButton
                onClickFunction={handleUp}
                disabled={currentIndex === 0}
                title="previous campaigns"
                classIcon="bi bi-caret-up-fill"
            />
            <CampaignButton
                onClickFunction={handleDown}
                disabled={currentIndex + campaignNumber >= total}
                title="next campaigns"
                classIcon="bi bi-caret-down-fill"
            />
        </div>
    );
}

function CampaignButton (props) {
    return (
        <button 
            className="btn btn-sm py-0 d-flex justify-content-center align-items-center border-orange" 
            onClick={props.onClickFunction}
            disabled={props.disabled}
            title={props.title}
        >
            <i className={props.classIcon}></i>
        </button>
    );
}

import { format, isSameMonth  } from 'date-fns';
import { es } from 'date-fns/locale';

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function CustomToolbar({ label, onNavigate, date }) {
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