interface Props {
  user: string;
  subject: string;
  children: string;
}

const WeeklyCard = ({ user, subject, children }: Props) => {
  return (
    <div className="flex flex-col bg-[#F2F2F2] py-4 gap-3 px-4 place-self-start w-[90%] h-[200px] rounded-[15px]">
      <div className="flex items-center gap-3">
        <img
          className="w-[42px] h-[42px] rounded-full border-primary border-2"
          src="/assets/blank-profile.png"
          alt=""
        />
        <p className="font-[600] text-[15px]">{user}</p>
      </div>
      <div className=" w-[85%]  border-1 border-[#C9C9C9] "></div>
      <p className="text-primary text-[16px] font-[700]  ">{subject}</p>
      <p className="text-[#4E4E4E] text-[14px] w-[89%] font-[400]  overflow-y-auto  hide-scrollbar scroll-smooth  ">
        {children}
      </p>
    </div>
  );
};

export default WeeklyCard;
