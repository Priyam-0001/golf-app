import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

export default function Layout({ children }) {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 overflow-x-hidden font-sans selection:bg-green-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-50 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 md:px-8 py-4 backdrop-blur-2xl bg-white/[0.02] border-b border-white/5 shrink-0">

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white hover:opacity-80 transition-opacity">
          Golf<span className="text-green-500">Charity</span>
          <span className="text-green-500/50">.</span>
        </h1>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 ml-auto">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm sm:text-base font-semibold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `text-sm sm:text-base font-semibold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`
            }
          >
            Admin
          </NavLink>

          <button
            onClick={logout}
            className="group relative px-4 py-2 rounded-xl text-sm sm:text-base font-semibold text-white overflow-hidden ml-2 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-red-500/80 group-hover:bg-red-500 transition-colors" />
            <span className="relative z-10 whitespace-nowrap">Logout</span>
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="relative z-10 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
}