import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { token } = useContext(AuthContext);

  const [scores, setScores] = useState([]);
  const [draw, setDraw] = useState(null);
  const [winnings, setWinnings] = useState([]);
  const [user, setUser] = useState(null);

  const [newScore, setNewScore] = useState("");
  const [loading, setLoading] = useState(false);

  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState("");

  const cardStyle =
    "bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-green-500/20 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden group flex flex-col h-full";

  const glowEffect =
    "absolute -bottom-32 -right-32 w-64 h-64 bg-green-500/10 rounded-full blur-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none";

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [s, d, w, u, c] = await Promise.all([
        API.get("/scores"),
        API.get("/draws/latest"),
        API.get("/winners/me"),
        API.get("/users/me"),
        API.get("/charities"),
      ]);

      setScores(s.data);
      setDraw(d.data);
      setWinnings(w.data);
      setUser(u.data);
      setCharities(c.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  const addScore = async () => {
    if (!newScore) return;

    if (newScore < 1 || newScore > 45) {
      alert("Score must be between 1 and 45");
      return;
    }

    try {
      setLoading(true);

      await API.post("/scores", {
        value: Number(newScore),
        date: new Date(),
      });

      setNewScore("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to add score");
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    try {
      await API.post("/users/subscribe");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Subscription failed");
    }
  };

  const selectCharity = async () => {
    if (!selectedCharity) {
      alert("Please select a charity");
      return;
    }

    try {
      await API.post("/charities/select", {
        charityId: selectedCharity,
        percentage: 10,
      });

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to select charity");
    }
  };

  const selected = charities.find((c) => c._id === user?.charity);

  return (
    <Layout>
      <div className="flex flex-col gap-8 md:gap-12 w-full pb-10">

        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 max-w-2xl"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Welcome back <span className="inline-block animate-bounce origin-bottom">👋</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
            Track your performance, support a cause, and win rewards.
          </p>
        </motion.div>

        {/* SUBSCRIPTION */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardStyle} !flex-row flex-wrap md:flex-nowrap justify-between items-center gap-6 md:gap-10`}
          >
            <div className={glowEffect} />
            <div className="z-10 flex-col gap-3 flex-1 min-w-[200px]">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Your Membership</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    user.subscriptionActive 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]" 
                      : "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                }`}>
                  {user.subscriptionActive ? "Active" : "Inactive"}
                </span>
              </div>

              {!user.subscriptionActive ? (
                <p className="text-slate-400 font-medium tracking-wide">
                  Unlock premium rewards & support your favorite charity 🎯
                </p>
              ) : (
                <p className="text-slate-400 font-medium tracking-wide">
                  You're contributing to real-world impact ❤️
                </p>
              )}
            </div>

            {!user.subscriptionActive && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={subscribe}
                className="z-10 w-full sm:w-auto shrink-0 relative overflow-hidden bg-white text-slate-900 font-bold px-8 py-3.5 rounded-2xl hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Subscribe Now</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {/* CHARITY */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cardStyle}
          >
            <div className={glowEffect} />
            <div className="z-10 relative flex flex-col h-full">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-5 text-white">Your Impact</h2>

              {user.charity ? (
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white/[0.03] p-5 rounded-2xl border border-white/5 shadow-inner">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
                    <span className="text-xl">🌍</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1 tracking-wide uppercase">Currently Supporting</p>
                    <p className="text-base sm:text-lg font-bold text-white truncate w-full">
                      {selected ? selected.name : "Loading..."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="relative flex-1">
                    <select
                      onChange={(e) => setSelectedCharity(e.target.value)}
                      className="w-full appearance-none bg-slate-900/50 text-white p-3.5 px-5 rounded-2xl border border-white/10 focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 focus:outline-none transition-all cursor-pointer truncate font-medium"
                    >
                      <option value="" className="bg-slate-900">Select a cause to support</option>
                      {charities.map((c) => (
                        <option key={c._id} value={c._id} className="bg-slate-900 truncate">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>                    
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={selectCharity}
                    className="w-full sm:w-auto shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 px-6 sm:px-8 py-3.5 rounded-2xl font-semibold transition-all text-white"
                  >
                    Confirm Choice
                  </motion.button>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-400 mt-6 flex items-start sm:items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1 sm:mt-0 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                Every entry contributes 10% to making the world a better place
              </p>
            </div>
          </motion.div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[minmax(0,1fr)] items-stretch">

          {/* SCORES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cardStyle}
          >
            <div className={glowEffect} />
            <div className="z-10 relative flex flex-col h-full w-full">
              <div className="flex justify-between items-center mb-6 gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">Your Scores</h2>
                <span className="text-xs sm:text-sm font-bold text-green-400 bg-green-400/10 border border-green-500/20 px-3 py-1 rounded-full shrink-0">
                  {scores.length}/5 Used
                </span>
              </div>

              <div className="w-full bg-slate-900/50 rounded-full h-2 mb-3 overflow-hidden border border-white/5 shadow-inner shrink-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(scores.length / 5) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                />
              </div>

              <p className="text-xs text-slate-400 mb-6 font-medium shrink-0">
                Adding a new score replaces your oldest entry.
              </p>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 mb-6 w-full shrink-0">
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Enter score"
                  className="w-full flex-1 p-3.5 px-5 rounded-2xl bg-slate-900/50 border border-white/10 focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 focus:outline-none transition-all placeholder:text-slate-600 text-white font-medium min-w-0"
                />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addScore}
                  disabled={!user?.subscriptionActive || loading}
                  className={`w-full sm:w-auto lg:w-full xl:w-auto shrink-0 px-8 py-3.5 font-bold rounded-2xl whitespace-nowrap transition-all ${
                    user?.subscriptionActive
                      ? "bg-green-500 hover:bg-green-400 text-slate-950 shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_30px_rgba(74,222,128,0.4)]"
                      : "bg-white/[0.03] text-slate-500 cursor-not-allowed border border-white/5"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin mx-auto" />
                  ) : "Add Score"}
                </motion.button>
              </div>

              {scores.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 bg-white/[0.02] border border-white/5 rounded-2xl border-dashed">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <span className="text-2xl opacity-60">⛳️</span>
                  </div>
                  <p className="text-white font-semibold tracking-wide">No scores yet</p>
                  <p className="text-sm text-slate-400 mt-2 max-w-[200px]">
                    Add your first score to start competing
                  </p>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col min-h-0 overflow-y-auto pr-1 pb-1 scrollbar-thin scrollbar-thumb-white/10">
                  {scores.map((s, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={s._id}
                      className={`flex items-center justify-between p-4 rounded-2xl border shrink-0 hover:bg-white/[0.03] transition-colors ${
                        i === 0 
                          ? "bg-gradient-to-r from-green-500/10 to-transparent border-green-500/20" 
                          : "bg-white/[0.02] border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-6 text-center text-sm font-black ${i === 0 ? "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" : "text-slate-500"}`}>
                          #{i + 1}
                        </span>
                        <span className="text-xl font-bold text-white">{s.value}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded-lg">
                        {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* DRAW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cardStyle}
          >
            <div className={glowEffect} />
            <div className="z-10 relative flex flex-col h-full w-full">
              <div className="flex items-center justify-between mb-8 gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">Latest Draw</h2>
                {draw && (
                  <span className="text-xs sm:text-sm font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full shrink-0">
                    {new Date(draw.date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>

              {draw?.numbers ? (
                <div className="flex gap-3 sm:gap-4 flex-wrap justify-center items-center py-4 mt-auto mb-auto">
                  {draw.numbers.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                        delay: 0.5 + (i * 0.1)
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl font-black text-xl sm:text-2xl text-white shadow-[0_10px_20px_rgba(74,222,128,0.3)] border border-green-300/30"
                    >
                      {n}
                    </motion.div>
                  ))}
                </div>
              ) : (
                 <div className="text-center py-10 mt-auto mb-auto bg-white/[0.02] border border-white/5 rounded-2xl border-dashed flex-col items-center justify-center flex">
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <span className="text-2xl opacity-60">🎲</span>
                  </div>
                  <p className="text-white font-semibold">No draw results yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* WINNINGS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cardStyle}
          >
            <div className={glowEffect} />
            <div className="z-10 relative flex flex-col h-full w-full">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-8 text-white">Your Winnings</h2>

              {winnings.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 mt-auto mb-auto bg-white/[0.02] border border-white/5 rounded-2xl border-dashed">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <span className="text-2xl opacity-60">🏆</span>
                  </div>
                  <p className="text-white font-semibold tracking-wide">No winnings yet</p>
                  <p className="text-sm text-slate-400 mt-2 max-w-[200px]">
                    Keep playing to win rewards!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 flex-1 overflow-y-auto pr-1 pb-1 scrollbar-thin scrollbar-thumb-white/10">
                  {winnings.map((w, i) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                      key={w._id} 
                      className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 group hover:bg-white/[0.05] hover:border-green-500/20 transition-all shrink-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest shrink-0">Matched</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.5)] shrink-0"></span>
                          <span className="font-black text-xl text-white truncate">{w.matchCount} <span className="text-sm font-semibold text-slate-500 ml-1">Num</span></span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Prize</p>
                        <p className="text-green-400 font-black text-3xl sm:text-4xl tracking-tighter drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                          ₹{w.prize}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}