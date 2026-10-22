function PanelCard({ title, note, action, children }) {
    return (
        <section className="h-100 d-flex flex-column gap-3 panel-card">
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                <div className="d-flex flex-column">
                    <h2 className="m-0 panel-card-title">{title}</h2>
                    {note ? <span className="panel-muted">{note}</span> : null}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

export default PanelCard;