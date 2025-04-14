import UserCard from "../Components/UserCard";
import SideBar from "../Components/SideBar";
import NavBar from "../Components/NavBar";

const Profile = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>home</SideBar>
        <div className="w-[76%] flex items-center py-[30px] justify-center ">
          <div className=" flex flex-col w-[87.8%] h-full  border-1 border-[#D9D9D9] pb-5 relative ">
            <div className="flex gap-[103px] mx-[100px] my-[43px] items-center">
              <img
                className="border-3 border-primary rounded-full w-[110px] h-[110px] "
                src="https://s3-alpha-sig.figma.com/img/fd3d/4c48/a8b689cbbfb343fe22651fcb4dc1c2e0?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=RzuYUaaUJ2V6YfLoqXQc1e0FKNbkeE-g18gzUpYVc3YuPFwrJrewPPqXLl8Z57~PIntsw~XXbcOMXwrqXC9KymfowzFLLS65UB~vuTAWeTDpLyJhNpFy9fGebt53XBarZR3IPCLYL~We3N9q8H4ogTzzK5tbjCiATKkE7Yetp4obITXIcE1O5hhABtfeQht-jZ-SoEhOJTJ4~GCezOpc-fxAFO-zvy735yavzfczIzzTxkTaG~pS~lsuAhmnBRZataviJ8Z3N~rQCpQFYVQcEzQiUzhOhGweGsnZc0e6y~aLUYcq4ckiZ2UYDayosBM~n7h3Mwr4nlmOsCnBfxisFg__"
                alt=""
              />
              <p className="text-primary text-[20px] font-[800] ">
                PERSONAL INFORMATION
              </p>
            </div>
            <div className="flex flex-col mt-[33px] items-center">
              <div className="flex w-[80%]  justify-between">
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[1em] ">
                    Full Name
                  </p>
                  <p className="uppercase font-[500] text-[1.25em] ">
                    Kelechi Onmusoro
                  </p>
                </div>
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[16px] ">
                    Department
                  </p>
                  <p className="uppercase font-[500] text-[20px] ">Student</p>
                </div>
              </div>
              <div className="flex w-[80%] mt-8 justify-between">
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[16px] ">
                    Date of Birth
                  </p>
                  <p className=" font-[500] text-[20px] ">2002-12-12</p>
                </div>
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[16px] ">
                    Nationality
                  </p>
                  <p className="uppercase font-[500] text-[20px] ">NIGERIAN</p>
                </div>
              </div>
              <div className="flex w-[77%] mt-8 justify-between">
                <div className="flex -ml-[1.5%] flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[16px] ">
                    Contact Information
                  </p>
                  <p className=" font-[500] text-[20px] ">
                    kelechidaniel122@gmail.com
                  </p>
                </div>
                <div className="flex flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[16px] ">
                    State
                  </p>
                  <p className="uppercase font-[500] text-[20px] ">Lagos</p>
                </div>
              </div>
              <div className="flex w-[77%] mt-8 justify-between">
                <div className="flex -ml-[1.5%] flex-col gap-9">
                  <p className="text-[#898A8D] font-[500] text-[16px] ">
                    Gender
                  </p>
                  <p className="flex gap-6 uppercase font-[500]  text-[20px] ">
                    <img
                      className="w-[35px] h-[35px] "
                      src="../src/assets/male.svg"
                      alt=""
                    />
                    male
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
