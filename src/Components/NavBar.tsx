import UserCard from "./UserCard";
import { useContext } from "react";
import { userDetailsContext } from "../context/authLogin";

const NavBar = () => {
  const { userDetails } = useContext(userDetailsContext);
  if (userDetails?.data?.data?.user) {
    localStorage.setItem(
      "userDetails",
      JSON.stringify(userDetails.data.data.user)
    );
  }

  let storeDetails;
  try {
    const storedData = localStorage.getItem("userDetails");
    console.log(storedData);
    storeDetails = storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error parsing user details from localStorage:", error);
    storeDetails = null;
  }

  return (
    <div className="bg-[#F2F2F2] h-[55px] w-full flex justify-between ">
      <img
        className="w-[114px] h-[36px] my-[9px] ml-[29px]"
        src="../src/assets/redlogodashboard.svg"
        alt=""
      />
      <UserCard
        username={`${storeDetails?.firstName} ${storeDetails?.lastName}`}
        role={storeDetails?.role}
      ></UserCard>
    </div>
  );
};

export default NavBar;
