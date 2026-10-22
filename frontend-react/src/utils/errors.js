export const DEMO_MESSAGE = 'El modo demo es de solo lectura: puedes mirarlo todo, pero no guardar cambios.';

export const writeError = (error, fallback) => (error?.response?.status === 403 ? DEMO_MESSAGE : fallback);