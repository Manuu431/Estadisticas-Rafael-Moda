export const readUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
};

export const isDemoUser = (user) => user?.id === 0;

export const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};