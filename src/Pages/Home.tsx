import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";

const Home = () => {
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
    <div className="flex flex-col  h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full relative max-h-[calc(100vh-55px)]">
        <SideBar>home</SideBar>

        <div className=" flex flex-col gap-10 flex-1 mb-8 items-center justify-center overflow-y-auto max-h-full relative hide-scrollbar scroll-smooth  ">
          <p className=" font-[600] text-[24px] md:text-[32px] mt-4  ">
            Welcome back, Mr <span>{storeDetails?.firstName}</span> !
          </p>
          <div className=" flex w-[80%] h-[39.5%] bg-[#F2F2F2] rounded-[15px] pt-5 relative ">
            <div className=" relative flex-1">
              <p className="text-[24px] md:text-[32px] font-[600] ml-[19px]  ">
                Upcoming event
              </p>
              <div className="mt-[23px] ml-[26px] w-[150px] md:w-[222px] border-1 border-[#C9C9C9] "></div>
              <p className="text-primary text-[16px] font-[700] ml-[30px] mt-[20px] ">
                Product Meeting
              </p>
              <p className="text-[#4E4E4E] ml-[30px]  mt-[8px] text-[14px] font-[400] ">
                Lorem ipsum dolor sit amet consectetur ipsum dolor sit amet
                ipsum dolor sit amet consectetur ipsum dolor sit ame ipsum dolor
                sit amet consectetur.
              </p>
              <div className="flex gap-1 absolute bottom-[25px] left-[40px] text-[14px] font-[400] text-[#4E4E4E] ">
                <img src="../src/assets/MapPin.svg" alt="" />
                <p>Conference Room</p>
              </div>
              <p className="absolute right-[21px] bottom-[25px] text-[14px] font-[400] text-[#4E4E4E]">
                Wednesday
              </p>
            </div>
            <div className="hidden md:inline">
              <img
                className="h-full"
                src="../src/assets/home-design.svg"
                alt=""
              />
            </div>
          </div>
          <div className=" md:flex gap-5 w-[80%] h-[37%] mb-[20px]  justify-between">
            <div className=" w-full md:w-[47%] h-full bg-[#F2F2F2] rounded-[15px] mb-8 pt-5  relative ">
              <p className=" text-[24px] md:text-[32px] font-[600] ml-[19px]  ">
                Incident Report
              </p>
              <div className="mt-[23px] ml-[26px] w-[150px] md:w-[222px] border-1 border-[#C9C9C9] "></div>
              <p className="text-primary text-[16px] font-[700] ml-[30px] mt-[20px] ">
                Compliance
              </p>
              <p className="text-[#4E4E4E] ml-[30px]  mt-[8px] text-[14px] font-[400] ">
                Ireoma wearing rubber slippers during work....
              </p>
              <p className="absolute bottom-[42px] left-[35px] text-[#898A8D] text-[14px] font-[400] ">
                Friday 07:30
              </p>
              <Link to="/incident-report/create">
                <button className="absolute bottom-[34px] right-[46px] bg-primary text-white rounded-[10px] w-[86px] h-[34px] text-[15px] font-[400] ">
                  Create
                </button>
              </Link>
            </div>
            <div className="w-full md:w-[47%]  h-full bg-[#F2F2F2] rounded-[15px] pt-5  relative ">
              <p className="text-[24px] md:text-[32px] font-[600] ml-[19px]  ">
                Weekly Report
              </p>
              <div className="mt-[23px] ml-[26px] w-[150px] md:w-[222px] border-1 border-[#C9C9C9] "></div>
              <p className="text-primary text-[16px] font-[700] ml-[30px] mt-[20px] ">
                Compliance
              </p>
              <p className="text-[#4E4E4E] ml-[30px]  mt-[8px] text-[14px] font-[400] ">
                Ireoma wearing rubber slippers during work....
              </p>
              <p className="absolute bottom-[42px] left-[35px] text-[#898A8D] text-[14px] font-[400] ">
                Friday 07:30
              </p>
              <Link to="/weekly-report/create">
                <button className="absolute bottom-[34px] right-[46px] bg-primary text-white rounded-[10px] w-[86px] h-[34px] text-[15px] font-[400] ">
                  Create
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
