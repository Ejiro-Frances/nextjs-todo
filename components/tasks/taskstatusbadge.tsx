import React from "react";
import { Loader, BadgeCheck } from "lucide-react";

import type { Status } from "@/types/types";

type Props = {
  status: Status;
  label?: string;
};

const TaskStatusBadge: React.FC<Props> = ({ status, label }) => {
  return (
    <div className="flex gap-1 items-center">
      <p className="font-family-DM text-[#888888] text-sm mr-1.5">{label}</p>
      <div>
        {status === "DONE" ? (
          <BadgeCheck className="fill-[#0EA420]" />
        ) : (
          <Loader className="fill-[#F42D2D]" />
        )}
      </div>
      <span
        className={`capitalize text-sm ${
          status === "DONE" ? "text-[#0EA420]" : "text-[#F42D2D]"
        } `}
      >
        {status.toLowerCase().replace("_", " ")}
      </span>
    </div>
  );
};

export default TaskStatusBadge;
