import React from "react";
import { ChartNoAxesColumn } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap = {
  LOW: "text-[#0EA420]",
  MEDIUM: "text-purple-700",
  HIGH: "text-red-700",
};

type Props = {
  priority: "LOW" | "MEDIUM" | "HIGH";
  label?: string;
};

const PriorityBadge: React.FC<Props> = ({ priority, label }) => {
  return (
    <div className="flex gap-2 font-family-DM text-[#888888] text-sm">
      <p>{label}</p>
      <div
        className={cn("flex gap-1 items-center text-xs", colorMap[priority])}
      >
        <ChartNoAxesColumn />
        <span className="capitalize">{`${priority.toLowerCase()}`}</span>
      </div>
    </div>
  );
};

export default PriorityBadge;
