import UserCard from "./UserCard";
import { use } from "react";
import { Link } from "react-router-dom";
import { UserDetailsContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

const NavBar = () => {
  const { userDetails } = use(UserDetailsContext);

  const formatName = (name?: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  const { toggleCollapse, toggleRef } = useSidebar();

  return (
    <div className="bg-[#C9C9C9] h-[55px] w-full flex justify-between">
      <div className="flex items-center">
        <div className="group flex gap-2 items-center ">
          <img
            ref={toggleRef}
            className="sidebar w-[35px] h-[35px] ml-5 lg:hidden p-2 rounded-md hover:bg-white cursor-pointer  "
            src="/assets/sidebarr-logo.svg"
            alt=""
            onClick={() => toggleCollapse()}
          />
        </div>
        <Link to="/home">
          <img
            className="w-[114px] h-[36px] my-[9px] lg:ml-7"
            src="/assets/redlogodashboard.svg"
            alt=""
          />
        </Link>
      </div>

      <UserCard
        username={`${formatName(userDetails?.data.user.firstName)}`}
        role={`${formatName(userDetails?.data.user.role)}`}
        fullName={`${formatName(userDetails?.data.user.firstName)} ${formatName(
          userDetails?.data.user.lastName
        )}`}
      ></UserCard>
    </div>
  );
};

export default NavBar;
