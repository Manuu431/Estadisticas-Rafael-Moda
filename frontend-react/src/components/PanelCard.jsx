function PanelCard({ title, note, action, children }) {
    return (
        <section className="panel-card h-100 d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                <div className="d-flex flex-column">
                    <h2 className="panel-card-title m-0">{title}</h2>
                    {note ? <span className="panel-muted">{note}</span> : null}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

export default PanelCard;