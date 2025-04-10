const WeekItem = () => {
  return (
    <div className="w-full h-[269px] flex flex-col border-1 rounded-[15px] border-[#BCB9B9] mb-[28px] ">
      <div className="bg-[#F6F3F3] w-full h-[14%] rounded-t-[15px]  flex items-center text-[#2E2928]">
        <p className="font-[600] text-[20px] ml-6 ">Week 1</p>
        <p className="font-[600] text-[20px] ml-6 ">7th - 12th</p>
      </div>
      <div className="flex items-center  h-[33.3%] ">
        <div className="bg-primary w-[21px] ml-[15px] h-[21px] rounded-xl "></div>
        <p className="font-[700] ml-[47.22px] text-[15px] ">Action Item</p>
        <div className="h-[50%] ml-[188px] mr-[78px] border-[#E9E9E9] border-1 "></div>
        <p className="font-[400] text-[14px] ">
          Enable branch protection rules.
        </p>
      </div>
      <div className="flex items-center  h-[33.3%] ">
        <div className="bg-[#B0AB51] w-[21px] ml-[15px] h-[21px] rounded-xl "></div>
        <p className="font-[700] ml-[47.22px] text-[15px] ">Ongoing</p>
        <div className="h-[50%] ml-[209px] mr-[78px] border-[#E9E9E9] border-1 "></div>
        <p className="font-[400] text-[14px] ">Perform cost optisim.</p>
      </div>
      <div className="flex items-center  h-[33.3%] rounded-b-[15px]">
        <div className="bg-[#931D4E] w-[21px] ml-[15px] h-[21px] rounded-xl "></div>
        <p className="font-[700] ml-[47.22px] text-[15px] ">Completed</p>
        <div className="h-[50%] ml-[194px] mr-[78px] border-[#E9E9E9] border-1 "></div>
        <p className="font-[400] text-[14px] ">Scale down Waverlite</p>
      </div>
    </div>
  );
};

export default WeekItem;
