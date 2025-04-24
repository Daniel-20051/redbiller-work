import UserCard from "./UserCard";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

const NavBar = () => {
  const { userDetails } = use(UserDetailsContext);

  const formatName = (name?: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  const { isCollapsed, toggleCollapse, toggleRef } = useSidebar();

  return (
    <div className="bg-[#F2F2F2] h-[55px] w-full flex justify-between ">
      <div className="flex items-center ">
        <div className="group flex gap-2 items-center ">
          <img
            ref={toggleRef}
            className="sidebar w-[35px] h-[35px] ml-5 lg:hidden p-2 rounded-md hover:bg-white cursor-pointer  "
            src="../src/assets/sidebarr-logo.svg"
            alt=""
            onClick={() => toggleCollapse()}
          />
          <div className=" absolute top-15 left-2 hidden group-hover:block bg-[#f2f2f2] px-3 py-2 rounded-md z-50 ">
            <p className="text-xs font-[700]">
              {isCollapsed ? "Open Sidebar" : "Close Sidebar"}
            </p>
          </div>
        </div>
        <img
          className="w-[114px] h-[36px] my-[9px] lg:ml-7"
          src="../src/assets/redlogodashboard.svg"
          alt=""
        />
      </div>

      <UserCard
        username={`${formatName(userDetails?.data.user.firstName)} ${formatName(
          userDetails?.data.user.lastName
        )}`}
        role={userDetails?.data.user.role}
      ></UserCard>
    </div>
  );
};

export default NavBar;
