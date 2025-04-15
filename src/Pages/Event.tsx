import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { useState } from "react";
import EventItem from "../Components/EventItem";

const Event = () => {
  const [event, setEvent] = useState(0);

  return (
    <div className="flex flex-col h-screen ">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)] ">
        <SideBar>event</SideBar>

        <div className="w-[76%] flex flex-col  ">
          <div className="flex mt-[78px] justify-center w-full relative items-center ">
            <div className="flex flex-col gap-13">
              <button className="bg-primary py-5 px-41 rounded-[15px] text-[20px] font-[400] text-white hover:cursor-pointer  ">
                ADD EVENT
              </button>
              <div className="flex w-[488px] h-[60px] bg-[#F2F2F2]  rounded-[60px] items-center justify-center font-[600] text-[24px] ">
                <button
                  className={
                    event == 0
                      ? "w-[241px] h-[52px] bg-white rounded-[60px]  text-primary  "
                      : "w-[241px] h-[52px] rounded-[60px]  text-[#898A8D]  "
                  }
                  onClick={() => {
                    setEvent(0);
                  }}
                >
                  Upcoming
                </button>
                <button
                  className={
                    event == 0
                      ? "w-[241px] h-[52px] rounded-[60px]  text-[#898A8D] "
                      : "w-[241px] h-[52px] bg-white rounded-[60px]  text-primary   "
                  }
                  onClick={() => {
                    setEvent(1);
                  }}
                >
                  All Event
                </button>
              </div>
            </div>
            <div
              className={
                event == 0
                  ? "flex bg-[#F2F2F2] w-[161px] px-[24px]  py-[17px] h-[50px] items-center font-[600] rounded-[8px] absolute right-[50px] "
                  : "flex bg-[#F2F2F2] w-[161px] px-[24px]  py-[17px] h-[50px] items-center font-[600] rounded-[8px] absolute right-[50px] "
              }
            >
              <img
                className={event == 0 ? "w-[16px] h-[16px]" : "hidden"}
                src="../src/assets/search.svg"
                alt=""
              />
              <input
                className={
                  event == 0
                    ? "w-[110px] pl-[17px] h-[50px] outline-0  "
                    : "w-[120px]  h-[50px] outline-0  "
                }
                type={event == 0 ? "text" : "date"}
                placeholder={event == 0 ? "Search..." : "Date"}
              />
            </div>
          </div>
          <div className="flex-1 mt-[30px] overflow-y-auto max-h-full hide-scrollbar scroll-smooth  ">
            <EventItem></EventItem>
            <EventItem></EventItem>
            <EventItem></EventItem>
            <EventItem></EventItem>
            <EventItem></EventItem>
            <EventItem></EventItem>
            <EventItem></EventItem>
            <EventItem></EventItem>
            <EventItem></EventItem>
            <EventItem></EventItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
