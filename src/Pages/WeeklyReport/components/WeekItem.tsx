import React from "react";

interface WeekItemProps {
  weekNum: number;
  actionItem: React.ReactNode;
  ongoingTask: React.ReactNode;
  completedTask: React.ReactNode;
  startDate: string;
  endDate: string;
}

const WeekItem = ({
  weekNum,
  actionItem,
  ongoingTask,
  completedTask,
  startDate,
  endDate,
}: WeekItemProps) => {
  return (
    <div className="w-full  mx-auto flex flex-col border-1 rounded-[15px] border-[#BCB9B9] mb-[28px] bg-white ">
      {/* Header */}
      <div className="bg-[#F6F3F3] w-full rounded-t-[15px] flex flex-col md:flex-row items-start md:items-center px-4 py-3 gap-1 md:gap-6 text-[#2E2928]">
        <p className="font-[600] text-[16px] md:text-[20px]">
          Week <span>{weekNum}</span>
        </p>
        <p className="font-[600] text-[16px] md:text-[20px]">
          {startDate} - {endDate}
        </p>
      </div>
      {/* Content Rows */}
      <div className="flex flex-col divide-y divide-[#E9E9E9]">
        {/* Action Item */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center py-3 gap-2 sm:gap-0">
          <div className="flex items-center w-full sm:w-auto">
            <div className="bg-primary w-[15px] md:w-[21px] h-[15px] md:h-[21px] rounded-xl ml-4" />
            <p className="font-[700] ml-4 text-[13px] md:text-[15px] whitespace-nowrap">
              Action Item
            </p>
          </div>
          <div className="hidden sm:block h-6 border-l border-[#E9E9E9] mx-4" />
          <div className="font-[400] w-full sm:max-w-[60%] text-[14px] px-4 sm:px-0 break-words">
            {actionItem}
          </div>
        </div>
        {/* Ongoing */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center py-3 gap-2 sm:gap-0">
          <div className="flex items-center w-full sm:w-auto">
            <div className="bg-[#B0AB51] w-[15px] md:w-[21px] h-[15px] md:h-[21px] rounded-xl ml-4" />
            <p className="font-[700] ml-4 text-[13px] md:text-[15px] whitespace-nowrap">
              Ongoing
            </p>
          </div>
          <div className="hidden sm:block h-6 border-l border-[#E9E9E9] mx-4" />
          <div className="font-[400] w-full sm:max-w-[60%] text-[14px] px-4 sm:px-0 break-words">
            {ongoingTask}
          </div>
        </div>
        {/* Completed */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center py-3 gap-2 sm:gap-0 rounded-b-[15px]">
          <div className="flex items-center w-full sm:w-auto">
            <div className="bg-[#931D4E] w-[15px] md:w-[21px] h-[15px] md:h-[21px] rounded-xl ml-4" />
            <p className="font-[700] ml-4 text-[13px] md:text-[15px] whitespace-nowrap">
              Completed
            </p>
          </div>
          <div className="hidden sm:block h-6 border-l border-[#E9E9E9] mx-4" />
          <div className="font-[400] w-full sm:max-w-[60%] text-[14px] px-4 sm:px-0 break-words">
            {completedTask}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekItem;
