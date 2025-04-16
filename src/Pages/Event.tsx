import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import EventItem from "../Components/EventItem";

const Event = () => {
  const [event, setEvent] = useState(0);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen ">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto max-h-[calc(100vh-55px)] ">
        <SideBar>event</SideBar>

        <div className="flex flex-1 items-center  flex-col  ">
          <div className="flex mt-[78px] justify-center w-full relative items-center ">
            <div className="flex flex-col w-[70%] md:w-[30%] gap-7 xl:gap-13">
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="bg-primary py-5 px-5  rounded-[15px] text-[16px] lg:text-[20px] font-[400] text-white hover:cursor-pointer  "
              >
                ADD EVENT
              </button>
              <div className="flex w-[100%] h-[60px] bg-[#F2F2F2]  rounded-[60px] p-1 items-center justify-center font-[600] text-[15px] lg:text-[20px] xl:text-[24px] ">
                <button
                  className={
                    event == 0
                      ? "w-[241px] h-[52px] bg-white rounded-[60px]  text-primary shadow-lg sm:shadow-none  "
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
                      : "w-[241px] h-[52px] bg-white rounded-[60px]  text-primary shadow-lg sm:shadow-none  "
                  }
                  onClick={() => {
                    setEvent(1);
                  }}
                >
                  All Event
                </button>
              </div>
            </div>
            <div className=" bg-[#F2F2F2] w-[161px] px-[24px]  py-[17px] h-[50px] items-center font-[600] rounded-[8px] absolute right-[50px] hidden sm:flex">
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
          <div className="flex-1 mt-[30px] w-full overflow-y-auto max-h-full  hide-scrollbar scroll-smooth  ">
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
        <Dialog
          open={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0  flex w-screen items-center justify-center px-12 py-6 bg-black/40 ">
            <DialogPanel className="w-[44%] h-[85%] rounded-[20px] items-start bg-white  px-12 py-6  ">
              <p className="font-[500] text-[24px] mb-12 place-self-center">
                Add Event
              </p>
              <form className="flex flex-col" action="">
                <label htmlFor="">Title</label>
                <input
                  className="bg-[#EEEEEE]/30 placeholder:text px-3 py-4 rounded-[6px] mt-3 mb-4"
                  placeholder="Event title"
                  type="text"
                />
                <label htmlFor="">Title</label>
                <textarea
                  className="bg-[#EEEEEE]/30 w-full h-40 placeholder:text px-3 py-3 rounded-[6px] mt-3 mb-4 resize-none"
                  placeholder="Event Details"
                  name=""
                  id=""
                ></textarea>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <label htmlFor="">Date</label>
                    <input
                      className="bg-[#EEEEEE]/30 placeholder:text px-3 py-4 rounded-[6px] mt-3 mb-4"
                      type="date"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="">Event Time</label>
                    <input
                      className="bg-[#EEEEEE]/30 placeholder:text px-3 py-4 rounded-[6px] mt-3 mb-4"
                      type="time"
                    />
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Event;
