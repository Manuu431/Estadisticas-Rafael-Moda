import { ComparativeStackedBarChart } from "../utils/StatisticsComponents";

function MainComparative({ allData, filters, classCols }) {
    const { data1, data2, showBy, groupBy } = allData;

    const date1 = `${normalizeDate(filters.start_date_1) || "Elegir fecha 1"} - ${normalizeDate(filters.end_date_1) || "Elegir fecha 2"}`;
    const date2 = `${normalizeDate(filters.start_date_2) || "Elegir fecha 1"} - ${normalizeDate(filters.end_date_2) || "Elegir fecha 2"}`;

    return (
        <div className="row mt-3">
            <div className={`${classCols}`}>
                <div className="d-flex text-center justify-content-center flex-column">
                    <h4>{date1}</h4>
                    <ComparativeStackedBarChart data={data1} showBy={showBy} categories={groupBy} />
                </div>
            </div>
            <div className={`${classCols}`}>
                <div className="d-flex text-center justify-content-center flex-column">
                    <h4>{date2}</h4>
                    <ComparativeStackedBarChart data={data2} showBy={showBy} categories={groupBy} />
                </div>
            </div>
        </div>
    );
}

function normalizeDate(date) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d)) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export default MainComparative;