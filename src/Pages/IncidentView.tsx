import { use } from "react";
import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";
import { UserDetailsContext } from "../context/AuthContext.js";

const IncidentView = () => {
  const { incidentDetails } = use(UserDetailsContext);

  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>incident-report</SideBar>
        <div className="flex flex-1 relative  ">
          <Link
            to="/incident-report"
            className=" flex items-center gap-2 rounded-lg absolute md:top-10 top-4 right-5 md:right-10 w-[65px] md:w-[80px] border-1 border-[#b9b9b9]
            font-[600] text-[13px] md:text-[16px] p-2 md:p-3"
          >
            <img
              className="w-[8px] md:w-[10px] h-[20] md:h-[27px]  "
              src="/assets/back.svg"
              alt=""
            />
            Back
          </Link>
          <div className="flex flex-col w-[full] gap-4 px-15 justify-center">
            <div className="flex gap-4 items-center mb-10">
              <img
                className=" w-[55px] md:w-[75px] h-[55px] md:h-[75px] rounded-full border-2 border-primary"
                src="/assets/blank-profile.png"
                alt=""
              />
              <div className="flex flex-col text-[11px] md:text-[18px] gap-2">
                <p>
                  Name:{" "}
                  <span>{`${incidentDetails?.User?.firstName} ${incidentDetails?.User?.lastName}`}</span>
                </p>
                <p>
                  Department: <span>{incidentDetails?.User?.occupation}</span>
                </p>
                <p>
                  Biller ID: <span>{incidentDetails?.User?.email}</span>
                </p>
              </div>
            </div>
            <div className=" justify-center items-center">
              <p className="flex gap-5 items-center  text-[16px] md:text-[20px] text-primary font-[600]  ">
                {` ${incidentDetails?.subject}`}
                <span className="text-[#b9b9b9] font-[600] text-[12px]">
                  {new Date(incidentDetails?.updatedAt).toLocaleString()}
                </span>
              </p>
              <p className="text-[13px] md:text-[16px]">
                {incidentDetails?.incidentMessage}
              </p>
              {incidentDetails?.incidentphoto ? (
                <img
                  className="h-[300px] w-[200px] object-cover place-self-center mb-4"
                  src={incidentDetails?.incidentphoto}
                  alt="Incident photo"
                />
              ) : (
                <div className=" flex items-center justify-center text-gray-500 bg-gray-100 p-15 mb-4 rounded">
                  No image available for this incident
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentView;
