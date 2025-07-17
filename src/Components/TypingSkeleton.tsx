import React from "react";

const TypingSkeleton: React.FC = () => (
  <div className="flex items-center gap-2 animate-pulse mb-2">
    <div className="w-8 h-8 rounded-full bg-gray-300" />
    <div className="h-4 w-24 bg-gray-300 rounded" />
  </div>
);

export default TypingSkeleton;
