const HOME_PROVINCE = 'Valencia';
const INITIALS = 2;

export const clientInitials = (name) =>
    (name ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, INITIALS)
        .map((word) => Array.from(word)[0].toLocaleUpperCase('es'))
        .join('');

export const clientMeta = ({ city, province, postal_code: postalCode }) => {
    const showProvince = city && province && province !== HOME_PROVINCE && province !== city;
    const place = city ? (showProvince ? `${city} (${province})` : city) : province;
    return [place, postalCode].filter(Boolean).join(' · ');
};