import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { startOfDay } from 'date-fns';
import ModalComponent from '../components/ModalComponent.jsx';
import { DATABASE_TABLES } from "../config/database.js";
import { useFetch } from "../hooks/useFetch.js";
import { buildRows, deleteMessage, syncMessage } from "../utils/planning.js";
import { useIsMobile } from "../utils/useIsMobile.js";
import { PlanningCards } from './planning/PlanningCards.jsx';
import { PlanningTable } from './planning/PlanningTable.jsx';

const TABS = [
    {
        slug: 'campanas',
        kind: 'campaigns',
        typeKey: 'campaignTypes',
        label: 'Campañas',
        intro: 'Cada campaña se repite todos los años. Despliega una para ver sus ediciones y apuntar lo que gastaste y lo que ganó.',
        newLabel: 'Nueva campaña',
        empty: 'Todavía no hay campañas.'
    },
    {
        slug: 'temporadas',
        kind: 'seasons',
        typeKey: 'seasonTypes',
        label: 'Temporadas',
        intro: 'Cada temporada se repite todos los años. Despliega una para ver sus ediciones y apuntar lo que gastaste y lo que ganó.',
        newLabel: 'Nueva temporada',
        empty: 'Todavía no hay temporadas.'
    }
];

const HIGHLIGHT_MS = 2500;
const MESSAGE_MS = 6000;

const readTemporalItem = () => {
    try {
        return JSON.parse(localStorage.getItem('temporalItem'));
    } catch {
        return null;
    }
};

function Tabs({ tab, counts, mobile, onSelect }) {
    return (
        <div className={mobile ? 'planning-segs panel-segs d-flex' : 'planning-tabs'} role="tablist" aria-label="Campañas o temporadas">
            {TABS.map((item) => {
                const selected = item.slug === tab.slug;
                const count = counts[item.kind];
                return (
                    <button
                        type="button"
                        role="tab"
                        key={item.slug}
                        id={`tab-${item.slug}`}
                        className={mobile ? `panel-seg flex-fill${selected ? ' is-on' : ''}` : `planning-tab${selected ? ' is-on' : ''}`}
                        aria-selected={selected}
                        onClick={() => onSelect(item.slug)}
                    >
                        {item.label}
                        {count === undefined ? null : <span className="planning-count">{count}</span>}
                    </button>
                );
            })}
        </div>
    );
}

