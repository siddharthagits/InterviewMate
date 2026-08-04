import { useState } from "react";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;