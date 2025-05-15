// import { useEffect } from "react";
import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext.js";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  const date = new Date(`${year}-${month}-${day}`);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNumber = parseInt(day);

  const getOrdinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${dayName}, ${dayNumber}${getOrdinalSuffix(
    dayNumber
  )} ${monthName} ${year}`;
};

const formatRelativeTime = (timestamp: string) => {
  if (!timestamp) return "";

  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "min" : "mins"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};

const EventInfo = () => {
  const { eventDetails } = use(UserDetailsContext);
  console.log(eventDetails);
  return (
    <div className="flex flex-col h-screen ">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)] ">
        <SideBar>event</SideBar>

        <div className="w-[76%] flex flex-col  items-center overflow-y-auto max-h-full relative">
          <div>
            <Link to="/events">
              <div className="flex gap-4 absolute top-[55px] left-[40px] items-center ">
                <img
                  className="w[9.14px] h-[16.17px] "
                  src="/assets/back.svg"
                  alt=""
                />
                <p className="font-[800] text-[16px] ">Event</p>
              </div>
            </Link>
            <div className="mt-[85px] ">
              <p className="font-[700] text-[36px] text-center ">
                Event Details
              </p>

              <div className="flex mt-[81px] items-start ">
                <img
                  className="w-[18px] h-[19.5px] mr-[35px] "
                  src="/assets/Calendar.svg"
                  alt=""
                />
                <div className="flex flex-col -mt-[5px]  ">
                  <div className="flex gap-8 items-center">
                    <p className="font-[700] text-[#959595] text-[20px] ">
                      {eventDetails?.eventTitle}
                    </p>
                    <p className="text-[#C9C9C9] text-[14px] font-[400] ">
                      {formatRelativeTime(eventDetails?.createdAt)}
                    </p>
                  </div>
                  <p className="font-[500] mt-[11px] text-[16px] text-[#959595] ">
                    {formatDate(eventDetails?.eventDate)}
                  </p>
                  <p className="font-[500] mt-[4px] text-[16px] text-[#959595] ">
                    {eventDetails?.eventTime}
                  </p>
                  <p className="font-[400] w-[651px] mt-[20px] text-[16px] text-[#4E4E4E] ">
                    {eventDetails?.eventDescription}
                  </p>
                  <div className="bg-[#C9C9C9] w-[655px] h-[171px] rounded-[14px] mt-[75px] "></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
