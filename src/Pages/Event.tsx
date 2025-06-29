import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import EventItem from "../Components/EventItem";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";
import AlertCard from "../messageAlert/AlertCardProps";
import { SuccessCard } from "../messageAlert/SuccessCard";
import { AuthApis } from "../api";

import Pagination from "../Components/Pagination";
const authApis = new AuthApis();

const Event = () => {
  const { userDetails } = use(UserDetailsContext);
  const isAdmin =
    userDetails?.data.user.role == "admin" ||
    userDetails?.data.user.role == "superadmin";
  const [event, setEvent] = useState(0);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  //Input Feilds
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");
  // Loader
  const [loading, setLoading] = useState<boolean>(false);
  const [eventLoading, setEventLoading] = useState<boolean>(false);
  //Aletrs
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  //Event Details
  const { setEventDetails } = use(UserDetailsContext);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate paginated events
  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  //submit event
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };
  //Format Created At
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
  const showAlertMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const sendReport = async (e: any) => {
    e.preventDefault();

    if (!title) {
      return showAlertMessage("Please enter Event Title", "error");
    }
    if (!description) {
      return showAlertMessage("Please enter Event Details", "error");
    }
    if (!formattedDate) {
      return showAlertMessage("Please enter Event Date", "error");
    }
    if (!formattedTime) {
      return showAlertMessage("Please enter Event Time", "error");
    }
    try {
      setLoading(true);
      const response: any = await authApis.submitEvent({
        title: title || "",
        description: description || "",
        date: formattedDate || "",
        time: formattedTime || "",
      });

      if (
        response.data.data.status === "successful" ||
        response.status === 201
      ) {
        setTitle("");
        setDescription(null);
        setDate("");
        setTime("");
        setLoading(false);
        setFormattedDate("");
        setFormattedTime("");
        setIsAddEventOpen(false);
        showSuccessMessage("Your event has been created successfully");
      }
      return response;
    } catch (error) {
      showAlertMessage("An error occurred while sending report", "error");
      return error;
    } finally {
      setLoading(false);
    }
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTitle(newValue);
  };
  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
  };
  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const formatDate = newValue.replace(/-/g, "");
    setDate(newValue);
    setFormattedDate(formatDate);
  };
  const handleTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const [hours, minutes] = newValue.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formatTime = `${formattedHour}:${minutes} ${ampm}`;
    setTime(newValue);
    setFormattedTime(formatTime);
  };

  // Helper function to format date
  const formatDate = (dateStr: string, isWeekday: boolean = false) => {
    if (!dateStr) return "";
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    const dayWithSuffix = getDayWithSuffix(parseInt(day));
    const monthName = date.toLocaleString("default", { month: "long" });
    const dayOfWeek = date.toLocaleString("default", { weekday: "long" });

    return isWeekday
      ? dayOfWeek.substring(0, 3)
      : `${dayWithSuffix} ${monthName}`;
  };

  // Helper function to add suffix to day
  const getDayWithSuffix = (day: number) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  // Add search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Get the base list to search from - either upcoming or all events
    const baseList =
      event === 0
        ? events.filter((ev: any) => {
            if (!ev.eventDate) return false;
            const year = ev.eventDate.substring(0, 4);
            const month = ev.eventDate.substring(4, 6);
            const day = ev.eventDate.substring(6, 8);
            const eventDate = new Date(
              Number(year),
              Number(month) - 1,
              Number(day)
            );
            return eventDate >= new Date();
          })
        : events;

    const filtered = baseList.filter((event) => {
      const titleMatch = event.eventTitle?.toLowerCase().includes(query);
      const dateMatch = formatDate(event.eventDate)
        ?.toLowerCase()
        .includes(query);
      return titleMatch || dateMatch;
    });

    setFilteredEvents(filtered);
  };

  // Update useEffect to set filtered events when events change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setEventLoading(true);
        const response: any = await authApis.getAllEvents();
        setEvents(response.data.data);
        // Filter for upcoming events if event == 0, else show all
        const allEvents = response.data.data;
        if (event == 0) {
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
                const match = ev.eventTime.match(/(\\d+):(\\d+)\\s*(AM|PM)/i);
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
                  const match = ev.eventTime.match(/(\\d+):(\\d+)\\s*(AM|PM)/i);
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
          setFilteredEvents(upcoming);
        } else {
          setFilteredEvents(allEvents);
        }
      } catch (error) {
        showAlertMessage("An error occurred while sending report", "error");
      } finally {
        setEventLoading(false);
      }
    };
    fetchData();
  }, [event, isAddEventOpen]);

  return (
    <div className="flex flex-col h-screen">
      <AlertCard
        message={alertMessage}
        type={alertType}
        isOpen={showAlert}
        onClose={handleCloseAlert}
        autoClose={true}
        autoCloseTime={3000}
      />
      <SuccessCard
        message={successMessage}
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        autoClose={true}
        autoCloseTime={2000}
      />
      <NavBar></NavBar>
      <div className="flex flex-1 w-full overflow-y-auto max-h-[calc(100vh-55px)]">
        <SideBar>event</SideBar>

        <div className="flex flex-1 flex-col">
          <div
            className={`pb-10 flex  justify-center w-full relative items-end ${
              isAdmin ? "h-[30vh]" : "h-[15%] md:h-[20%]"
            }`}
          >
            <div className="bg-[#F2F2F2] w-[161px] px-[24px] py-[17px] h-[50px] items-center font-[600] rounded-[8px] absolute right-[50px] hidden md:flex">
              <img
                className="w-[16px] h-[16px]"
                src="/assets/search.svg"
                alt=""
              />
              <input
                className="w-[110px] pl-[17px] h-[50px] outline-0"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className=" flex flex-col gap-6 w-[70%] md:w-[40%]">
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
                  className={`py-2 w-[50%] cursor-pointer md:py-3 px-3 text-[17px] md:text-[22px] rounded-[60px] font-[600] ${
                    event == 0 ? "bg-white text-primary" : "text-[#898A8D]"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => {
                    setEvent(1);
                  }}
                  className={`py-2 w-[50%] md:py-3 cursor-pointer px-3 text-[17px] md:text-[22px] rounded-[60px] font-[600] ${
                    event == 1 ? "bg-white text-primary" : "text-[#898A8D]"
                  }`}
                >
                  All Event
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full overflow-y-auto max-h-full hide-scrollbar scroll-smooth">
            {eventLoading ? (
              <div className="flex justify-center items-center h-[55vh]">
                <Icon
                  icon="svg-spinners:ring-resize"
                  width="30"
                  height="30"
                  color="#93221D"
                />
              </div>
            ) : paginatedEvents.length > 0 ? (
              paginatedEvents.map((event, index) => (
                <div
                  onClick={() => {
                    setEventDetails(event);
                  }}
                >
                  <EventItem
                    key={index}
                    createdAt={formatRelativeTime(event.createdAt)}
                    weekday={formatDate(event.eventDate, true)}
                    title={event.eventTitle}
                    date={formatDate(event.eventDate)}
                    time={event.eventTime}
                    description={event.eventDescription}
                  />
                </div>
              ))
            ) : (
              <div className="flex gap-4 flex-col justify-center items-center h-[50vh]">
                <img src="/assets/event-image.svg" alt="" />
                <p className="uppercase font-[600] text-[25px] md:text-[30px]">
                  No upcoming Event
                </p>
              </div>
            )}
          </div>
          {totalPages > 1 && event == 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        <Dialog
          open={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center md:px-12 px-7 py-6 bg-black/40">
            <DialogPanel className="bg-white w-[95%] md:w-[70%] lg:w-[44%] h-[auto] items-center rounded-[20px] overflow-y-auto max-h-full hide-scrollbar scroll-smooth px-5 md:px-12 py-6">
              <p className="font-[500] text-[24px] mb-12 place-self-center">
                Add Event
              </p>
              <form onSubmit={sendReport} className="flex flex-col" action="">
                <label htmlFor="">Title</label>
                <input
                  className="bg-[#EEEEEE]/30 placeholder:text px-3 py-4 rounded-[6px] mt-3 mb-4"
                  placeholder="Event title"
                  type="text"
                  value={title}
                  maxLength={18}
                  onChange={handleTitle}
                />
                <label htmlFor="">Title</label>
                <textarea
                  className="bg-[#EEEEEE]/30 w-full h-40 placeholder:text px-3 py-3 rounded-[6px] mt-3 mb-4 resize-none"
                  placeholder="Event Details"
                  value={description || ""}
                  onChange={handleDescription}
                ></textarea>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <label htmlFor="">Date</label>
                    <input
                      className="bg-[#EEEEEE]/30 w-25 md:w-auto px-1 md:px-3 py-4 rounded-[6px] mt-3 mb-4"
                      type="date"
                      value={date}
                      onChange={handleDate}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="">Event Time</label>
                    <input
                      className="bg-[#EEEEEE]/30 w-25 md:w-auto px-1 md:px-3 py-4 rounded-[6px] mt-3 mb-4"
                      type="time"
                      value={time}
                      onChange={handleTime}
                    />
                  </div>
                </div>
                <div className="flex gap-2 place-self-end">
                  <button
                    onClick={() => {
                      setIsAddEventOpen(false);
                    }}
                    type="button"
                    className="text-[#959595] px-5 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading}
                    type="submit"
                    className={`${
                      loading ? "bg-gray-400" : "bg-primary"
                    } cursor-pointer text-white px-5 py-2 rounded-[10px]`}
                  >
                    {loading ? (
                      <div className="flex cursor-not-allowed justify-center items-center h-full">
                        <Icon
                          icon="svg-spinners:ring-resize"
                          width="20"
                          height="20"
                          color="#ffffff"
                        />
                      </div>
                    ) : (
                      "Save"
                    )}
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
