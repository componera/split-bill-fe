const StatsCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="bg-white shadow rounded-xl p-6 text-center">
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default StatsCard;
