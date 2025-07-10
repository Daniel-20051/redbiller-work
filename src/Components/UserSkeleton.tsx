import React from "react";

const UserSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-4 p-2 w-full animate-pulse">
      <div className="bg-gray-300 rounded-full w-10 h-10" />
      <div className="flex flex-col flex-1 gap-2">
        <div className="bg-gray-300 h-4 w-1/2 rounded" />
        <div className="bg-gray-200 h-3 w-1/3 rounded" />
      </div>
    </div>
  );
};

export default UserSkeleton;
