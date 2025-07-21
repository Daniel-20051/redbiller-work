import WeekItem from "../Components/WeekItem";
import WeeklyCard from "../Components/WeeklyCard";
import { Link } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { UserDetailsContext } from "../context/AuthContext.js";
import { AuthApis } from "../api";
import { Icon } from "@iconify/react";
const authApis = new AuthApis();

function getWeekOfYear(dateString: string): number {
  const date = new Date(dateString);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return weekNumber;
}

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
  const isAdmin =
    userDetails?.data.user.role == "admin" ||
    userDetails?.data.user.role == "superadmin";
  const [reports, setReports] = useState<any[]>([]);
  const department = userDetails?.data.user.occupation;
  //loader
  const [isLoading, setIsLoading] = useState(false);
  // Add search state
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: any = await authApis.getAllReports();
        if (isAdmin) {
          setReports(response.data.data);
        } else {
          setReports(response.data.data.reports);
        }
      } catch (error) {
        // showAlertMessage("An error occurred while sending report", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort and filter to get only the most recent report per user
  const sortedReports = Array.isArray(reports)
    ? [...reports].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];
  const mostRecentReportsMap = new Map();
  sortedReports.forEach((report) => {
    if (
      report.User &&
      report.User.id &&
      report.User.occupation === department &&
      userDetails?.data.user.role == "admin"
    ) {
      const userId = report.User.id;
      if (!mostRecentReportsMap.has(userId)) {
        mostRecentReportsMap.set(userId, report);
      }
    } else if (
      report.User &&
      report.User.id &&
      userDetails?.data.user.role == "superadmin"
    ) {
      const userId = report.User.id;
      if (!mostRecentReportsMap.has(userId)) {
        mostRecentReportsMap.set(userId, report);
      }
    }
  });
  const mostRecentReports = Array.from(mostRecentReportsMap.values());

  // Add search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter reports based on search query
  const filteredReports = mostRecentReports.filter((report) => {
    const userName = report.User.firstName.toLowerCase();
    const actionItems =
      report.ActionItems?.[0]?.description.toLowerCase() || "";
    return userName.includes(searchQuery) || actionItems.includes(searchQuery);
  });

  return (
    <div className=" flex flex-1 w-full overflow-y-auto  h-[calc(100vh-55px)]  ">
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
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                  {userDetails?.data.user.role == "admin" && (
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
                  )}
                </div>
              </div>
              <div
                className={` ${
                  isLoading
                    ? "flex justify-center items-center h-[55vh]"
                    : "grid grid-cols-1 md:grid-cols-3 justify-center"
                } gap-8 overflow-y-auto max-h-full hide-scrollbar scroll-smooth    py-10`}
              >
                {isLoading ? (
                  <div className={``}>
                    <Icon
                      icon="svg-spinners:ring-resize"
                      width="30"
                      height="30"
                      color="#93221D"
                    />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="flex col-span-3 justify-center items-center h-[55vh] text-gray-500 text-lg">
                    No reports found.
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <Link
                      className=""
                      to={`/weekly-report/${report.User.id}`}
                      key={report.id}
                    >
                      <WeeklyCard
                        user={
                          report.User.firstName.charAt(0).toUpperCase() +
                          report.User.firstName.slice(1).toLowerCase()
                        }
                        subject="Action Item"
                      >
                        {report.ActionItems?.[0]?.description
                          .split("\n")
                          .map((desc: string, i: number) =>
                            desc.trim() ? <p key={i}>{desc.trim()} </p> : null
                          ) || []}
                      </WeeklyCard>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className=" mt-16 w-[90%]">
              <div className="flex justify-between items-center">
                <p className="font-[600] text-[20px] ">Weekly Reports</p>
                <div className="flex gap-6">
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
                reports.map((report) => {
                  const { startDate, endDate } = getWeekRange(report.createdAt);
                  return (
                    <WeekItem
                      startDate={startDate}
                      endDate={endDate}
                      key={report.id}
                      actionItem={(report.ActionItems?.[0]?.description ?? "")
                        .split("\n")
                        .map((desc: string, i: number) =>
                          desc.trim() ? <p key={i}>{desc.trim()} </p> : null
                        )}
                      ongoingTask={(report.OngoingTasks?.[0]?.description ?? "")
                        .split("\n")
                        .map((desc: string, i: number) =>
                          desc.trim() ? <p key={i}>{desc.trim()} </p> : null
                        )}
                      completedTask={(
                        report.CompletedTasks?.[0]?.description ?? ""
                      )
                        .split("\n")
                        .map((desc: string, i: number) =>
                          desc.trim() ? <p key={i}>{desc.trim()} </p> : null
                        )}
                      weekNum={getWeekOfYear(report.createdAt)}
                    />
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyReport;
