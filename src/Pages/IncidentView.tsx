import { use } from "react";
import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";
import { UserDetailsContext } from "../context/AuthContext.js";
import { useParams } from "react-router-dom";

const IncidentView = () => {
  const { id } = useParams();
  const { incidentDetails } = use(UserDetailsContext);

  console.log(incidentDetails);

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
              <p className=" text-[16px] text-primary font-[600]  ">
                {`Subject: ${incidentDetails?.subject}`}
                <span className="text-[#b9b9b9] font-[600] text-[13px] ml-5 ">
                  {new Date(incidentDetails?.updatedAt).toLocaleString()}
                </span>
              </p>
              <p>{incidentDetails?.incidentMessage}</p>
              {incidentDetails.incidentphoto ? (
                <img
                  className="h-[300px] w-[200px] object-cover place-self-center"
                  src={incidentDetails.incidentphoto}
                  alt="Incident photo"
                />
              ) : (
                <div className="h-[254px] w-[319px] flex items-center justify-center text-gray-500 bg-gray-100 rounded">
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
