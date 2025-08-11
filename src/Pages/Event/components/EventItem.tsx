import { Link } from "react-router-dom";

interface EventItemProps {
  title: string;
  description: string;
  date: string;
  time: string;
  weekday: string;
  createdAt: string;
}

// Set event as an object

// Then fetch the link

const EventItem = ({
  title,
  description,
  date,
  time,
  weekday,
  createdAt,
}: EventItemProps) => {
  return (
    <div className="flex   justify-center items-center gap-12 mb-[20px] mt-1 ">
      <div className=" flex-col w-[15%] h-auto border-1 rounded-[10px] border-[#EEEEEE]  hidden lg:flex ">
        <div className=" flex ml-[10px] mt-[10px] ">
          <img
            className="w-[24px] h-[24px] "
            src="/assets/Calendar.svg"
            alt=""
          />
          <p className="font-[500] text-[14px] ml-[8px] text-[#959595] ">
            {date}
          </p>
        </div>
        <div className="flex ml-[10px] mb-[8px] ">
          <p className="font-[500] text-[14px]  text-[#959595] ">{weekday}</p>
          <p className="font-[500] lowercase text-[14px] ml-[8px] text-[#959595] ">
            {time}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 max-w-[70vw] md:max-w-[60vw] w-[70%] h-auto  border-1 rounded-[10px] p-4 border-[#EEEEEE]">
        <div className="flex  gap-5">
          <Link to={`/events/${title}`}>
            <p className="text-primary cursor-pointer  font-[700] text-[16px] hover:underline ">
              {title}
            </p>
          </Link>
          <p className="text-[#C9C9C9] font-[400] text-[14px]">{createdAt}</p>
        </div>
        <p className="font-[400] text-[14px]  text-[#4E4E4E] line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EventItem;
