import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import DropDown from "../Components/DropDown";
import WeekItem from "../Components/WeekItem";
import WeeklyCard from "../Components/WeeklyCard";
import { Link } from "react-router-dom";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext.js";

const WeeklyReport = () => {
  const { userDetails } = use(UserDetailsContext);
  const isAdmin = userDetails?.data.user.role == "admin";

  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)]  ">
        <SideBar>weekly-report</SideBar>
        <div className=" flex flex-1 flex-col items-center justify-center ">
          {isAdmin ? (
            <>
              <div className="border-1 p-5 border-[#D9D9D9] overflow-y-auto max-h-full hide-scrollbar scroll-smooth  rounded-[8px] w-[95%] h-[92.5%]">
                <div className="flex flex-col gap-8">
                  <p className="font-[600] text-[20px] ">Weekly Report</p>
                  <div className="flex items-center justify-between ">
                    <div className="relative">
                      <img
                        className=" absolute left-2 top-14 transform -translate-y-12  text-gray-500 "
                        src="/assets/search.svg"
                        alt=""
                      />
                      <input
                        className="h-[35px] pl-8 px-4  rounded-[8px] outline-1 bg-white w-[115px] md:w-[260px]  outline-[#E7E3E3] "
                        placeholder="Search"
                        type="text"
                      />
                    </div>
                    <DropDown></DropDown>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto max-h-full hide-scrollbar scroll-smooth   justify-center py-10">
                  <WeeklyCard user="John Doe" subject="Product Meeting">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Officiis eligendi
                  </WeeklyCard>
                  <WeeklyCard user="John Doe" subject="Product Meeting">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Officiis eligendi, asperiores consequatur ipsam hic,
                    laudantium molestias amet nam eius sed eum vitae in sapiente
                    magnam quod. Debitis modi sit maiores.
                  </WeeklyCard>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className=" mt-16 w-[90%]">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
