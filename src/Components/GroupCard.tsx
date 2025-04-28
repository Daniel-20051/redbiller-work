const GroupCard = () => {
  return (
    <div className=" w-[240px] h-[216px] rounded-[20px]   relative flex flex-col bg-white  shadow-xl">
      <img
        className="w-[20px] h-[20px] absolute right-[15px] top-[15px] "
        src="/assets/redbiller.png"
        alt=""
      />

      <p className="font-[700] pt-[30px] pl-[13px] text-[17px] ">Group Chat</p>

      <div className="ml-[20px] mt-[15px] ">
        <div className="flex  ">
          <img
            className="w-[45px] h-[45px] rounded-4xl border-2 border-primary mb-[14px] z-50 "
            src="/assets/blank-profile.png"
            alt=""
          />
          <img
            className="w-[45px] h-[45px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-40 "
            src="/assets/blank-profile.png"
            alt=""
          />
          <img
            className="w-[45px] h-[45px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-30 "
            src="/assets/blank-profile.png"
            alt=""
          />
          <img
            className="w-[45px] h-[45px] rounded-4xl border-2 border-primary mb-[14px] -ml-[22px] z-20 "
            src="/assets/blank-profile.png"
          />
        </div>

        <p className="text-[12px] font-[500] ">Redbiller Engineering Team</p>
      </div>
      <button className="absolute w-full h-[39px] rounded-b-[20px] bottom-0 text-white bg-primary text-[22px] font-[500] ">
        {" "}
        Open
      </button>
    </div>
  );
};

export default GroupCard;
