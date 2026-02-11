// frontend/src/components/championships/ChampionshipCard.js
import React from "react";
import { Link } from "react-router-dom";

export default function ChampionshipCard({ item }) {
  const year = item.year;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Championship
          </div>
          <div className="text-2xl font-bold text-gray-900">{year}</div>

          {item.championship_score ? (
            <div className="text-sm text-gray-600 mt-1">
              Final score: {item.championship_score}
            </div>
          ) : null}
        </div>

        {/* Quick link to finals page */}
        <Link
          to={`/championships/${year}/final`}
          className="text-base font-bold text-gray-900 hover:underline"
        >
          {item.champion_name}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Champion */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Champion
          </div>

          {item.champion_name ? (
            <Link
              to={`/championships/${year}/final`}
              className="text-base font-bold text-gray-900 hover:underline"
            >
              {item.champion_name}
            </Link>
          ) : (
            <div className="text-gray-400">—</div>
          )}
        </div>

        {/* Runner-up */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Runner-up
          </div>

          {item.runner_up_name ? (
            <Link
              to={`/championships/${year}/final?team=runner_up`}
              className="text-base font-semibold text-gray-700 hover:underline"
            >
              {item.runner_up_name}
            </Link>
          ) : (
            <div className="text-gray-400">—</div>
          )}
        </div>

        {/* MVP */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            MVP
          </div>

          {item.mvp ? (
            <Link
              to={`/championships/${year}/mvp`}
              className="text-base font-semibold text-gray-700 hover:underline"
            >
              {item.mvp}
            </Link>
          ) : (
            <span className="text-gray-400 italic text-sm">Not awarded</span>
          )}
        </div>
      </div>
    </div>
  );
}
