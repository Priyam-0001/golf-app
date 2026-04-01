import { useEffect, useState } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";

export default function Admin() {
  const [drawType, setDrawType] = useState("random");
  const [latestDraw, setLatestDraw] = useState(null);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
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

  const runDraw = async () => {
    try {
      setLoading(true);

      await API.post("/draws/run", {
        type: drawType,
      });

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to run draw");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        {/* DRAW CONTROL */}
        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Run Draw</h2>

          <div className="flex gap-4 mb-4">
            <select
              value={drawType}
              onChange={(e) => setDrawType(e.target.value)}
              className="bg-gray-800 p-2 rounded"
            >
              <option value="random">Random</option>
              <option value="frequency">Frequency</option>
            </select>

            <button
              onClick={runDraw}
              disabled={loading}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            >
              {loading ? "Running..." : "Run Draw"}
            </button>
          </div>
        </div>

        {/* LATEST DRAW */}
        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Latest Draw</h2>

          {latestDraw ? (
            <div className="flex gap-3">
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

        {/* WINNERS */}
        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Winners</h2>

          {winners.length === 0 && <p>No winners yet</p>}

          <div className="space-y-3">
            {winners.map((w) => (
              <div key={w._id} className="bg-gray-800 p-3 rounded">
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