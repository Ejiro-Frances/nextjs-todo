import React from "react";
import { Spinner } from "../ui/spinner";

const LoadingIndicator: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.3)]">
      <Spinner
        className="animate-[spin_1.5s_linear_infinite] text-blue-700"
        size="xxl"
      />
    </div>
  );
};

export default LoadingIndicator;
