import { StackedBarChart } from "../components/StackedBarChart";

function MainComparative({ data }) {
  const { series, brands, groupKey } = data;

  return (
    <div>
      <h4>Comparativa de ventas</h4>
      <StackedBarChart data={series} brands={brands} groupKey={groupKey} />
    </div>
  );
}

export default MainComparative;