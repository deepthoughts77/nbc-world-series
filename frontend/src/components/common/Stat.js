import React from "react";
import { Card, CardBody } from "./Card";

export function Stat({ icon: Icon, label, value, tone = "slate" }) {
  const toneMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    slate: "text-slate-600",
  };
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-3">
          <div className={`shrink-0 ${toneMap[tone]}`}>
            <Icon size={22} />
          </div>
          <div>
            <div className="text-3xl font-semibold leading-none">{value}</div>
            <div className="mt-1 text-sm text-gray-600">{label}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
