import { useMemo } from 'react';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { campaignProgress, currentCampaign, nextCampaigns, previousEdition, remainingLabel } from '../../../utils/campaigns.js';
import { formatCompactRange } from '../../../utils/dates.js';
import { formatEuros, formatEurosSigned } from '../../../utils/format.js';
import { SECTION_LABELS } from '../../../config/labels.js';
import { CardError, Skeleton } from './CardState.jsx';

const UPCOMING = 2;

function daysAway(days) {
    if (days === 0) return 'empieza hoy';
    if (days === 1) return 'mañana';
    return `en ${days} días`;
}

function CampaignsSkeleton() {
    return (
        <div className="d-flex flex-column gap-3 flex-grow-1">
            <Skeleton className="is-box" />
            <div className="d-flex flex-column gap-3 mt-auto">
                <Skeleton className="w-25" />
                {[0, 1].map((slot) => <Skeleton key={slot} className="is-stat" />)}
            </div>
        </div>
    );
}

function CurrentCampaign({ campaign, today, section }) {
    const progress = campaignProgress(campaign, today);

    return (
        <div className="campaign-current d-flex flex-column gap-3">
            <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="d-flex flex-column gap-2">
                    <span className="campaign-pill d-inline-flex align-items-center gap-2 align-self-start">
                        <span className="campaign-dot" />En curso
                    </span>
                    <span className="campaign-name">{campaign.type_name}</span>
                    <span className="panel-muted">
                        {formatCompactRange(parseISO(campaign.start_date), parseISO(campaign.end_date))} · día {progress.day} de {progress.total}
                    </span>
                </div>
                <span className="panel-note fw-semibold text-nowrap">{remainingLabel(progress.remaining)}</span>
            </div>
            <span className="panel-track is-thin d-block">
                <span className="panel-fill d-block" style={{ width: `${progress.percent}%` }} />
            </span>
            <div className="row g-3">
                <div className="col-4 d-flex flex-column gap-1">
                    <span className="panel-muted">Gastos</span>
                    <span className="fw-semibold">{formatEuros(campaign.expenses)}</span>
                </div>
                <div className="col-4 d-flex flex-column gap-1">
                    <span className="panel-muted">Beneficio</span>
                    <span className="fw-semibold">{formatEuros(campaign.profits)}</span>
                </div>
                <div className="col-4 d-flex flex-column gap-1">
                    <span className="panel-muted">Balance</span>
                    <span className={`fw-semibold ${campaign.balance < 0 ? 'text-negative' : 'text-positive'}`}>{formatEurosSigned(campaign.balance)}</span>
                </div>
            </div>
            {section ? (
                <span className="panel-muted">Solo {SECTION_LABELS[section]}; los gastos se reparten según lo que vendió en la campaña.</span>
            ) : null}
        </div>
    );
}

export default function Campaigns({ campaigns, today, section, error, onRetry }) {
    const data = useMemo(() => {
        if (!campaigns) return null;
        return {
            current: currentCampaign(campaigns, today),
            next: nextCampaigns(campaigns, today, UPCOMING).map((campaign) => ({
                campaign,
                previous: previousEdition(campaigns, campaign),
                days: differenceInCalendarDays(parseISO(campaign.start_date), today)
            }))
        };
    }, [campaigns, today]);

    if (error) return <CardError onRetry={onRetry} />;
    if (!data) return <CampaignsSkeleton />;

    return (
        <div className="d-flex flex-column gap-3 flex-grow-1">
            {data.current
                ? <CurrentCampaign campaign={data.current} today={today} section={section} />
                : <p className="panel-muted m-0">Ninguna campaña en curso ahora mismo.</p>}
            {data.next.length > 0 ? (
                <div className="d-flex flex-column mt-auto">
                    <span className="panel-label pb-1">Próximas</span>
                    {data.next.map(({ campaign, previous, days }, index) => (
                        <div className={`d-flex align-items-center gap-3 py-3${index < data.next.length - 1 ? ' panel-divider-bottom' : ' pb-0'}`} key={campaign.id}>
                            <span className="panel-date-chip d-flex flex-column align-items-center justify-content-center">
                                <span className="fw-semibold lh-1">{format(parseISO(campaign.start_date), 'd')}</span>
                                <span className="panel-label mt-1">{format(parseISO(campaign.start_date), 'MMM', { locale: es })}</span>
                            </span>
                            <span className="d-flex flex-column gap-1 flex-grow-1 overflow-hidden">
                                <span className="fw-semibold text-truncate">{campaign.type_name}</span>
                                <span className="panel-muted text-truncate">
                                    {previous ? (
                                        <>La última vez: {formatEurosSigned(previous.profits, { round: true })}<span className="d-none d-lg-inline"> de beneficio</span></>
                                    ) : 'Primera edición'}
                                </span>
                            </span>
                            <span className="panel-muted text-nowrap">{daysAway(days)}</span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
