import { useEffect, useState } from "react";
import Title from "../components/Title";
import ComparativeFilters from "../components/ComparativeFilters";
import MainComparative from "../components/MainComparative";

function Comparative({ title, classCols }) {
  const [filters, setFilters] = useState({});
  const [comparativeData, setComparativeData] = useState(null);

  const handleFilter = async (filters) => {
    const res = await fetch("/api/comparative", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters), // puede estar vacío
    });

    const data = await res.json();
    setComparativeData(data);
  };

  const handleClear = () => {
    setFilters({});
    setComparativeData(null);
    handleFilter({}); // vuelve a cargar todo al limpiar
  };

  // 🔥 Carga inicial automática
  useEffect(() => {
    handleFilter({});
  }, []);

  return (
    <>
      <Title title={title} />
      <ComparativeFilters
        type={"comparative"}
        filters={filters}
        setFilters={setFilters}
        onFilter={handleFilter}
        onClear={handleClear}
        classCols={classCols}
      />
      {comparativeData && <MainComparative data={comparativeData} />}
    </>
  );
}

export default Comparative;