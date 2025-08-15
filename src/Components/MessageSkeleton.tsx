import React from "react";

const MessageSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full gap-3 animate-pulse py-3">
      {/* Left message skeleton */}
      <div className="flex justify-start">
        <div className="max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-4 py-2 rounded-2xl bg-gray-200">
          <div className="bg-gray-300 h-4 w-32 rounded mb-1" />
          <div className="bg-gray-300 h-3 w-16 rounded" />
        </div>
      </div>

      {/* Right message skeleton */}
      <div className="flex justify-end">
        <div className="max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-4 py-2 rounded-2xl bg-gray-100">
          <div className="bg-gray-300 h-4 w-40 rounded mb-1" />
          <div className="bg-gray-300 h-3 w-16 rounded ml-auto" />
        </div>
      </div>

      {/* Another left message skeleton */}
      <div className="flex justify-start">
        <div className="max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-4 py-2 rounded-2xl bg-gray-200">
          <div className="bg-gray-300 h-4 w-28 rounded mb-1" />
          <div className="bg-gray-300 h-3 w-16 rounded" />
        </div>
      </div>

      {/* Right message skeleton */}
      <div className="flex justify-end">
        <div className="max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-4 py-2 rounded-2xl bg-gray-100">
          <div className="bg-gray-300 h-4 w-40 rounded mb-1" />
          <div className="bg-gray-300 h-3 w-16 rounded ml-auto" />
        </div>
      </div>

      {/* Another left message skeleton */}
      <div className="flex justify-start">
        <div className="max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-4 py-2 rounded-2xl bg-gray-200">
          <div className="bg-gray-300 h-4 w-28 rounded mb-1" />
          <div className="bg-gray-300 h-3 w-16 rounded" />
        </div>
      </div>
      {/* Right message skeleton */}
      <div className="flex justify-end">
        <div className="max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-4 py-2 rounded-2xl bg-gray-100">
          <div className="bg-gray-300 h-4 w-40 rounded mb-1" />
          <div className="bg-gray-300 h-3 w-16 rounded ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
