import React from "react";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";

type Props = {
  activeFilter: "ALL" | "TODO" | "IN_PROGRESS" | "DONE";
  setActiveFilter: (status: Props["activeFilter"]) => void;
  counts: Record<Props["activeFilter"], number>;
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
};

const TaskFilterButtons: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  counts,
  handleSearchChange,
  searchQuery,
  handleClearSearch,
}) => {
  const filters: Props["activeFilter"][] = [
    "ALL",
    "TODO",
    "IN_PROGRESS",
    "DONE",
  ];

  return (
    <div className="max-w-[95%] md:max-w-full md:mb-10 mx-auto lg:bg-[#FBFBFB] dark:lg:bg-gray-600 rounded-2xl lg:rounded-[4rem] py-3 px-4 lg:px-5 flex flex-col lg:flex-row gap-5 lg:gap-10 items-center">
      <div className="flex-1 flex gap-2 justify-between overflow-auto [bg-[#FBFBFB] dark:lg:bg-gray-600 lg:bg-transparent px-5">
        {filters.map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`flex items-center px-4 py-2  font-medium transition-all duration-150 ${
              activeFilter === status ? "border-r-4 border-[#D9D9D9]" : ""
            }`}
          >
            <span
              className={`mr-1.5 md:mr-4 text-[0.625rem] lg:text-lg font-semibold capitalize ${
                activeFilter === status
                  ? "text-[#004299] dark:text-blue-200"
                  : "text-[#999999]"
              }`}
            >
              {status === "ALL" ? "ALL" : `${status.replace("_", " ")}`}
            </span>
            <span
              className={`block w-5 md:w-7 h-5 md:h-7 text-[0.625rem] md:text-sm align-middle py-1 text-white rounded-full ${
                activeFilter === status ? "bg-[#004299]" : "bg-[#D9D9D9]"
              }`}
            >
              {status === "ALL" ? `${counts.ALL}` : `${counts[status]}`}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-[90%] lg:max-w-[35rem] lg:ml-auto">
        <Input
          placeholder="Search tasks by title, description, or tags..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="py-5 px-10 shadow placeholder:text-[#333333] text-[#1a1a1a] dark:text-gray-100 dark:placeholder:text-gray-100 rounded-4xl"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear search"
          >
            <X size={24} />
          </button>
        )}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search />
        </div>
      </div>
    </div>
  );
};

export default TaskFilterButtons;
