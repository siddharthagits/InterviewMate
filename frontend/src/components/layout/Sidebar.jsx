import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h2 className="text-2xl font-bold text-blue-400 mb-10">
        InterviewMate
      </h2>

      <nav className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="hover:bg-slate-800 p-3 rounded-lg"
        >
          Dashboard
        </Link>

        <Link
          to="/setup"
          className="hover:bg-slate-800 p-3 rounded-lg"
        >
          Start Interview
        </Link>

        <Link
          to="/history"
          className="hover:bg-slate-800 p-3 rounded-lg"
        >
          History
        </Link>

        <Link
          to="/reports"
          className="hover:bg-slate-800 p-3 rounded-lg"
        >
          Reports
        </Link>

        <Link
          to="/profile"
          className="hover:bg-slate-800 p-3 rounded-lg"
        >
          Profile
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;