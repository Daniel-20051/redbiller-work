import React, { useRef, useState, useEffect } from "react";

type SwipeActionCardProps = {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
};

const SwipeActionCard: React.FC<SwipeActionCardProps> = ({
  children,
  onDelete,
  onEdit,
}) => {
  const touchStartX = useRef<number | null>(null);
  const [isSwiped, setIsSwiped] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchStartX.current - touchEndX > 50) {
      setIsSwiped(true);
    } else {
      setIsSwiped(false);
    }
  };
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      console.log("Running mobile-only logic");
      // You could trigger mobile-specific functions here
    }
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden rounded-md"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Action Buttons */}
      <div
        className={`absolute top-0 right-0 h-full flex transition-all duration-300 z-0 ${
          isSwiped ? "w-40" : "w-0"
        }`}
      >
        <button
          onClick={() => {
            onEdit?.();
            setIsSwiped(false);
          }}
          className="w-1/2 bg-yellow-400 text-white font-semibold text-sm hover:bg-yellow-500 transition-all"
        >
          Edit
        </button>
        <button
          onClick={() => {
            onDelete?.();
            setIsSwiped(false);
          }}
          className="w-1/2 bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all"
        >
          Delete
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10  p-4 shadow-md transition-transform duration-300 ease-in-out ${
          isSwiped ? "-translate-x-40" : "translate-x-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeActionCard;
