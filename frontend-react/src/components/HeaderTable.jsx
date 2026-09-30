function HeaderTable({ onCreate, onRefresh, type, reloadTable }) {
    const isCreateType = type === 'seasonTypes' || type === 'campaignTypes';
    const types = { campaigns: "campañas", seasons: "temporadas", seasonTypes: "temporada", campaignTypes: "campaña" };

    return (
        <div className="d-flex flex-wrap align-items-center gap-2">
            <button type="button" className="panel-btn" onClick={onRefresh}>
                <i className="bi bi-arrow-clockwise" aria-hidden="true" />
                Actualizar
            </button>
            {!isCreateType && (
                <button type="button" className="panel-btn" onClick={reloadTable}>
                    <i className="bi bi-arrow-repeat" aria-hidden="true" />
                    Sincronizar
                </button>
            )}
            <div className="flex-grow-1 d-none d-md-block" />
            <button type="button" className="panel-primary d-inline-flex align-items-center gap-2" onClick={onCreate}>
                <i className="bi bi-plus-circle" aria-hidden="true" />
                Crear {types[type]}
            </button>
        </div>
    );
}

export default HeaderTable;