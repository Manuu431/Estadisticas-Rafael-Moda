export const SECTION_LABELS = { mujer: "Mujer", hombre: "Hombre" };
const VALUE_LABELS = { section: SECTION_LABELS };
export const getValueLabel = (field, value) => VALUE_LABELS[field]?.[value] ?? value;