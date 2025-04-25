import { use } from "react";
import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";
import { UserDetailsContext } from "../context/AuthContext";

const Profile = () => {
  const { userDetails } = use(UserDetailsContext);

  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>home</SideBar>
        <div className="flex flex-1 items-center py-[30px] justify-center ">
          <div className=" flex flex-col w-[87.8%] h-[80%] md:h-full border-1 border-[#D9D9D9] pb-5 relative ">
            <div className="flex  mx-[45px] justify-between  lg:mx-[90px] my-[20px]  lg:my-[30px] items-center">
              <img
                className="border-3 border-primary rounded-full w-[70px] h-[70px] lg:w-[90px] lg:h-[90px] "
                src="../src/assets/blank-profile.png"
                alt=""
              />
              <p className="text-primary text-[17px] md:text-[19px] font-[800] ">
                PERSONAL INFORMATION
              </p>
            </div>
            <div className="flex flex-col mt-5 items-center">
              <div className="w-[80%] grid grid-cols-2 ">
                <div className="flex flex-col gap-6">
                  <p className="text-[#898A8D] font-[500] text-[14px] md:text-[1em] ">
                    Full Name
                  </p>
                  <p className="uppercase font-[500] text-[1em] md:text-[1.25em] justify-self-end">
                    {userDetails?.data.user.firstName}
                  </p>
                </div>
                <div className="flex flex-col gap-6 text-right">
                  <p className="text-[#898A8D] font-[500] text-[14px] md:text-[1em] ">
                    Department
                  </p>
                  <p className="uppercase font-[500] text-[1em] md:text-[1.25em]  ">
                    {userDetails?.data.user.occupation}
                  </p>
                </div>
              </div>
              <div className="w-[80%] grid grid-cols-2 mt-8 ">
                <div className="flex flex-col gap-6">
                  <p className="text-[#898A8D] font-[500] text-[14px] md:text-[1em] ">
                    Date of Birth
                  </p>
                  <p className=" font-[500] text-[1em] md:text-[1.25em]  ">
                    {userDetails?.data.user.dob}
                  </p>
                </div>
                <div className="flex flex-col gap-6 text-right">
                  <p className="text-[#898A8D] font-[500] text-[14px] md:text-[1em]  ">
                    Nationality
                  </p>
                  <p className="uppercase font-[500] text-[1em] md:text-[1.25em]  ">
                    {userDetails?.data.user.nationality}
                  </p>
                </div>
              </div>
              <div className="w-[80%] grid grid-cols-2  mt-8 ">
                <div className="flex  flex-col gap-6">
                  <p className="text-[#898A8D] font-[500] text-[14px] md:text-[1em] ">
                    Contact Information
                  </p>
                  <p className=" font-[500] text-[1em] md:text-[1.25em]  ">
                    {userDetails?.data.user.email}
                  </p>
                </div>
                <div className="flex flex-col gap-6 text-right">
                  <p className="text-[#898A8D] font-[500] text-[14px] md:text-[1em] ">
                    State
                  </p>
                  <p className="uppercase font-[500] text-[1em] md:text-[1.25em]  ">
                    Lagos
                  </p>
                </div>
              </div>
              <div className="w-[80%] grid grid-cols-2  mt-8 ">
                <div className="flex  flex-col gap-6">
                  <p className="text-[#898A8D] font-[500] text-[14px] md:text-[1em] ">
                    Gender
                  </p>
                  <p className="flex gap-5 uppercase font-[500] text-[1em] md:text-[1.25em]  ">
                    <img
                      className="w-[35px] h-[35px] "
                      src="../src/assets/male.svg"
                      alt=""
                    />
                    {userDetails?.data.user.gender}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
