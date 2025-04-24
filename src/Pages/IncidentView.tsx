import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";

const IncidentView = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>incident-report</SideBar>
        <div className="flex flex-1 relative  ">
          <Link to="/incident-report">
            <img
              className="W-[17px] h-[27px] absolute top-12 right-17 "
              src="../src/assets/back.svg"
              alt=""
            />
          </Link>
          <div className="flex flex-col w-[full] gap-4 px-15 justify-center">
            <div className="flex gap-4 items-center mb-10">
              <img
                className="w-[75px] h-[75px] rounded-full border-2 border-primary"
                src="../src/assets/blank-profile.png"
                alt=""
              />
              <div className="flex flex-col gap-2">
                <p>
                  Name: <span></span>
                </p>
                <p>
                  Department: <span></span>
                </p>
                <p>
                  Biller ID: <span></span>
                </p>
              </div>
            </div>
            <p className=" text-[16px] text-primary font-[600]  ">
              Wifi network case broken
              <span className="text-[#D9D9D9] font-[600] text-[13px] ml-5 ">
                10 March
              </span>
            </p>
            <p>
                Kindly be informed that your subscription has been activated. ​
              <br />
              Please visit our online payment channels with your registered
              email address to have your subscription automatically activated
              whenever you make a payment. I sincerely apologize for our
              prolonged date of resolution. This is due to our tight schedule.
              However, our technical team will Revert if we can get an earlier
              date to resolve the issue.
            </p>
            <img
              className="h-[300px] w-[200px] object-cover place-self-center"
              src="../src/assets/wifi-report.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentView;
