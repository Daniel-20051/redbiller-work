import { Link } from "react-router-dom";
import GroupCard from "./GroupCard";
import { useState } from "react";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";

interface Props {
  children?: string;
}

const SideBar = ({ children }: Props) => {
  const { userDetails } = use(UserDetailsContext);
  const [isAdmin, setIsAdmin] = useState(false);
  if (userDetails?.data.user.role === "admin") {
    setIsAdmin(true);
  }

  return (
    <div className=" flex flex-col items-start justify-between w-[18%] bg-[#D6CBCB]  ">
      <div className="w-full">
        <Link
          to="/home"
          className={
            children === "home"
              ? "text-white  flex w-full h-[65px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[65px] font-bold gap-3 items-center "
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
        <Link
          to="/events"
          className={
            children === "event"
              ? "text-white  flex w-full h-[65px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[65px] font-bold gap-3 items-center "
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
        {isAdmin && (
          <Link
            to="/users"
            className={
              children === "users"
                ? "text-white  flex w-full h-[65px] font-bold bg-primary gap-3 items-center "
                : "text-black  flex w-full h-[65px] font-bold gap-3 items-center "
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
          to="/incident-report"
          className={
            children === "incident-report"
              ? "text-white  flex w-full h-[65px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[65px] font-bold gap-3 items-center "
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
              ? "text-white  flex w-full h-[65px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[65px] font-bold gap-3 items-center "
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
              ? "text-white  flex w-full h-[65px] font-bold bg-primary gap-3 items-center "
              : "text-black  flex w-full h-[65px] font-bold gap-3 items-center "
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
      <div className="place-self-center mb-15 ">
        <GroupCard></GroupCard>
      </div>
    </div>
  );
};

export default SideBar;
