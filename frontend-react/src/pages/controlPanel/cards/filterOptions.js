import { SECTION_LABELS } from '../../../config/labels.js';

export const SECTION_SEGMENTS = [{ value: '', label: 'Todo' }, ...Object.entries(SECTION_LABELS).map(([value, label]) => ({ value, label }))];
export const PERIOD_SEGMENTS = [{ value: 'hoy', label: 'Hoy' }, { value: '7d', label: '7 días' }, { value: 'mes', label: 'Mes' }, { value: 'ano', label: 'Año' }];
export const SECTION_VALUES = Object.keys(SECTION_LABELS);
export const PERIOD_VALUES = PERIOD_SEGMENTS.map((segment) => segment.value);