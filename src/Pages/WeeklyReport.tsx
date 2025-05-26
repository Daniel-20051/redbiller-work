import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import DropDown from "../Components/DropDown";
import WeekItem from "../Components/WeekItem";
import WeeklyCard from "../Components/WeeklyCard";
import { Link } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { UserDetailsContext } from "../context/AuthContext.js";
import { AuthApis } from "../api";
import { Icon } from "@iconify/react";
const authApis = new AuthApis();

function getWeekRange(dateString: string) {
  const date = new Date(dateString);
  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const day = date.getDay();
  // Calculate how many days to subtract to get Monday
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  // Friday is 4 days after Monday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  // Format as needed, e.g., "26th May"
  const format = (d: Date) =>
    `${d.getDate()}${
      ["th", "st", "nd", "rd"][d.getDate() % 10 > 3 ? 0 : d.getDate() % 10]
    } ${d.toLocaleString("default", { month: "short" })}`;

  return {
    startDate: format(monday),
    endDate: format(friday),
  };
}

const WeeklyReport = () => {
  const { userDetails } = use(UserDetailsContext);
  const isAdmin = userDetails?.data.user.role == "admin";
  const [reports, setReports] = useState<any[]>([]);
  //loader
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: any = await authApis.getAllReports();
        setReports(response.data.data.reports);
      } catch (error) {
        // showAlertMessage("An error occurred while sending report", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
              <div className="mt-[48px] w-[90%] h-[90%] items-center overflow-y-auto max-h-full hide-scrollbar scroll-smooth ">
                {isLoading ? (
                  <div className={`flex justify-center items-center h-[55vh] `}>
                    <Icon
                      icon="svg-spinners:ring-resize"
                      width="30"
                      height="30"
                      color="#93221D"
                    />
                  </div>
                ) : reports.length === 0 ? (
                  <div className="flex justify-center items-center h-[55vh] text-gray-500 text-lg">
                    No reports found.
                  </div>
                ) : (
                  reports.map((report, index) => {
                    const { startDate, endDate } = getWeekRange(
                      report.createdAt
                    );
                    return (
                      <WeekItem
                        startDate={startDate}
                        endDate={endDate}
                        key={report.id}
                        actionItem={report.ActionItems?.[0]?.description || ""}
                        ongoingTask={
                          report.OngoingTasks?.[0]?.description || ""
                        }
                        completedTask={
                          report.CompletedTasks?.[0]?.description || ""
                        }
                        weekNum={index + 1}
                      />
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
