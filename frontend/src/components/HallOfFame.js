// src/components/HallOfFame.js
import React, { useEffect, useState } from "react";
import { ChevronRight, Star } from "lucide-react";
import { API } from "../api"; // make sure src/api.js exports { API } axios instance

// --- FIXED Hall of Fame component ---
function HallOfFame() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        setLoading(true);
        const r = await API.get("/hall-of-fame");
        // backend shape is: { success, total, limit, offset, data: [...] }
        const rows = Array.isArray(r.data?.data) ? r.data.data : [];
        if (!stop) setMembers(rows);
      } catch (e) {
        console.error("HOF load error:", e);
        if (!stop) setErr("Failed to load Hall of Fame.");
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  const recent = members.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-8">Hall of Fame</h1>
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <Star size={56} className="mx-auto text-yellow-500 mb-3" />
          <div className="text-gray-600">{members.length} Members Inducted</div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Recent Inductees</h3>
            <ul className="space-y-2">
              {recent.length ? (
                recent.map((m) => (
                  <li
                    key={`${m.inductee_name}-${m.induction_year}-${
                      m.category || ""
                    }`}
                    className="flex items-center"
                  >
                    <ChevronRight size={18} className="text-blue-600 mr-2" />
                    <span>
                      {m.inductee_name} ({m.induction_year}
                      {m.category ? ` — ${m.category}` : ""})
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No inductees found.</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-100 rounded p-3">
                Players: {members.filter((m) => m.category === "Player").length}{" "}
                members
              </div>
              <div className="bg-gray-100 rounded p-3">
                Coaches: {members.filter((m) => m.category === "Coach").length}{" "}
                members
              </div>
              <div className="bg-gray-100 rounded p-3">
                Contributors:{" "}
                {members.filter((m) => m.category === "Contributor").length}{" "}
                members
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HallOfFame;
