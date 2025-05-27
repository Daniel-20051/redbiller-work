import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPages = (current: number, total: number) => {
  const pages = [];

  if (current === total) {
    pages.push(current - 2, current - 1, current);
  } else if (current > 1 && total > 2) {
    pages.push(current - 1, current, current + 1);
  } else if (current === 1) {
    pages.push(current, current + 1, current + 2);
  }
  console.log(total);
  console.log(current);

  return pages;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = getPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 py-4 select-none">
      {/* Previous Arrow */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous"
      >
        &lt;
      </button>
      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page as number}
          className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 ${
            currentPage === page
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => onPageChange(page as number)}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      {/* Next Arrow */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