function Planning(props) {
    const { tab: slug } = useParams();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const tab = TABS.find((item) => item.slug === slug) ?? TABS[0];

    const sources = {
        campaignTypes: useFetch(DATABASE_TABLES.campaignTypes.endpoint),
        seasonTypes: useFetch(DATABASE_TABLES.seasonTypes.endpoint),
        campaigns: useFetch(DATABASE_TABLES.campaigns.endpoint),
        seasons: useFetch(DATABASE_TABLES.seasons.endpoint)
    };
    const types = sources[tab.typeKey];
    const editions = sources[tab.kind];

    const [openId, setOpenId] = useState(null);
    const [modal, setModal] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [message, setMessage] = useState('');
    const [highlightId, setHighlightId] = useState(null);
    const external = useRef(readTemporalItem());
    const todayTime = startOfDay(new Date()).getTime();

    const rows = useMemo(
        () => buildRows(types.data ?? [], editions.data ?? [], new Date(todayTime), tab.kind),
        [types.data, editions.data, tab.kind, todayTime]
    );
    const failed = Boolean(types.error || editions.error);
    const loading = !failed && (types.data === null || editions.data === null);
    const state = failed ? 'error' : loading ? 'loading' : rows.length === 0 ? 'empty' : 'ready';
    const counts = {
        campaigns: sources.campaignTypes.data?.length,
        seasons: sources.seasonTypes.data?.length
    };

    const refetchAll = () => Promise.all(Object.values(sources).map((source) => source.refetch()));
    const retry = () => {
        if (types.error) types.refetch();
        if (editions.error) editions.refetch();
    };

    useEffect(() => {
        setOpenId(null);
        setMessage('');
    }, [tab.slug]);

    useEffect(() => {
        if (!message) return undefined;
        const timer = setTimeout(() => setMessage(''), MESSAGE_MS);
        return () => clearTimeout(timer);
    }, [message]);

    // Llegada desde el Calendario: abre el tipo de la edición, baja hasta ella y la marca un momento.
    useEffect(() => {
        const item = external.current;
        if (!item || state !== 'ready') return;
        external.current = null;
        localStorage.removeItem('temporalItem');
        if (!item.period_type_id || !rows.some((row) => row.type.id === item.period_type_id)) return;
        setOpenId(item.period_type_id);
        setHighlightId(item.id);
    }, [state, rows]);

    useEffect(() => {
        if (!highlightId) return undefined;
        const timer = setTimeout(() => setHighlightId(null), HIGHLIGHT_MS);
        return () => clearTimeout(timer);
    }, [highlightId]);

    useEffect(() => {
        if (!highlightId) return;
        document.getElementById(`edition-${highlightId}`)?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }, [highlightId, openId]);

    const closeModal = async () => {
        const changed = modal?.mode !== 'view';
        setModal(null);
        if (changed) await refetchAll();
    };

    const sync = async () => {
        setSyncing(true);
        setMessage('');
        try {
            const { data } = await axios.post(DATABASE_TABLES[tab.typeKey].endpointSync);
            await refetchAll();
            setMessage(syncMessage(data.created));
        } catch (error) {
            console.error('Error generating editions:', error.response ? error.response.data : error);
            setMessage('No se han podido generar las ediciones.');
        } finally {
            setSyncing(false);
        }
    };

    const remove = async (row) => {
        if (!window.confirm(deleteMessage(row.type.name, row.editions.length))) return;
        try {
            await axios.delete(`${DATABASE_TABLES[tab.typeKey].endpoint}/${row.type.id}`);
            if (openId === row.type.id) setOpenId(null);
            await refetchAll();
        } catch (error) {
            console.error('Error deleting type:', error.response ? error.response.data : error);
            setMessage(`No se ha podido eliminar «${row.type.name}».`);
        }
    };

    const handlers = {
        tab,
        rows,
        state,
        openId,
        highlightId,
        onToggle: (id) => setOpenId((current) => (current === id ? null : id)),
        onEdit: (row) => setModal({ type: tab.typeKey, mode: 'edit', data: row.type }),
        onDelete: remove,
        onEditEdition: (edition) => setModal({ type: tab.kind, mode: 'edit', data: edition }),
        onRetry: retry
    };
    const onNew = () => setModal({ type: tab.typeKey, mode: 'create', data: {} });
    const select = (next) => navigate(`/planificacion/${next}`);

    const heading = (
        <div className="panel-heading d-flex flex-column">
            <span className="panel-kicker">Planificación del año</span>
            <h1 className="panel-title m-0">{props.title}</h1>
        </div>
    );

    return (
        <div className={`planning-page${isMobile ? ' is-mobile' : ''}`}>
            {heading}
            <Tabs tab={tab} counts={counts} mobile={isMobile} onSelect={select} />
            {isMobile ? (
                <div className="planning-m-panel" role="tabpanel" aria-labelledby={`tab-${tab.slug}`}>
                    <p className="planning-intro m-0">{tab.intro}</p>
                    <button type="button" className="btn btn-brand w-100" onClick={onNew}>
                        <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                        {tab.newLabel}
                    </button>
                    <PlanningCards {...handlers} />
                    <button type="button" className="m-btn planning-m-sync" onClick={sync} disabled={syncing}>
                        {syncing ? <span className="spinner-border spinner-border-sm planning-spinner me-2" aria-hidden="true" /> : <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />}
                        Generar años pendientes
                    </button>
                    {message ? <p className="panel-note planning-message m-0" role="status">{message}</p> : null}
                </div>
            ) : (
                <PlanningTable {...handlers} onNew={onNew} onSync={sync} syncing={syncing} message={message} />
            )}
            {modal ? <ModalComponent show data={modal.data} mode={modal.mode} type={modal.type} onHide={closeModal} /> : null}
        </div>
    );
}

export default Planning;
