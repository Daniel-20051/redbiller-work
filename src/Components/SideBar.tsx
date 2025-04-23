import { Link } from "react-router-dom";
import GroupCard from "./GroupCard";
import { use, useRef, useEffect } from "react";
import { UserDetailsContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

interface Props {
  children?: string;
}

const SideBar = ({ children }: Props) => {
  const { userDetails } = use(UserDetailsContext);
  const isAdmin = userDetails?.data.user.role === "admin";
  const { isCollapsed, toggleCollapse, toggleRef } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target) &&
        !isCollapsed
      ) {
        toggleCollapse();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed, toggleCollapse, toggleRef]);

  return (
    <div
      ref={sidebarRef}
      className={`flex-col items-start justify-between lg:w-[25%] xl:w-[20%] bg-[#D6CBCB] transition-all ${
        isCollapsed
          ? "w-0 overflow-hidden  "
          : "absolute z-40 w-[50%] md:w-[40%] h-full"
      } lg:flex `}
    >
      <div className="w-full">
        <Link
          to="/home"
          className={
            children === "home"
              ? "text-white  flex w-full h-[55px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[55px] font-bold gap-3 items-center "
          }
        >
          <img
            className="w-[16px] h-[16px] ml-[30px] text-black "
            src={
              children === "home"
                ? "../src/assets/home-logo-active.png"
                : "../src/assets/home-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Home</p>
        </Link>

        {isAdmin && (
          <Link
            to="/users"
            className={
              children === "users"
                ? "text-white  flex w-full h-[55px] font-bold bg-primary gap-3 items-center "
                : "text-black  flex w-full h-[55px] font-bold gap-3 items-center "
            }
          >
            <img
              className="w-[16px] h-[16px] ml-[30px] text-black "
              src={
                children === "users"
                  ? "../src/assets/users-active.svg"
                  : "../src/assets/users.svg"
              }
              alt=""
            />
            <p className="text-[15px] font-[500] ">Users</p>
          </Link>
        )}
        <Link
          to="/events"
          className={
            children === "event"
              ? "text-white  flex w-full h-[55px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[55px] font-bold gap-3 items-center "
          }
        >
          <img
            className="w-[16px] h-[16px] ml-[30px] text-black "
            src={
              children === "event"
                ? "../src/assets/event-logo-active.svg"
                : "../src/assets/event-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Event</p>
        </Link>
        <Link
          to="/incident-report"
          className={
            children === "incident-report"
              ? "text-white  flex w-full h-[55px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[55px] font-bold gap-3 items-center "
          }
        >
          <img
            className="w-[16px] h-[16px] ml-[30px] text-black "
            src={
              children === "incident-report"
                ? "../src/assets/incident-logo-active.svg"
                : "../src/assets/incident-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Incident Report</p>
        </Link>
        <Link
          to="/weekly-report"
          className={
            children === "weekly-report"
              ? "text-white  flex w-full h-[55px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[55px] font-bold gap-3 items-center "
          }
        >
          <img
            className="w-[16px] h-[16px] ml-[30px] text-black "
            src={
              children === "weekly-report"
                ? "../src/assets/weekly-logo-active.svg"
                : "../src/assets/weekly-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Weekly Report</p>
        </Link>
        <Link
          to="/home"
          className={
            children === "tasks"
              ? "text-white  flex w-full h-[55px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[55px] font-bold gap-3 items-center "
          }
        >
          <img
            className="w-[16px] h-[16px] ml-[30px] text-black "
            src={
              children === "tasks"
                ? "../src/assets/task-logo.svg"
                : "../src/assets/task-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Tasks</p>
        </Link>
      </div>
      <div className="place-self-center mb-15 hidden  lg:inline ">
        <GroupCard></GroupCard>
      </div>
    </div>
  );
};

export default SideBar;
