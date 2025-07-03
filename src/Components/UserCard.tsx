import { useState, useRef, useEffect, use } from "react";
import { Link } from "react-router-dom";
import { UserDetailsContext } from "../context/AuthContext";

interface Props {
  username: string;
  role: string;
}

const UserCard = ({ username, role }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userDetails } = use(UserDetailsContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // let storeDetails;
  // try {
  //   const storedData = localStorage.getItem("userDetails");
  //   storeDetails = storedData ? JSON.parse(storedData) : null;
  // } catch (error) {
  //   console.error("Error parsing user details from localStorage:", error);
  //   storeDetails = null;
  // }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userDetails");
    window.location.href = "/login";
  };

  return (
    <div
      ref={dropdownRef}
      className="flex  gap-5 items-center mr-[42.61px] relative "
    >
      {/* <img
        className="w-[25px] h-[25px] "
        src="/assets/dummynot.svg"
        alt=""
      /> */}
      <img
        className="w-[35px] h-[35px] rounded-[15px]"
        src="/assets/blank-profile.png"
        alt=""
      />
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex flex-col text-left cursor-pointer"
      >
        <p className="text-[13px] md:text-[15px] font-extrabold ">{username}</p>
        <p className="text-[9px] font-[500] md:text-[11px] ">{role}</p>
      </div>
      <div>
        <img
          className="cursor-pointer"
          src="/assets/drop-icon.svg"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          alt=""
        />
      </div>
      {isOpen && (
        <div className=" flex w-[302px] h-[295px] pt-[38px] px-[29px]  flex-col bg-[#FAFAFA] rounded-[20px] z-50 absolute top-18 right-[1px] ">
          <div className="flex gap-6 items-center">
            <img
              className="w-[56px] h-[56px] ml-[15px] rounded-[50px]"
              src="/assets/blank-profile.png"
              alt=""
            />
            <div className="flex flex-col gap-1">
              <p className="font-[500] text-[12px] ">{username}</p>
              <p className="text-[#B2B2B2] font-[500] text-[12px]">
                {userDetails?.data.user.email}
              </p>
            </div>
          </div>
          <div className="outline-[1px] outline-[#7D7D7D] my-6 w-full"></div>
          <Link
            to="/profile"
            className="flex gap-3 bg-[#F2F2F2] p-[15px] rounded-[8px] hover:bg-[#d6cbcb]"
          >
            <img src="/assets/profile.svg" alt="" />
            <p className="font-[500] text-[14px] ">Profile</p>
          </Link>
          <button
            onClick={handleLogout}
            className="flex gap-2 justify-center items-center mt-[38px] "
          >
            <img src="/assets/logout-icon.svg" alt="" />
            <p className=" text-primary font-[600] text-[14px] cursor-pointer">
              Logout
            </p>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
