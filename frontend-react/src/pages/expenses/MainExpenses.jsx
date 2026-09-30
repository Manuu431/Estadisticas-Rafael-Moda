import { ExpensesChart } from "../../components/StatisticsComponents"

function MainExpenses({ allData, filters }) {
    const date = `${normalizeDate(filters.start_date) || "Elegir fecha"} - ${normalizeDate(filters.end_date) || "Elegir fecha"}`;
    
    return (
        <div className="row mt-3">
            <div className={"col-12"}>
                <div className="d-flex text-center justify-content-center flex-column">
                    <h4>{date}</h4>
                    <ExpensesChart data={allData.data} />
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

export default MainExpenses;