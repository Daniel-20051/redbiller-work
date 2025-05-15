// import { useEffect } from "react";
import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const EventInfo = () => {
  const { id } = useParams();
  console.log(id);

  // useEffect(() => {
  //   const fetchEvent = async () => {
  //     const response = await authApis.getEvent(id);
  //     console.log(response);
  //   };
  //   fetchEvent();
  // }, [id]);
  return (
    <div className="flex flex-col h-screen ">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)] ">
        <SideBar>event</SideBar>

        <div className="w-[76%] flex flex-col  items-center overflow-y-auto max-h-full relative">
          <div>
            <Link to="/events">
              <div className="flex gap-4 absolute top-[55px] left-[40px] items-center ">
                <img
                  className="w[9.14px] h-[16.17px] "
                  src="/assets/back.svg"
                  alt=""
                />
                <p className="font-[800] text-[16px] ">Event</p>
              </div>
            </Link>
            <div className="mt-[85px] ">
              <p className="font-[700] text-[36px] text-center ">
                Event Details
              </p>

              <div className="flex mt-[81px] items-start ">
                <img
                  className="w-[18px] h-[19.5px] mr-[35px] "
                  src="/assets/Calendar.svg"
                  alt=""
                />
                <div className="flex flex-col -mt-[5px]  ">
                  <div className="flex gap-8 items-center">
                    <p className="font-[700] text-[#959595] text-[20px] ">
                      Redbiller Dinner
                    </p>
                    <p className="text-[#C9C9C9] text-[14px] font-[400] ">
                      35 mins ago
                    </p>
                  </div>
                  <p className="font-[500] mt-[11px] text-[16px] text-[#959595] ">
                    Saturday , 24 jan 2025
                  </p>
                  <p className="font-[500] mt-[4px] text-[16px] text-[#959595] ">
                    From 4PM to 5PM
                  </p>
                  <p className="font-[400] w-[651px] mt-[20px] text-[16px] text-[#4E4E4E] ">
                    Lorem ipsum dolor sit amet consectetur ipsum dolor sit amet
                    ipsum dolor sit amet consectetur ipsum dolor sit ame ipsum
                    dolor sit amet consectetur.
                  </p>
                  <div className="bg-[#C9C9C9] w-[655px] h-[171px] rounded-[14px] mt-[75px] "></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
