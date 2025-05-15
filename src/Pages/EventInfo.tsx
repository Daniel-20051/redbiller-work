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
  return (
    <div className="flex flex-col h-screen ">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)] ">
        <SideBar>event</SideBar>

        <div className="w-[100%] lg:w-[76%] flex flex-col hide-scrollbar  items-center overflow-y-auto max-h-full relative">
          <div className="mb-10">
            <Link to="/events">
              <div className="flex gap-4 absolute top-5 md:top-[55px] left-[40px] items-center ">
                <img
                  className="w[9.14px] h-[16.17px] "
                  src="/assets/back.svg"
                  alt=""
                />
                <p className="font-[800] text-[16px] ">Event</p>
              </div>
            </Link>
            <div className="mt-[85px] ">
              <p className="font-[700] text-[24px] md:text-[36px] text-center ">
                Event Details
              </p>

              <div className="flex mt-7 items-start gap-3 md:gap-5 ">
                <img
                  className="w-[18px] h-[19.5px] "
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
                  <p className="font-[400] w-[80vw] md:w-[60vw] lg:w-[65vw] mt-[20px] text-[16px] text-[#4E4E4E] ">
                    {eventDetails?.eventDescription}
                  </p>
                  <div className=" flex flex-col bg-[#FAFAFA] overflow-hidden  w-[75vw] md:w-[60vw] lg:w-[40vw] h-[171px] py-2 rounded-[14px] place-self-center mt-[75px] ">
                    <div className="border-1 border-[#C9C9C9] mt-4 mb-8 w-[80%] place-self-center "></div>
                    <div className="border-1 border-[#C9C9C9]  w-[80%] place-self-center "></div>
                    <div className="bg-primary/78 px-2 py-1 text-white w-[78%] my-1 place-self-center  rounded-[5px]">
                      <div className="flex-flex-col">
                        <p className="text-white font-[700] text-[14px] ">
                          {eventDetails?.eventTitle}
                        </p>
                        <p className="flex  font-[700] text-[14px] items-center gap-2">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 9C6.06087 9 7.07828 8.57857 7.82843 7.82843C8.57857 7.07828 9 6.06087 9 5C9 3.93913 8.57857 2.92172 7.82843 2.17157C7.07828 1.42143 6.06087 1 5 1C3.93913 1 2.92172 1.42143 2.17157 2.17157C1.42143 2.92172 1 3.93913 1 5C1 6.06087 1.42143 7.07828 2.17157 7.82843C2.92172 8.57857 3.93913 9 5 9ZM5 0C5.65661 0 6.30679 0.129329 6.91342 0.380602C7.52005 0.631876 8.07124 1.00017 8.53553 1.46447C8.99983 1.92876 9.36812 2.47995 9.6194 3.08658C9.87067 3.69321 10 4.34339 10 5C10 6.32608 9.47322 7.59785 8.53553 8.53553C7.59785 9.47322 6.32608 10 5 10C2.235 10 0 7.75 0 5C0 3.67392 0.526784 2.40215 1.46447 1.46447C2.40215 0.526784 3.67392 0 5 0ZM5.25 2.5V5.125L7.5 6.46L7.125 7.075L4.5 5.5V2.5H5.25Z"
                              fill="white"
                              stroke="white"
                              strokeWidth="0.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          {eventDetails?.eventTime}
                        </p>
                      </div>
                    </div>
                    <div className="border-1 border-[#C9C9C9] mb-8 w-[80%] place-self-center "></div>

                    <div className="border-1 border-[#C9C9C9] mb-8 w-[80%] place-self-center "></div>
                    <div className="border-1 border-[#C9C9C9] mb-8 w-[80%] place-self-center "></div>
                  </div>
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
