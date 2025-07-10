import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import { UserDetailsContext } from "../context/AuthContext";
import { use } from "react";
import SideBar from "../Components/SideBar";
import { Link, useNavigate } from "react-router-dom";
import SmallSpiner from "../Components/smallSpiner";
import { AuthApis } from "../api";
import { Icon } from "@iconify/react";

const authApi = new AuthApis();

const Home = () => {
  const { userDetails } = use(UserDetailsContext);
  const [incidentreportHome, setIncidentreportHome] = useState<any>(null);
  const [weeklyReportHome, setWeeklyReportHome] = useState<any>(null);
  const [weeklyReportHomeUser, setWeeklyReportHomeUser] = useState<any>(null);
  const [spiner, setSpiner] = useState<any>(false);
  const [eventLoading, setEventLoading] = useState<boolean>(false);
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
  const isAdmin =
    userDetails?.data.user.role == "admin" ||
    userDetails?.data.user.role == "superadmin";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incidentResponse, weeklyResponse] = await Promise.all([
          authApi.getAllIncidentReport(),
          authApi.getAllReports(),
        ]);
        setSpiner(true);
        setIncidentreportHome(incidentResponse);
        setWeeklyReportHome((weeklyResponse as any).data.data[0]);
        setWeeklyReportHomeUser((weeklyResponse as any).data.data.reports[0]);
      } catch (error) {
        // handle error
      } finally {
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setEventLoading(true);
        const response: any = await authApi.getAllEvents();
        // Filter for upcoming events if event == 0, else show all
        const allEvents = response.data.data;
        const now = new Date();
        const upcoming = allEvents
          .filter((ev: any) => {
            if (!ev.eventDate) return false;
            const year = ev.eventDate.substring(0, 4);
            const month = ev.eventDate.substring(4, 6);
            const day = ev.eventDate.substring(6, 8);

            // Default to midnight if no time
            let hours = 0,
              minutes = 0;
            if (ev.eventTime) {
              // Example format: "10:30 PM"
              const match = ev.eventTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
              if (match) {
                hours = parseInt(match[1], 10);
                minutes = parseInt(match[2], 10);
                const ampm = match[3].toUpperCase();
                if (ampm === "PM" && hours !== 12) hours += 12;
                if (ampm === "AM" && hours === 12) hours = 0;
              }
            }
            const eventDate = new Date(
              Number(year),
              Number(month) - 1,
              Number(day),
              hours,
              minutes
            );
            return eventDate >= now;
          })
          .sort((a: any, b: any) => {
            const getDateTime = (ev: any) => {
              const year = ev.eventDate.substring(0, 4);
              const month = ev.eventDate.substring(4, 6);
              const day = ev.eventDate.substring(6, 8);
              let hours = 0,
                minutes = 0;
              if (ev.eventTime) {
                const match = ev.eventTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
                if (match) {
                  hours = parseInt(match[1], 10);
                  minutes = parseInt(match[2], 10);
                  const ampm = match[3].toUpperCase();
                  if (ampm === "PM" && hours !== 12) hours += 12;
                  if (ampm === "AM" && hours === 12) hours = 0;
                }
              }
              return new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                hours,
                minutes
              ).getTime();
            };
            return getDateTime(a) - getDateTime(b);
          });

        setUpcomingEvent(upcoming[0]);
      } catch (error) {
        //handle error
      } finally {
        setEventLoading(false);
      }
    };
    fetchEvent();
  }, []);

  return (
    <div>
      {!userDetails ? (
        <div className="w-full h-screen flex justify-center items-center bg-opacity-10">
          <SmallSpiner />
        </div>
      ) : (
        <div className="flex flex-col  h-screen">
          <NavBar></NavBar>
          <div className=" flex flex-1 w-full relative max-h-[calc(100vh-55px)]">
            <SideBar>home</SideBar>

            <div className="flex flex-1 flex-col pb-6  items-center justify-center overflow-y-auto max-h-full relative hide-scrollbar scroll-smooth  ">
              <p className=" font-[600] text-[27px] md:text-[32px]  mb-4 ">
                Welcome,{" "}
                <span>
                  {userDetails?.data.user.firstName.charAt(0).toUpperCase() +
                    userDetails?.data.user.firstName.slice(1).toLowerCase()}
                </span>
                !
              </p>
              <div className=" flex w-[80%]  h-[38%] bg-[#F2F2F2] mb-7  rounded-[15px] pt-5 relative ">
                {eventLoading ? (
                  <div className="flex w-full justify-center items-center h-full">
                    <Icon
                      icon="svg-spinners:ring-resize"
                      width="30"
                      height="30"
                      color="#93221D"
                    />
                  </div>
                ) : upcomingEvent ? (
                  <>
                    <Link to="/events" className=" relative flex-1">
                      <p className="text-[24px] md:text-[32px] font-[600] ml-[19px]  ">
                        Upcoming event
                      </p>
                      <div className="mt-2 md:mt-[23px] ml-[26px] w-[150px] md:w-[222px] border-1 border-[#C9C9C9] "></div>

                      <p className="text-primary text-[16px] font-[700] ml-[30px] mt-[20px] ">
                        {upcomingEvent.eventTitle}
                      </p>
                      <p className="text-[#4E4E4E] ml-[30px] mr-4  mt-[8px] text-[14px] font-[400] clamp-responsive ">
                        {upcomingEvent.eventDescription}
                      </p>
                      <div className="flex gap-1 absolute bottom-[10px] md:bottom-[25px] left-[40px] text-[14px] font-[400] text-[#4E4E4E] ">
                        <img src="/assets/MapPin.svg" alt="" />
                        <p>Conference Room</p>
                      </div>
                      <p className="absolute right-[21px] bottom-[10px] md:bottom-[25px] text-[14px] font-[400] text-[#4E4E4E]">
                        {(() => {
                          if (!upcomingEvent.eventDate) return "";
                          const year = upcomingEvent.eventDate.substring(0, 4);
                          const month = upcomingEvent.eventDate.substring(4, 6);
                          const day = upcomingEvent.eventDate.substring(6, 8);
                          const date = new Date(`${year}-${month}-${day}`);
                          return date.toLocaleString("default", {
                            weekday: "long",
                          });
                        })()}
                      </p>
                    </Link>
                    <div className="hidden lg:inline">
                      <img
                        className="h-full"
                        src="/assets/home-design.svg"
                        alt=""
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col w-full justify-center items-center h-full">
                    <Icon
                      icon="line-md:document-delete"
                      width="70"
                      height="70"
                      color="#93221D"
                    />
                    <p className="font-[600] text-lg mt-2">No upcoming event</p>
                  </div>
                )}
              </div>
              <div className=" md:flex gap-5 w-[80%] h-[37%] md:h-[40%] justify-between">
                <div className=" w-full md:w-[47%] h-full  bg-[#F2F2F2] rounded-[15px] mb-8 relative ">
                  {spiner ? (
                    <div className="relative w-full h-full rounded-[15px] overflow-hidden ">
                      {/* Background layer for the entire card */}
                      {/* <div className="absolute inset-0 bg-[#F2F2F2]"></div> */}

                      <Link
                        to="/incident-report"
                        className="relative flex flex-col h-full z-10"
                      >
                        {incidentreportHome?.data?.data.incidents[0]
                          .incidentMessage ? (
                          <div className="flex flex-col justify-between py-4 pl-6 pr-4 h-full">
                            <div>
                              <p className="text-[24px] md:text-[32px] font-[600]  ">
                                Incident Report
                              </p>
                              <div className="mt-2 md:mt-[23px]  w-[150px] md:w-[222px] border-1 border-[#C9C9C9] "></div>
                              <p className="text-primary text-[16px] font-[700] mt-[20px]">
                                {
                                  incidentreportHome?.data?.data.incidents[0]
                                    .subject
                                }
                              </p>
                              <p className="text-[#4E4E4E]  mt-[8px] text-[14px] font-[400] clamp-responsive">
                                {
                                  incidentreportHome?.data?.data.incidents[0]
                                    .incidentMessage
                                }
                              </p>
                            </div>

                            <div className="flex  justify-between">
                              <p className="bottom-3 lg:bottom-[30px] left-[35px] text-[#898A8D] text-[14px] font-[400] ">
                                {new Date(
                                  incidentreportHome?.data?.data.incidents[0].createdAt
                                ).toLocaleString(undefined, {
                                  weekday: "long",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <button
                                className="bottom-3 lg:bottom-[25px] right-[46px] bg-primary text-white rounded-[10px] w-[86px] h-[34px] text-[15px] font-[400] cursor-pointer z-20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/incident-report");
                                }}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 justify-center items-center h-[100%]">
                            <Icon
                              icon="line-md:document-delete"
                              width="60"
                              height="60"
                              color="#93221D"
                            />
                            <p className="font-[600] text-lg">
                              No Incident Report
                            </p>
                          </div>
                        )}
                      </Link>

                      {!incidentreportHome?.data?.data?.incidents[0]
                        .incidentphoto && null}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <Icon
                        icon="svg-spinners:ring-resize"
                        width="30"
                        height="30"
                        color="#93221D"
                      />
                    </div>
                  )}
                </div>
                <div className="w-full md:w-[47%]  h-full  bg-[#F2F2F2] rounded-[15px]  relative ">
                  {!spiner ? (
                    <div className="flex justify-center items-center h-full">
                      <Icon
                        icon="svg-spinners:ring-resize"
                        width="30"
                        height="30"
                        color="#93221D"
                      />
                    </div>
                  ) : weeklyReportHome || weeklyReportHomeUser ? (
                    <Link
                      to="/weekly-report"
                      className="flex flex-col justify-between  pl-6 pr-4 py-4 h-full"
                    >
                      <div>
                        <p className="text-[24px] md:text-[32px] font-[600]  ">
                          Weekly Report
                        </p>
                        <div className="mt-2 md:mt-[23px]  w-[150px] md:w-[222px] border-1 border-[#C9C9C9] "></div>
                        <p className="text-primary text-[16px] font-[700] mt-[20px] ">
                          Action Items
                        </p>
                        <p className="text-[#4E4E4E]  mt-[8px] text-[14px] font-[400] clamp-responsive ">
                          {isAdmin
                            ? weeklyReportHome.ActionItems?.[0]?.description?.split(
                                "//"
                              )[0] || "No Action Items"
                            : weeklyReportHomeUser.ActionItems?.[0]?.description?.split(
                                "//"
                              )[0] || "No Action Items"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="bottom-3 lg:bottom-[30px] left-[35px] text-[#898A8D] text-[14px] font-[400] ">
                          {isAdmin
                            ? new Date(
                                weeklyReportHome.createdAt
                              ).toLocaleString(undefined, {
                                weekday: "long",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date(
                                weeklyReportHomeUser.createdAt
                              ).toLocaleString(undefined, {
                                weekday: "long",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </p>
                        <button
                          className="bottom-3 lg:bottom-[25px] right-[46px] bg-primary text-white rounded-[10px] w-[86px] h-[34px] text-[15px] font-[400] cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/weekly-report");
                          }}
                        >
                          View
                        </button>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2 justify-center items-center h-full">
                      <Icon
                        icon="line-md:document-delete"
                        width="60"
                        height="60"
                        color="#93221D"
                      />
                      <p className="font-[600] text-lg">No Weekly Report</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
