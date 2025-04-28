import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import DropDown from "../Components/DropDown";
import WeekItem from "../Components/WeekItem";
import { Link } from "react-router-dom";

const WeeklyReport = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)]  ">
        <SideBar>weekly-report</SideBar>
        <div className=" flex flex-1 flex-col items-center ">
          <div className=" mt-[67px] w-[90%]">
            <div className="flex justify-between items-center">
              <p className="font-[600] text-[20px] ">Weekly Reports</p>
              <div className="flex gap-6">
                <DropDown></DropDown>
                <Link
                  to="/weekly-report/create"
                  className=" flex w-auto h-auto gap-2 items-center rounded-[8px] bg-primary pl-[10px] pr-[16px] py-[12px]"
                >
                  <img
                    className="w-[16px] h-[16px]  "
                    src="/assets/plus-icon.svg"
                    alt=""
                  />
                  <button className=" text-white font-[400] text-[12px]  ">
                    New Report
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-[48px] w-[90%]  items-center overflow-y-auto max-h-full hide-scrollbar scroll-smooth ">
            <WeekItem></WeekItem>
            <WeekItem></WeekItem>
            <WeekItem></WeekItem>
            <WeekItem></WeekItem>
            <WeekItem></WeekItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
