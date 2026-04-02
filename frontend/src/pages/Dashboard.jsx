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
    "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-green-500/20 transition";

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
      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">Welcome back 👋</h1>
          <p className="text-gray-400">
            Track your performance, support a cause, and win rewards.
          </p>
        </div>

        {/* SUBSCRIPTION */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${cardStyle} flex justify-between items-center`}
          >
            <div>
              <h2 className="text-xl font-semibold">Your Membership</h2>

              <p
                className={`mt-2 ${
                  user.subscriptionActive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {user.subscriptionActive ? "Active" : "Inactive"}
              </p>

              {!user.subscriptionActive && (
                <p className="text-yellow-400 text-sm mt-2">
                  Unlock rewards & support charity 🎯
                </p>
              )}

              {user.subscriptionActive && (
                <p className="text-green-400 text-sm mt-2">
                  You’re contributing to real-world impact ❤️
                </p>
              )}
            </div>

            {!user.subscriptionActive && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={subscribe}
                className="bg-green-500 px-5 py-2 rounded-xl hover:bg-green-600 transition shadow"
              >
                Subscribe Now
              </motion.button>
            )}
          </motion.div>
        )}

        {/* CHARITY */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cardStyle}
          >
            <h2 className="text-xl font-semibold mb-3">Your Charity</h2>

            {user.charity ? (
              <p className="text-green-400">
                Supporting: {selected ? selected.name : "Loading..."}
              </p>
            ) : (
              <div className="flex gap-3">
                <select
                  onChange={(e) => setSelectedCharity(e.target.value)}
                  className="bg-black/40 p-2 rounded border border-white/10"
                >
                  <option value="">Select charity</option>
                  {charities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={selectCharity}
                  className="bg-green-500 px-4 rounded hover:bg-green-600"
                >
                  Select
                </motion.button>
              </div>
            )}

            <p className="text-sm text-gray-400 mt-2">
              Every entry contributes to a better world 🌍
            </p>
          </motion.div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* SCORES */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={cardStyle}
          >
            <h2 className="text-xl font-semibold mb-4">Your Scores</h2>

            <p className="text-sm text-gray-400 mb-1">
              {scores.length}/5 scores used
            </p>

            <div className="w-full bg-gray-800 rounded h-2 mb-3">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${(scores.length / 5) * 100}%` }}
              />
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Adding a new score will replace your oldest score
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                className="w-full p-2 rounded bg-black/40 border border-white/10"
              />

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addScore}
                disabled={!user?.subscriptionActive || loading}
                className={`px-4 rounded-xl ${
                  user?.subscriptionActive
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                {loading ? "..." : "Add"}
              </motion.button>
            </div>

            {scores.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-400">No scores yet</p>
                <p className="text-sm text-gray-500">
                  Add your first score to start competing
                </p>
              </div>
            )}

            <div className="space-y-2">
              {scores.map((s, i) => (
                <div
                  key={s._id}
                  className={`flex justify-between p-2 rounded ${
                    i === 0 ? "bg-green-500/20" : "bg-black/40"
                  }`}
                >
                  <span>{s.value}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(s.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DRAW */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cardStyle}
          >
            <h2 className="text-xl font-semibold mb-4">Latest Draw</h2>

            <div className="flex gap-3 flex-wrap">
              {draw?.numbers?.map((n, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className="w-12 h-12 flex items-center justify-center bg-green-500 rounded-full font-bold"
                >
                  {n}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* WINNINGS */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cardStyle}
          >
            <h2 className="text-xl font-semibold mb-4">Your Winnings</h2>

            {winnings.length === 0 && (
              <p className="text-gray-400">No winnings yet</p>
            )}

            <div className="space-y-3">
              {winnings.map((w) => (
                <div key={w._id} className="bg-black/40 p-3 rounded">
                  <p>Match: {w.matchCount}</p>
                  <p className="text-green-400 font-bold text-lg">
                    ₹{w.prize}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}