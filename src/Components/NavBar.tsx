import UserCard from "./UserCard";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";

const NavBar = () => {
  const { userDetails } = use(UserDetailsContext);
  // if (userDetails?.data.user) {
  //   localStorage.setItem("userDetails", JSON.stringify(userDetails.data.user));
  // }

  // let storeDetails;
  // try {
  //   const storedData = localStorage.getItem("userDetails");
  //   console.log(storedData);
  //   storeDetails = storedData ? JSON.parse(storedData) : null;
  // } catch (error) {
  //   console.error("Error parsing user details from localStorage:", error);
  //   storeDetails = null;
  // }

  const formatName = (name?: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="bg-[#F2F2F2] h-[55px] w-full flex justify-between ">
      <img
        className="w-[114px] h-[36px] my-[9px] ml-[29px]"
        src="../src/assets/redlogodashboard.svg"
        alt=""
      />
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
