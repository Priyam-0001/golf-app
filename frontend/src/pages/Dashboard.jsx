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
    "bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl hover:border-green-500/30 transition-all duration-300 relative overflow-hidden group";

  const glowEffect = "absolute -bottom-24 -right-24 w-48 h-48 bg-green-500/20 rounded-full blur-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none";

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
      <div className="space-y-12 max-w-7xl mx-auto py-8">

        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Welcome back <span className="inline-block animate-bounce origin-bottom">👋</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            Track your performance, support a cause, and win rewards.
          </p>
        </motion.div>

        {/* SUBSCRIPTION */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardStyle} flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}
          >
            <div className={glowEffect} />
            <div className="z-10">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">Your Membership</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.subscriptionActive 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {user.subscriptionActive ? "Active" : "Inactive"}
                </span>
              </div>

              {!user.subscriptionActive && (
                <p className="text-gray-400 mt-2 font-medium">
                  Unlock premium rewards & support your favorite charity 🎯
                </p>
              )}

              {user.subscriptionActive && (
                <p className="text-gray-400 mt-2 font-medium">
                  You're contributing to real-world impact ❤️
                </p>
              )}
            </div>

            {!user.subscriptionActive && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={subscribe}
                className="z-10 w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
              >
                Subscribe Now
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
            <div className="z-10 relative">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Your Impact</h2>

              {user.charity ? (
                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-xl">🌍</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Currently Supporting</p>
                    <p className="text-lg font-bold text-white">
                      {selected ? selected.name : "Loading..."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <select
                      onChange={(e) => setSelectedCharity(e.target.value)}
                      className="w-full appearance-none bg-black/40 text-white p-3 px-4 rounded-xl border border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                    >
                      <option value="" className="bg-gray-900">Select a cause to support</option>
                      {charities.map((c) => (
                        <option key={c._id} value={c._id} className="bg-gray-900">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      ▼
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={selectCharity}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-3 rounded-xl font-medium transition-all"
                  >
                    Confirm Choice
                  </motion.button>
                </div>
              )}

              <p className="text-sm text-gray-400 mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Every entry contributes 10% to making the world a better place
              </p>
            </div>
          </motion.div>
        )}

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

          {/* SCORES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${cardStyle} lg:col-span-1`}
          >
            <div className={glowEffect} />
            <div className="z-10 relative h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold tracking-tight">Your Scores</h2>
                <span className="text-sm font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                  {scores.length}/5 Used
                </span>
              </div>

              <div className="w-full bg-black/40 rounded-full h-2.5 mb-2 overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(scores.length / 5) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full"
                />
              </div>

              <p className="text-xs text-gray-400 mb-6">
                Adding a new score replaces your oldest entry.
              </p>

              <div className="flex gap-2 mb-6">
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Enter score (1-45)"
                  className="w-full p-3 px-4 rounded-xl bg-black/40 border border-white/10 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all placeholder:text-gray-600"
                />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addScore}
                  disabled={!user?.subscriptionActive || loading}
                  className={`px-6 font-bold rounded-xl whitespace-nowrap transition-all ${
                    user?.subscriptionActive
                      ? "bg-green-500 hover:bg-green-400 text-white shadow-lg"
                      : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : "Add"}
                </motion.button>
              </div>

              {scores.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <span className="text-2xl opacity-50">⛳️</span>
                  </div>
                  <p className="text-gray-300 font-medium">No scores yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add your first score to start competing
                  </p>
                </div>
              ) : (
                <div className="space-y-2 flex-1 mt-auto">
                  {scores.map((s, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={s._id}
                      className={`flex items-center justify-between p-3 px-4 rounded-xl border ${
                        i === 0 
                          ? "bg-gradient-to-r from-green-500/20 to-transparent border-green-500/30" 
                          : "bg-black/20 border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center text-sm font-bold ${i === 0 ? "text-green-400" : "text-gray-500"}`}>
                          #{i + 1}
                        </span>
                        <span className="text-lg font-bold">{s.value}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
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
            className={`${cardStyle} lg:col-span-1`}
          >
            <div className={glowEffect} />
            <div className="z-10 relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight">Latest Draw</h2>
                {draw && (
                  <span className="text-xs font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                    {new Date(draw.date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>

              {draw?.numbers ? (
                <div className="flex gap-3 flex-wrap justify-center py-4 mt-auto mb-auto">
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
                      className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl font-bold text-xl md:text-2xl text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-white/20"
                    >
                      {n}
                    </motion.div>
                  ))}
                </div>
              ) : (
                 <div className="text-center py-8 mt-auto mb-auto">
                  <p className="text-gray-400">No draw results yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* WINNINGS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${cardStyle} lg:col-span-1`}
          >
            <div className={glowEffect} />
            <div className="z-10 relative flex flex-col h-full">
              <h2 className="text-xl font-bold tracking-tight mb-6">Your Winnings</h2>

              {winnings.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <span className="text-2xl opacity-50">🏆</span>
                  </div>
                  <p className="text-gray-300 font-medium">No winnings yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Keep playing to win rewards!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {winnings.map((w, i) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                      key={w._id} 
                      className="bg-gradient-to-r from-black/40 to-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-gray-400 font-medium">Matched Numbers</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="font-bold text-white">{w.matchCount}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Prize</p>
                        <p className="text-green-400 font-extrabold text-2xl tracking-tight">
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