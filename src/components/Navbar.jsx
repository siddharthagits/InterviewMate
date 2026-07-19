import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-slate-950 text-white shadow-lg">
      <h1 className="text-2xl font-bold text-blue-400">
        InterviewMate
      </h1>

      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-400">
          Home
        </Link>

        <Link to="/login" className="hover:text-blue-400">
          Login
        </Link>

        <Link
          to="/register"
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;