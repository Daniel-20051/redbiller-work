const EventItem = () => {
  return (
    <div className="flex justify-center items-center gap-12 mb-[20px] mt-1 ">
      <div className=" flex-col w-[13%] h-[65px] border-1 rounded-[10px] border-[#EEEEEE]  hidden lg:flex ">
        <div className=" flex ml-[10px] mt-[10px] ">
          <img
            className="w-[24px] h-[24px] "
            src="../src/assets/Calendar.svg"
            alt=""
          />
          <p className="font-[500] text-[14px] ml-[8px] text-[#959595] ">
            24 Jan
          </p>
        </div>
        <div className="flex ml-[10px] mb-[8px] ">
          <p className="font-[500] text-[14px]  text-[#959595] ">Sat</p>
          <p className="font-[500] text-[14px] ml-[8px] text-[#959595] ">
            11:30 am
          </p>
        </div>
      </div>
      <div className="w-[70%] h-[181px] lg:h-[141px] border-1 rounded-[10px] p-4 border-[#EEEEEE]">
        <div className="flex mb-[10px] ml-[14px] gap-5">
          <p className="text-primary  font-[700] text-[16px] ">
            Product Meeting
          </p>
          <p className="text-[#C9C9C9] font-[400] text-[14px]">15 mins ago</p>
        </div>
        <p className="font-[400] text-[14px]  text-[#4E4E4E] ">
          Lorem ipsum dolor sit amet consectetur ipsum dolor sit amet ipsum
          dolor sit amet consectetur ipsum dolor sit ame ipsum dolor sit amet
          consectetur.
        </p>
      </div>
    </div>
  );
};

export default EventItem;
