export const openItem = (navigate, item) => {
    localStorage.setItem('temporalItem', JSON.stringify(item.original));
    navigate(item.type === 'campaign' ? '/campañas' : '/temporadas');
};
