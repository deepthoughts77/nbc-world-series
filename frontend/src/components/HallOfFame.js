import React, { useEffect, useState } from "react";
import { ChevronRight, Star } from "lucide-react";
import { API } from "../api";

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

  if (loading)
    return (
      <div className="p-12 text-center text-gray-500 animate-pulse">
        Loading Hall of Fame...
      </div>
    );
  if (err)
    return (
      <div className="p-12 text-center text-red-600 font-semibold">{err}</div>
    );

  const recent = members.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-sans">
      <h1 className="text-4xl font-black mb-8 text-gray-900 border-b-4 border-yellow-500 inline-block">
        Hall of Fame
      </h1>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-12">
          <Star
            size={64}
            className="mx-auto text-yellow-500 mb-4"
            fill="currentColor"
          />
          <div className="text-3xl font-bold text-gray-800">
            {members.length} Members Inducted
          </div>
          <p className="text-gray-500 mt-2">
            Celebrating the legends of the NBC World Series
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Column 1: Recent Inductees */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3 rounded-full"></span>
              Recent Inductees
            </h3>
            <ul className="space-y-4">
              {recent.length ? (
                recent.map((m, idx) => (
                  <li
                    key={`${m.inductee_name}-${idx}`}
                    className="flex items-center p-3 bg-white rounded shadow-sm border-l-4 border-blue-600"
                  >
                    <ChevronRight size={18} className="text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-700">
                      {m.inductee_name}{" "}
                      <span className="text-gray-400 font-normal">
                        ({m.induction_year})
                      </span>
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No inductees found.</li>
              )}
            </ul>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="w-2 h-6 bg-green-600 mr-3 rounded-full"></span>
              Induction Categories
            </h3>
            <div className="space-y-3">
              {[
                { label: "Players", cat: "Player", color: "text-blue-600" },
                { label: "Coaches", cat: "Coach", color: "text-green-600" },
                {
                  label: "Contributors",
                  cat: "Contributor",
                  color: "text-purple-600",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <span className="font-bold text-gray-700">{item.label}</span>
                  <span className={`text-2xl font-black ${item.color}`}>
                    {members.filter((m) => m.category === item.cat).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HallOfFame;
