import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

export default function Layout({ children }) {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">

        <h1 className="text-2xl font-bold tracking-wide">
          Golf<span className="text-green-400">Charity</span>
        </h1>

        <div className="flex items-center gap-6">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-green-400 font-semibold"
                : "hover:text-green-400 transition"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "text-green-400 font-semibold"
                : "hover:text-green-400 transition"
            }
          >
            Admin
          </NavLink>

          <button
            onClick={logout}
            className="bg-red-500/80 px-4 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}