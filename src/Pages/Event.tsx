import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import EventItem from "../Components/EventItem";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";

const Event = () => {
  const { userDetails } = use(UserDetailsContext);
  const isAdmin = userDetails?.data.user.role === "admin";
  const [event, setEvent] = useState(0);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen ">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto max-h-[calc(100vh-55px)] ">
        <SideBar>event</SideBar>

        <div className="flex flex-1   flex-col  ">
          <div className="flex h-[30%] justify-center w-full relative items-center ">
            <div className=" bg-[#F2F2F2] w-[161px] px-[24px]  py-[17px] h-[50px] items-center font-[600] rounded-[8px] absolute right-[50px] hidden md:flex">
              <img
                className={event == 0 ? "w-[16px] h-[16px]" : "hidden"}
                src="/assets/search.svg"
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
            <div className="flex flex-col gap-6  w-[70%] md:w-[40%]">
              {isAdmin && (
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="bg-primary cursor-pointer text-white py-3 md:py-4 text-[17px] md:text-[22px] font-[400] rounded-[15px]"
                >
                  ADD EVENT
                </button>
              )}
              <div className="bg-[#F2F2F2] rounded-[60px] p-1 flex">
                <button
                  onClick={() => {
                    setEvent(0);
                  }}
                  className={` py-2 w-[50%] cursor-pointer md:py-3 px-3 text-[17px] md:text-[22px] rounded-[60px] font-[600] ${
                    event == 0 ? "bg-white  text-primary" : "text-[#898A8D]"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => {
                    setEvent(1);
                  }}
                  className={` py-2 w-[50%] md:py-3 cursor-pointer px-3 text-[17px] md:text-[22px] rounded-[60px] font-[600] ${
                    event == 1 ? "bg-white  text-primary" : "text-[#898A8D]"
                  }`}
                >
                  All Event
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full overflow-y-auto max-h-full  hide-scrollbar scroll-smooth  ">
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
          <div className="fixed inset-0  flex w-screen items-center justify-center md:px-12 px-7 py-6 bg-black/40 ">
            <DialogPanel
              className=" bg-white w-[95%] md:w-[70%] lg:w-[44%] h-[75%] md:h-[85%] items-center  rounded-[20px] 
            overflow-y-auto max-h-full  hide-scrollbar scroll-smooth  px-12 py-6  "
            >
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
                      className="bg-[#EEEEEE]/30 w-25 md:w-auto px-1 md:px-3 py-4 rounded-[6px] mt-3 mb-4"
                      type="date"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="">Event Time</label>
                    <input
                      className="bg-[#EEEEEE]/30 w-25 md:w-auto px-1 md:px-3 py-4 rounded-[6px] mt-3 mb-4"
                      type="time"
                    />
                  </div>
                </div>
                <div className="flex gap-2 place-self-end">
                  <button
                    onClick={() => {
                      setIsAddEventOpen(false);
                    }}
                    className="text-[#959595]  px-5 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button className="bg-primary cursor-pointer text-white px-5 py-2 rounded-[10px]">
                    Save
                  </button>
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
