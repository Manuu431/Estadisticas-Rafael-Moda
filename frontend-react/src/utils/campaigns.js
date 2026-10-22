import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { parseDay } from './dates.js';

const byStartDate = (a, b) => parseDay(a.start_date) - parseDay(b.start_date);

export function currentCampaign(campaigns, today) {
    const now = startOfDay(today);
    return campaigns.find((campaign) => parseDay(campaign.start_date) <= now && parseDay(campaign.end_date) >= now) ?? null;
}

export function nextCampaigns(campaigns, today, limit = 3) {
    const now = startOfDay(today);
    return campaigns.filter((campaign) => parseDay(campaign.start_date) > now).sort(byStartDate).slice(0, limit);
}

export function previousEdition(campaigns, campaign) {
    const editions = campaigns
        .filter((other) => other.period_type_id === campaign.period_type_id && parseDay(other.start_date) < parseDay(campaign.start_date))
        .sort(byStartDate);
    return editions[editions.length - 1] ?? null;
}

export function campaignProgress(campaign, today) {
    const start = parseDay(campaign.start_date);
    const total = differenceInCalendarDays(parseDay(campaign.end_date), start) + 1;
    const elapsed = differenceInCalendarDays(startOfDay(today), start) + 1;
    const current = Math.min(Math.max(elapsed, 1), total);
    return { day: current, total, remaining: total - current, percent: (current / total) * 100 };
}

export function remainingLabel(remaining) {
    if (remaining === 0) return 'Último día';
    if (remaining === 1) return 'Queda 1 día';
    return `Quedan ${remaining} días`;
}