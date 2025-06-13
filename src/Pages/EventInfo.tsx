import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext.js";
import { google, outlook, yahoo, ics, CalendarEvent } from "calendar-link";
import { useState, useRef, useEffect } from "react";

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

const formatDateTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return "";

  // Extract date components
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  // Parse time string (e.g., "6:15 AM")
  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    }
  }

  // Format hours and minutes with leading zeros
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Return formatted string
  return `${year}-${month}-${day} ${formattedHours}:${formattedMinutes}:00 +0100`;
};

const EventInfo = () => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const { eventDetails } = use(UserDetailsContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const event: CalendarEvent = {
    title: eventDetails?.eventTitle,
    description: eventDetails?.eventDescription,
    start: formatDateTime(eventDetails?.eventDate, eventDetails?.eventTime),
    duration: [1, "hour"],
  };

  const googleUrl = google(event);
  const outlookUrl = outlook(event);
  const yahooUrl = yahoo(event);
  const icsUrl = ics(event);
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
                  <div className="flex justify-between">
                    <div className="flex gap-8 items-center">
                      <p className="font-[700] text-[#959595] text-[20px] ">
                        {eventDetails?.eventTitle}
                      </p>
                      <p className="text-[#C9C9C9] text-[14px] font-[400] ">
                        {formatRelativeTime(eventDetails?.createdAt)}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        className="bg-primary cursor-pointer text-[12px] md:text-[14px]  text-white px-4 py-3 rounded-md"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        Add to Calendar
                      </button>
                      <ul
                        ref={dropdownRef}
                        className={`${
                          isOpen ? "opacity-100" : "opacity-0 invisible"
                        } transition-all absolute top-13 bg-white shadow rounded-[10px] py-1 px-2 md:px-4 border-1 border-[#EEEEEE] z-100`}
                      >
                        <li className="cursor-pointer">
                          <a
                            target="_blank"
                            className=" flex items-center gap-3   px-4 py-2 whitespace-nowrap text-[16px] text-[#4E4E4E] font-[600] hover:text-primary"
                            href={icsUrl}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100"
                              height="100"
                              viewBox="0 0 50 50"
                              className=" w-5 md:w-7 h-5 md:h-7"
                            >
                              <path d="M44.527 34.75c-1.078 2.395-1.597 3.465-2.984 5.578-1.941 2.953-4.68 6.64-8.063 6.664-3.011.028-3.789-1.965-7.878-1.93-4.086.02-4.938 1.97-7.954 1.938-3.386-.031-5.976-3.352-7.918-6.3-5.43-8.27-6.003-17.966-2.648-23.122 2.375-3.656 6.129-5.805 9.656-5.805 3.594 0 5.852 1.973 8.82 1.973 2.883 0 4.637-1.976 8.794-1.976 3.14 0 6.46 1.71 8.836 4.664-7.766 4.257-6.504 15.347 1.34 18.316M31.195 8.469c1.512-1.942 2.66-4.68 2.242-7.469-2.464.168-5.347 1.742-7.03 3.781-1.528 1.86-2.794 4.617-2.302 7.285 2.692.086 5.477-1.52 7.09-3.597"></path>
                            </svg>
                            Apple
                          </a>
                        </li>
                        <li className="cursor-pointer">
                          <a
                            target="_blank"
                            className="flex items-center gap-3  px-4 py-2 whitespace-nowrap text-[16px] text-[#4E4E4E] font-[600] hover:text-primary"
                            href={googleUrl}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100"
                              height="100"
                              viewBox="0 0 48 48"
                              className="w-5 md:w-7 h-5 md:h-7"
                            >
                              <path fill="#fff" d="M13 13h22v22H13z"></path>
                              <path
                                fill="#1e88e5"
                                d="m25.68 20.92 1.008 1.44 1.584-1.152v8.352H30V18.616h-1.44zM22.943 23.745c.625-.574 1.013-1.37 1.013-2.249 0-1.747-1.533-3.168-3.417-3.168-1.602 0-2.972 1.009-3.33 2.453l1.657.421c.165-.664.868-1.146 1.673-1.146.942 0 1.709.646 1.709 1.44s-.767 1.44-1.709 1.44h-.997v1.728h.997c1.081 0 1.993.751 1.993 1.64 0 .904-.866 1.64-1.931 1.64-.962 0-1.784-.61-1.914-1.418L17 26.802c.262 1.636 1.81 2.87 3.6 2.87 2.007 0 3.64-1.511 3.64-3.368 0-1.023-.504-1.941-1.297-2.559"
                              ></path>
                              <path
                                fill="#fbc02d"
                                d="M34 42H14l-1-4 1-4h20l1 4z"
                              ></path>
                              <path
                                fill="#4caf50"
                                d="m38 35 4-1V14l-4-1-4 1v20z"
                              ></path>
                              <path
                                fill="#1e88e5"
                                d="m34 14 1-4-1-4H9a3 3 0 0 0-3 3v25l4 1 4-1V14z"
                              ></path>
                              <path fill="#e53935" d="M34 34v8l8-8z"></path>
                              <path
                                fill="#1565c0"
                                d="M39 6h-5v8h8V9a3 3 0 0 0-3-3M9 42h5v-8H6v5a3 3 0 0 0 3 3"
                              ></path>
                            </svg>
                            Google
                          </a>
                        </li>
                        <li className="cursor-pointer">
                          <a
                            target="_blank"
                            className=" flex items-center gap-3  px-4 py-2 whitespace-nowrap text-[16px] text-[#4E4E4E] font-[600] hover:text-primary"
                            href={outlookUrl}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100"
                              height="100"
                              viewBox="0 0 48 48"
                              className="w-5 md:w-7 h-5 md:h-7"
                            >
                              <path
                                fill="#103262"
                                d="m43.255 23.547-6.81-3.967v11.594H44v-6.331a1.5 1.5 0 0 0-.745-1.296"
                              ></path>
                              <path fill="#0084d7" d="M13 10h10v9H13z"></path>
                              <path fill="#33afec" d="M23 10h10v9H23z"></path>
                              <path fill="#54daff" d="M33 10h10v9H33z"></path>
                              <path fill="#027ad4" d="M23 19h10v9H23z"></path>
                              <path fill="#0553a4" d="M23 28h10v9H23z"></path>
                              <path fill="#25a2e5" d="M33 19h10v9H33z"></path>
                              <path fill="#0262b8" d="M33 28h10v9H33z"></path>
                              <path
                                d="M13 37h30V24.238l-14.01 8-15.99-8z"
                                opacity="0.019"
                              ></path>
                              <path
                                d="M13 37h30V24.476l-14.01 8-15.99-8z"
                                opacity="0.038"
                              ></path>
                              <path
                                d="M13 37h30V24.714l-14.01 8-15.99-8z"
                                opacity="0.057"
                              ></path>
                              <path
                                d="M13 37h30V24.952l-14.01 8-15.99-8z"
                                opacity="0.076"
                              ></path>
                              <path
                                d="M13 37h30V25.19l-14.01 8-15.99-8z"
                                opacity="0.095"
                              ></path>
                              <path
                                d="M13 37h30V25.429l-14.01 8-15.99-8z"
                                opacity="0.114"
                              ></path>
                              <path
                                d="M13 37h30V25.667l-14.01 8-15.99-8z"
                                opacity="0.133"
                              ></path>
                              <path
                                d="M13 37h30V25.905l-14.01 8-15.99-8z"
                                opacity="0.152"
                              ></path>
                              <path
                                d="M13 37h30V26.143l-14.01 8-15.99-8z"
                                opacity="0.171"
                              ></path>
                              <path
                                d="M13 37h30V26.381l-14.01 8-15.99-8z"
                                opacity="0.191"
                              ></path>
                              <path
                                d="M13 37h30V26.619l-14.01 8-15.99-8z"
                                opacity="0.209"
                              ></path>
                              <path
                                d="M13 37h30V26.857l-14.01 8-15.99-8z"
                                opacity="0.229"
                              ></path>
                              <path
                                d="M13 37h30v-9.905l-14.01 8-15.99-8z"
                                opacity="0.248"
                              ></path>
                              <path
                                d="M13 37h30v-9.667l-14.01 8-15.99-8z"
                                opacity="0.267"
                              ></path>
                              <path
                                d="M13 37h30v-9.429l-14.01 8-15.99-8z"
                                opacity="0.286"
                              ></path>
                              <path
                                d="M13 37h30v-9.19l-14.01 8-15.99-8z"
                                opacity="0.305"
                              ></path>
                              <path
                                d="M13 37h30v-8.952l-14.01 8-15.99-8z"
                                opacity="0.324"
                              ></path>
                              <path
                                d="M13 37h30v-8.714l-14.01 8-15.99-8z"
                                opacity="0.343"
                              ></path>
                              <path
                                d="M13 37h30v-8.476l-14.01 8-15.99-8z"
                                opacity="0.362"
                              ></path>
                              <path
                                d="M13 37h30v-8.238l-14.01 8-15.99-8z"
                                opacity="0.381"
                              ></path>
                              <path
                                d="M13 37h30v-8l-14.01 8L13 29z"
                                opacity="0.4"
                              ></path>
                              <linearGradient
                                id="Qf7015RosYe_HpjKeG0QTb_ut6gQeo5pNqf_gr2"
                                x1="13.665"
                                x2="41.285"
                                y1="6.992"
                                y2="9.074"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop offset="0.042" stopColor="#076db4"></stop>
                                <stop offset="0.85" stopColor="#0461af"></stop>
                              </linearGradient>
                              <path
                                fill="url(#Qf7015RosYe_HpjKeG0QTb_ut6gQeo5pNqf_gr2)"
                                d="M43 10H13V8a2 2 0 0 1 2-2h26a2 2 0 0 1 2 2z"
                              ></path>
                              <linearGradient
                                id="Qf7015RosYe_HpjKeG0QTc_ut6gQeo5pNqf_gr3"
                                x1="28.153"
                                x2="23.638"
                                y1="33.218"
                                y2="41.1"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop offset="0" stopColor="#33acee"></stop>
                                <stop offset="1" stopColor="#1b8edf"></stop>
                              </linearGradient>
                              <path
                                fill="url(#Qf7015RosYe_HpjKeG0QTc_ut6gQeo5pNqf_gr3)"
                                d="M13 25v15a2 2 0 0 0 2 2h27.004a1.98 1.98 0 0 0 1.221-.425z"
                              ></path>
                              <path
                                d="M21.319 13H13v24h8.319A3.68 3.68 0 0 0 25 33.319V16.681A3.68 3.68 0 0 0 21.319 13"
                                opacity="0.05"
                              ></path>
                              <path
                                d="M21.213 36H13V13.333h8.213a3.12 3.12 0 0 1 3.121 3.121v16.425A3.12 3.12 0 0 1 21.213 36"
                                opacity="0.07"
                              ></path>
                              <path
                                d="M21.106 35H13V13.667h8.106a2.56 2.56 0 0 1 2.56 2.56V32.44a2.56 2.56 0 0 1-2.56 2.56"
                                opacity="0.09"
                              ></path>
                              <linearGradient
                                id="Qf7015RosYe_HpjKeG0QTd_ut6gQeo5pNqf_gr4"
                                x1="3.53"
                                x2="22.41"
                                y1="14.53"
                                y2="33.41"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop offset="0" stopColor="#1784d8"></stop>
                                <stop offset="1" stopColor="#0864c5"></stop>
                              </linearGradient>
                              <path
                                fill="url(#Qf7015RosYe_HpjKeG0QTd_ut6gQeo5pNqf_gr4)"
                                d="M21 34H5a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2"
                              ></path>
                              <path
                                fill="#fff"
                                d="M13 18.691c-3.111 0-4.985 2.377-4.985 5.309S9.882 29.309 13 29.309s4.985-2.377 4.985-5.308c0-2.933-1.874-5.31-4.985-5.31m0 8.826c-1.765 0-2.82-1.574-2.82-3.516s1.06-3.516 2.82-3.516 2.821 1.575 2.821 3.516-1.057 3.516-2.821 3.516"
                              ></path>
                            </svg>
                            Outlook
                          </a>
                        </li>
                        <li className="cursor-pointer">
                          <a
                            target="_blank"
                            className=" flex items-center gap-3  px-4 py-2 whitespace-nowrap text-[16px] text-[#4E4E4E] font-[600] hover:text-primary"
                            href={yahooUrl}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100"
                              height="100"
                              viewBox="0 0 48 48"
                              className="w-5 md:w-7 h-5 md:h-7"
                            >
                              <path
                                fill="#5e35b1"
                                d="M4.209 14.881h7.423l4.557 11.834 4.777-11.834h7.349L17.07 42H9.501l3.086-7.04z"
                              ></path>
                              <circle
                                cx="29.276"
                                cy="30.522"
                                r="4.697"
                                fill="#5e35b1"
                              ></circle>
                              <path
                                fill="#5e35b1"
                                d="m34.693 6-7.48 18.042h8.231L42.925 6z"
                              ></path>
                            </svg>
                            Yahoo
                          </a>
                        </li>
                      </ul>
                    </div>
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
