import { ReactNode } from "react";

const StatsGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>
);

export default StatsGrid;
