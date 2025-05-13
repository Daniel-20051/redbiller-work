import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { useState } from "react";

const WeeklyView = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 1",
    "Item 2",
    "Item 2",
    "Item 1",
    "Item 2",
    "Item 2",
    "Item 1",
    "Item 2",
    "Item 2",
    "Item 2",
    "Item 1",
    "Item 2",
    "Item 2",
  ];

  return (
    <div className="flex flex-col h-screen ">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)]  z-10">
        <SideBar>weekly-report</SideBar>
        <div className=" flex  flex-1 flex-col items-center justify-center ">
          <div className="border-1 py-5   border-[#D9D9D9] overflow-y-auto  max-h-full hide-scrollbar scroll-smooth  rounded-[8px] w-[95%] h-[92.5%] ">
            <div className="flex flex-col gap-4">
              <p className="font-[600] px-5 text-[20px] ">Weekly Report</p>

              <div className="px-5 place-self-end relative">
                <img
                  className=" absolute left-7 top-14 transform -translate-y-12  text-gray-500 "
                  src="/assets/search.svg"
                  alt=""
                />
                <input
                  className="h-[35px] pl-8 px-4  rounded-[8px] outline-1 bg-white w-[115px] md:w-[260px]  outline-[#E7E3E3] "
                  placeholder="Search"
                  type="text"
                />
              </div>
              <div className="overflow-x-auto max-w-[95vw] lg:max-w-[76vw] z-0 hide-scrollbar scroll-smooth">
                <ul className="flex flex-nowrap min-w-max">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className={` px-8 py-2 cursor-pointer border-r-1 border-[#D9D9D9] ${
                        selectedIndex === index
                          ? "bg-primary text-white"
                          : "bg-[#F2F2F2]"
                      } `}
                      onClick={() => setSelectedIndex(index)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
