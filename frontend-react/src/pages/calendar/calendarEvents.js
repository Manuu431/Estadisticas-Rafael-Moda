const seasonLabel = (name, isStart) => `${isStart ? 'Empieza' : 'Termina'} ${name}`;

export const openItem = (navigate, item) => {
    localStorage.setItem('temporalItem', JSON.stringify(item.original));
    navigate(item.type === 'campaign' ? '/campañas' : '/temporadas');
};

export function getMilestones(campaigns, seasons) {
    const milestones = [];

    campaigns.forEach((campaign) => {
        milestones.push({ date: new Date(campaign.start_date), label: campaign.name, type: 'campaign', original: campaign });
        milestones.push({ date: new Date(campaign.end_date), label: `Termina ${campaign.name}`, type: 'campaign', original: campaign });
    });

    seasons.forEach((season) => {
        milestones.push({ date: new Date(season.start_date), label: seasonLabel(season.name, true), type: 'season', original: season });
        milestones.push({ date: new Date(season.end_date), label: seasonLabel(season.name, false), type: 'season', original: season });
    });

    return milestones.sort((a, b) => a.date - b.date);
}

export function buildEvents(campaigns, seasons) {
    const events = campaigns.map((campaign) => ({
        title: campaign.name,
        start: new Date(campaign.start_date),
        end: new Date(campaign.end_date),
        type: 'campaign',
        original: campaign,
    }));

    seasons.forEach((season) => {
        events.push({
            title: seasonLabel(season.name, true),
            start: new Date(season.start_date),
            end: new Date(season.start_date),
            type: 'season',
            original: season,
        });
        events.push({
            title: seasonLabel(season.name, false),
            start: new Date(season.end_date),
            end: new Date(season.end_date),
            type: 'season',
            original: season,
        });
    });

    return events;
}