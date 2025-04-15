import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";

interface Props {
  children: string;
}

const Home = ({ children }: Props) => {
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

        <div className="w-[76%] flex flex-col   items-center justify-center overflow-y-auto max-h-full relative hide-scrollbar scroll-smooth  ">
          <p className=" font-[600] text-[32px] mt-4 ">
            Welcome back, Mr <span>{storeDetails.firstName}</span> !
          </p>
          <div className=" flex  w-[66%] h-[305px] bg-[#F2F2F2] rounded-[15px] mt-[53px] relative ">
            <div className=" relative flex-1">
              <p className="text-[32px] font-[600] ml-[19px] mt-[19px] ">
                Upcoming event
              </p>
              <hr className="mt-[23px] ml-[26px] w-[222px] text-[#C9C9C9] " />
              <p className="text-primary text-[16px] font-[700] ml-[30px] mt-[26px] ">
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
            <div>
              <img src="../src/assets/home-design.svg" alt="" />
            </div>
          </div>
          <div className="flex gap-5 w-[66%] mt-[2.3%] mb-[20px]  justify-between">
            <div className="w-[460px] h-[286px] bg-[#F2F2F2] rounded-[15px] relative ">
              <p className="text-[32px] font-[600] ml-[19px] mt-[19px] ">
                Incident Report
              </p>
              <hr className="mt-[18px] ml-[26px] w-[222px] text-[#C9C9C9] " />
              <p className="text-primary text-[16px] font-[700] ml-[30px] mt-[20px] ">
                Compliance
              </p>
              <p className="text-[#4E4E4E] ml-[30px]  mt-[8px] text-[14px] font-[400] ">
                Ireoma wearing rubber slippers during work....
              </p>
              <p className="absolute bottom-[42px] left-[35px] text-[#898A8D] text-[14px] font-[400] ">
                Friday 07:30
              </p>
              <button className="absolute bottom-[34px] right-[46px] bg-primary text-white rounded-[10px] w-[86px] h-[34px] text-[15px] font-[400] ">
                Create
              </button>
            </div>
            <div className="w-[460px] h-[286px] bg-[#F2F2F2] rounded-[15px] relative ">
              <p className="text-[32px] font-[600] ml-[19px] mt-[19px] ">
                Weekly Report
              </p>
              <hr className="mt-[18px] ml-[26px] w-[222px] text-[#C9C9C9] " />
              <p className="text-primary text-[16px] font-[700] ml-[30px] mt-[20px] ">
                Compliance
              </p>
              <p className="text-[#4E4E4E] ml-[30px]  mt-[8px] text-[14px] font-[400] ">
                Ireoma wearing rubber slippers during work....
              </p>
              <p className="absolute bottom-[42px] left-[35px] text-[#898A8D] text-[14px] font-[400] ">
                Friday 07:30
              </p>
              <button className="absolute bottom-[34px] right-[46px] bg-primary text-white rounded-[10px] w-[86px] h-[34px] text-[15px] font-[400] ">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
