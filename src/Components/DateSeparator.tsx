const DateSeparator = ({ date }: { date: string }) => (
  <div className="flex justify-center my-2">
    <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded-full">
      {date}
    </span>
  </div>
);

export default DateSeparator;
