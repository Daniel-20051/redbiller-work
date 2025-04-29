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
      className={`flex-col items-start justify-between lg:w-[25%] xl:w-[20%] bg-[#F2F2F2] transition-all ${
        isCollapsed
          ? "w-0 overflow-hidden  "
          : "absolute z-40 w-[50%] md:w-[40%] h-full"
      } lg:flex `}
    >
      <div className="w-full">
        <Link
          onClick={toggleCollapse}
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
                ? "/assets/home-logo-active.png"
                : "/assets/home-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Home</p>
        </Link>

        {isAdmin && (
          <Link
            onClick={toggleCollapse}
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
                  ? "/assets/users-active.svg"
                  : "/assets/users.svg"
              }
              alt=""
            />
            <p className="text-[15px] font-[500] ">Users</p>
          </Link>
        )}
        <Link
          to="/events"
          onClick={toggleCollapse}
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
                ? "/assets/event-logo-active.svg"
                : "/assets/event-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Event</p>
        </Link>
        <Link
          to="/incident-report"
          onClick={toggleCollapse}
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
                ? "/assets/incident-logo-active.svg"
                : "/assets/incident-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Incident Report</p>
        </Link>
        <Link
          to="/weekly-report"
          onClick={toggleCollapse}
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
                ? "/assets/weekly-logo-active.svg"
                : "/assets/weekly-logo.svg"
            }
            alt=""
          />
          <p className="text-[15px] font-[500] ">Weekly Report</p>
        </Link>
        <Link
          to="/home"
          onClick={toggleCollapse}
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
                ? "/assets/task-logo.svg"
                : "/assets/task-logo.svg"
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
