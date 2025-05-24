import { ComparativeStackedBarChart } from "./ComparativeStackedBarChart";

function MainComparative({ data1, data2, classCols }) {
    const { series1, showBy1, groupBy1 } = data1;
    const { series2, showBy2, groupBy2 } = data2;

    return (
        <div className="row mt-3">
            <div className={`${classCols}`}>
                <div className="d-flex text-center justify-content-center flex-column">
                    <h4>Fecha 1: {showBy1} - {groupBy1}</h4>
                    <ComparativeStackedBarChart data={series1} showBy={showBy1} groupBy={groupBy1} />
                </div>
            </div>
            <div className={`${classCols}`}>
                <div className="d-flex text-center justify-content-center flex-column">
                    <h4>Fecha 2: {showBy2} - {groupBy2}</h4>
                    <ComparativeStackedBarChart data={series2} showBy={showBy2} groupBy={groupBy2} />
                </div>
            </div>
        </div>
    );
}

export default MainComparative;