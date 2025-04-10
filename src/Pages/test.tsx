// UserDropdown.tsx
import React, { useState, useRef, useEffect } from "react";

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button className="flex items-center space-x-2">
        <img
          src="https://via.placeholder.com/30" // Replace with user image
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-semibold">Brown Dan</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => setIsOpen(!isOpen)}
        >
          <path d="M5.25 7.75L10 12.5l4.75-4.75" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl z-50 p-4">
          <div className="flex items-center space-x-4 pb-4 border-b">
            <img
              src="https://via.placeholder.com/50"
              alt="User"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-800">Your name</div>
              <div className="text-sm text-gray-400">yourname@gmail.com</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 6h8v8H6z" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
