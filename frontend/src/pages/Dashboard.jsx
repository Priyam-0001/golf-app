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
    "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg";

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
      <div className="space-y-8">

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Dashboard
        </motion.h1>

        {/* SUBSCRIPTION */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${cardStyle} flex justify-between items-center`}
          >
            <div>
              <h2 className="text-xl font-semibold">Subscription</h2>

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
            </div>

            {!user.subscriptionActive && (
              <button
                onClick={subscribe}
                className="bg-green-500 px-5 py-2 rounded-xl hover:bg-green-600 transition shadow"
              >
                Subscribe
              </button>
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

                <button
                  onClick={selectCharity}
                  className="bg-green-500 px-4 rounded hover:bg-green-600"
                >
                  Select
                </button>
              </div>
            )}
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

            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                className="w-full p-2 rounded bg-black/40 border border-white/10"
                placeholder="Enter score"
              />

              <button
                onClick={addScore}
                disabled={!user?.subscriptionActive || loading}
                className={`px-4 rounded-xl ${
                  user?.subscriptionActive
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                {loading ? "..." : "Add"}
              </button>
            </div>

            {scores.length === 0 && (
              <p className="text-gray-400 text-sm">No scores yet</p>
            )}

            <div className="space-y-2">
              {scores.map((s) => (
                <div
                  key={s._id}
                  className="flex justify-between bg-black/40 p-2 rounded"
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
            transition={{ type: "spring", stiffness: 200 }}
            className={cardStyle}
          >
            <h2 className="text-xl font-semibold mb-4">Latest Draw</h2>

            <div className="flex gap-3 flex-wrap">
              {draw?.numbers?.map((n, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className="w-12 h-12 flex items-center justify-center bg-green-500 rounded-full font-bold shadow"
                >
                  {n}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* WINNINGS */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={cardStyle}
          >
            <h2 className="text-xl font-semibold mb-4">Your Winnings</h2>

            {winnings.length === 0 && (
              <p className="text-gray-400 text-sm">No winnings yet</p>
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