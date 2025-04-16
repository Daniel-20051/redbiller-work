import React from "react";

const SmallSpiner: React.FC = () => {
  return (
    <div className="flex justify-center item-center h-[10%]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
    </div>
  );
};

export default SmallSpiner;
