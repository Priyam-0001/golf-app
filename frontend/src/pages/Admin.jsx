import { useEffect, useState } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import { motion } from "framer-motion";

export default function Admin() {
  const [drawType, setDrawType] = useState("random");
  const [latestDraw, setLatestDraw] = useState(null);
  const [winners, setWinners] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);

  const cardStyle =
    "bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-green-500/20 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden flex flex-col";

  const statCardStyle =
    "bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-white/20 transition-colors";

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      const d = await API.get("/draws/latest");
      const w = await API.get("/winners");

      setLatestDraw(d.data);
      setWinners(w.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load admin data");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const runDraw = async () => {
    try {
      setLoading(true);

      await API.post("/draws/run", {
        type: drawType,
      });

      await fetchData();
      await fetchStats();
    } catch (err) {
      console.error(err);
      alert("Failed to run draw");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 md:gap-12 w-full pb-10">

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 max-w-2xl"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight break-words">
            Control Center <span className="inline-block hover:rotate-90 transition-transform duration-500 cursor-pointer">⚙️</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
            Monitor performance, manage draws, and track impact.
          </p>
        </motion.div>

        {!stats && (
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-6 rounded-2xl w-max">
            <div className="w-5 h-5 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Loading analytics...</p>
          </div>
        )}

        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              ["Total Users", stats.totalUsers, "👥"],
              ["Subscribers", stats.activeSubscribers, "⭐"],
              ["Winners", stats.totalWinners, "🏆"],
              ["Prize Pool", `₹${stats.totalPool}`, "💰"],
            ].map(([label, value, icon], i) => (
              <motion.div key={i} whileHover={{ scale: 1.02, y: -4 }} className={statCardStyle}>
                <div className="absolute -bottom-10 -right-10 text-8xl opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none">{icon}</div>
                <p className="text-xs sm:text-sm font-bold text-slate-400 tracking-widest uppercase mb-2 relative z-10">{label}</p>
                <h2 className="text-3xl sm:text-4xl font-black text-white relative z-10">{value}</h2>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 auto-rows-fr items-stretch">

          {/* RUN DRAW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }} 
            className={cardStyle}
          >
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-500/10 rounded-full blur-[4rem] pointer-events-none" />
            <div className="z-10 relative flex flex-col h-full w-full">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6">Execute Draw</h2>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 mt-auto mb-auto w-full">
                <div className="relative flex-1">
                  <select
                    value={drawType}
                    onChange={(e) => setDrawType(e.target.value)}
                    className="w-full appearance-none bg-slate-900/50 text-white p-3.5 px-5 rounded-2xl border border-white/10 focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 focus:outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value="random" className="bg-slate-900">Random Selection</option>
                    <option value="frequency" className="bg-slate-900">Frequency Based</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={runDraw}
                  disabled={loading}
                  className="w-full sm:w-auto shrink-0 bg-green-500 px-8 py-3.5 rounded-2xl font-black text-slate-950 hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_30px_rgba(74,222,128,0.4)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                       <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                       <span>Running...</span>
                    </div>
                  ) : "Run Draw"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* LATEST DRAW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cardStyle}
          >
             <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[4rem] pointer-events-none" />
             <div className="z-10 relative flex flex-col h-full w-full">
               <div className="flex items-center justify-between mb-6 gap-2">
                 <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">Latest Result</h2>
                 {latestDraw && (
                  <span className="text-xs sm:text-sm font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full shrink-0">
                    {new Date(latestDraw.date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                 )}
               </div>

                {latestDraw?.numbers ? (
                  <div className="flex gap-3 sm:gap-4 flex-wrap justify-center items-center py-4 mt-auto mb-auto">
                    {latestDraw.numbers.map((n, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", stiffness: 300, damping: 20, delay: 0.1 * i 
                        }}
                        className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl font-black text-xl sm:text-2xl text-white shadow-[0_10px_20px_rgba(74,222,128,0.3)] border border-green-300/30 font-mono"
                      >
                        {n}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 mt-auto mb-auto bg-white/[0.02] border border-white/5 rounded-2xl border-dashed">
                    <p className="text-slate-400 font-medium">No draw results yet</p>
                  </div>
                )}
             </div>
          </motion.div>
        </div>

        {/* WINNERS HISTORY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${cardStyle} lg:col-span-2`}
        >
          <div className="absolute -bottom-64 -right-64 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[6rem] pointer-events-none" />
          <div className="z-10 relative flex flex-col h-full w-full">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-8">Recent Winners</h2>

            {winners.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl border-dashed">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <span className="text-3xl opacity-60">👥</span>
                  </div>
                  <p className="text-white font-semibold text-lg">No winners yet</p>
                  <p className="text-slate-400 font-medium mt-1">Run a draw to see winners appear here.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {winners.map((w, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    key={w._id} 
                    className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 flex flex-col gap-4 group hover:border-green-500/30 transition-all hover:bg-white/[0.05] hover:shadow-[0_4px_20px_rgba(74,222,128,0.05)]"
                  >
                    <div className="flex justify-between items-start gap-4">
                       <div className="min-w-0 flex-1">
                         <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                            Player
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[9px] truncate ml-2">ID: {w._id.slice(-6)}</span>
                         </p>
                         <p className="text-sm sm:text-base font-bold text-white truncate max-w-full tracking-wide" title={w.user?.email}>{w.user?.email || 'Unknown'}</p>
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-white/5 mt-auto">
                       <div className="shrink-0 flex flex-col gap-1">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Matches</p>
                         <div className="flex items-center gap-1">
                           <span className="text-sm font-black text-white">{w.matchCount}</span>
                           <span className="text-slate-500 text-xs font-medium">/ 5</span>
                         </div>
                       </div>
                       <div className="text-right flex flex-col gap-1 items-end">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payout</p>
                         <span className="text-xl sm:text-2xl font-black text-green-400 tracking-tighter drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">₹{w.prize}</span>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}