import { ComparativeStackedBarChart } from "../utils/StatisticsComponents";

function getMaxStackedValue(data, keys) {
  return Math.max(...data.map(item =>
    keys.reduce((sum, key) => sum + (item[key] || 0), 0)
  ));
}

function getRoundedMax(value) {
    if (value <= 6) {
        return value;
    } else if (value <= 10) {
        return value % 2 === 0 ? value + 2 : value + 1;
    } else if (value <= 30) {
        return Math.ceil(value / 5) * 5;
    } else if (value <= 100) {
        return Math.ceil(value / 10) * 10;
    } else if (value <= 300) {
        return Math.ceil(value / 20) * 20;
    } else {
        return Math.ceil(value / 50) * 50;
    }
}

function MainComparative({ allData, filters, classCols }) {
    const { data1, data2, showBy } = allData;

    const keys1 = Array.from(new Set(data1.flatMap(item => Object.keys(item)))).filter(k => k !== showBy);
    const keys2 = Array.from(new Set(data2.flatMap(item => Object.keys(item)))).filter(k => k !== showBy);
    const allKeys = Array.from(new Set([...keys1, ...keys2]));

    const max1 = getMaxStackedValue(data1, allKeys);
    const max2 = getMaxStackedValue(data2, allKeys);
    
    const rawMax = Math.max(max1, max2);
    const yAxisMax = getRoundedMax(rawMax);

    const date1 = `${normalizeDate(filters.start_date_1) || "Elegir fecha 1"} - ${normalizeDate(filters.end_date_1) || "Elegir fecha 2"}`;
    const date2 = `${normalizeDate(filters.start_date_2) || "Elegir fecha 1"} - ${normalizeDate(filters.end_date_2) || "Elegir fecha 2"}`;

    return (
        <div className="row mt-3">
            <div className={`${classCols}`}>
                <div className="d-flex text-center justify-content-center flex-column">
                    <h4>{date1}</h4>
                    <ComparativeStackedBarChart data={data1} showBy={showBy} maxY={yAxisMax} />
                </div>
            </div>
            <div className={`${classCols}`}>
                <div className="d-flex text-center justify-content-center flex-column">
                    <h4>{date2}</h4>
                    <ComparativeStackedBarChart data={data2} showBy={showBy} maxY={yAxisMax} />
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