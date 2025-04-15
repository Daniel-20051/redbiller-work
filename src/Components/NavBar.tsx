import UserCard from "./UserCard";
import { useContext } from "react";
import { userDetailsContext } from "../context/authLogin";

const NavBar = () => {
  const { userDetails } = useContext(userDetailsContext);

  console.log(userDetails);

  return (
    <div className="bg-[#F2F2F2] h-[55px] w-full flex justify-between ">
      <img
        className="w-[114px] h-[36px] my-[9px] ml-[29px]"
        src="../src/assets/redlogodashboard.svg"
        alt=""
      />
      <UserCard
        username={`${userDetails.data?.data.user.firstName} ${userDetails.data?.data.user.lastName}`}
        role={userDetails.data?.data.user.role}
      ></UserCard>
    </div>
  );
};

export default NavBar;
