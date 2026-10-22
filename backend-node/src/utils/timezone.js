const madridUtcOffset = (now = new Date()) => {
  const part = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', timeZoneName: 'shortOffset' }).formatToParts(now).find((item) => item.type === 'timeZoneName');
  const hours = Number(part.value.replace('GMT', '') || 0);
  return `${hours < 0 ? '-' : '+'}${String(Math.abs(hours)).padStart(2, '0')}:00`;
};

module.exports = { madridUtcOffset };