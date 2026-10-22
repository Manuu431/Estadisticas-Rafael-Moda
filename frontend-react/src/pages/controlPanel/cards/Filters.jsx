import Segments from '../../../components/Segments.jsx';
import { PERIOD_SEGMENTS, SECTION_SEGMENTS } from './filterOptions.js';

export function SectionFilter({ section, setSection }) {
    return <Segments options={SECTION_SEGMENTS} value={section} onChange={setSection} label="Sección de la tienda" className="d-inline-flex panel-head-segs" />;
}

export function PeriodFilter({ period, setPeriod }) {
    return <Segments options={PERIOD_SEGMENTS} value={period} onChange={setPeriod} label="Periodo" className="d-inline-flex" />;
}