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

  const card =
    "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow hover:shadow-green-500/20 transition";

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
      <div className="space-y-10">

        <div>
          <h1 className="text-4xl font-bold">Control Center ⚙️</h1>
          <p className="text-gray-400">
            Monitor performance, manage draws, and track impact.
          </p>
        </div>

        {!stats && (
          <p className="text-gray-500 animate-pulse">
            Loading analytics...
          </p>
        )}

        {stats && (
          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["Users", stats.totalUsers],
              ["Subscribers", stats.activeSubscribers],
              ["Winners", stats.totalWinners],
              ["Pool", `₹${stats.totalPool}`],
            ].map(([label, value], i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className={card}>
                <p className="text-gray-400">{label}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
              </motion.div>
            ))}
          </div>
        )}

        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">Run Draw</h2>

          <div className="flex gap-4 mb-4">
            <select
              value={drawType}
              onChange={(e) => setDrawType(e.target.value)}
              className="bg-black/40 p-2 rounded border border-white/10"
            >
              <option value="random">Random</option>
              <option value="frequency">Frequency</option>
            </select>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={runDraw}
              disabled={loading}
              className="bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600 transition"
            >
              {loading ? "Running..." : "Run Draw"}
            </motion.button>
          </div>
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">Latest Draw</h2>

          {latestDraw ? (
            <div className="flex gap-3 flex-wrap">
              {latestDraw.numbers.map((n, i) => (
                <div
                  key={i}
                  className="w-12 h-12 flex items-center justify-center bg-green-500 rounded-full font-bold"
                >
                  {n}
                </div>
              ))}
            </div>
          ) : (
            <p>No draw yet</p>
          )}
        </div>

        <div className={card}>
          <h2 className="text-lg font-semibold mb-4">Winners</h2>

          {winners.length === 0 && <p>No winners yet</p>}

          <div className="space-y-3">
            {winners.map((w) => (
              <div key={w._id} className="bg-black/40 p-3 rounded">
                <p>User: {w.user?.email}</p>
                <p>Match: {w.matchCount}</p>
                <p className="text-green-400 font-bold">₹{w.prize}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}