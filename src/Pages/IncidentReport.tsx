import { useState } from "react";
import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import IncidentItem from "../Components/IncidentItem";
import { Link } from "react-router-dom";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext.js";

const IncidentReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIncident, setActiveIncident] = useState<any>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const { userDetails, setIncidentDetails } = use(UserDetailsContext);
  const isAdmin = userDetails?.data.user.role == "admin";

  const handleIncidentSelect = (incident: any) => {
    setActiveIncident(incident);
    setIncidentDetails(incident);
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>incident-report</SideBar>
        <div className="flex flex-1 ">
          <div
            className={`flex flex-1 flex-col gap-6 ${
              isAdmin &&
              "my-[4%] mx-[3%] border-1 border-[#D9D9D9] rounded-[8px]"
            } ${activeIncident && " hidden md:flex"} `}
          >
            <div className="flex justify-between items-center px-3  mt-[24px]">
              <div>
                <p className="font-[600] text-[19px] lg:text-[23px]  ">
                  Incident Reports
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex bg-[#F2F2F2] w-[162px] px-[24px]  py-[17px] h-[35px] items-center font-[600] rounded-[8px]  ">
                  <input
                    className="w-[120px] h-[35px] outline-0  "
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <Link to="/incident-report/create">
                  <button className="w-[80px] md:[110px] lg:w-[121px] cursor-[pointer] bg-primary rounded-[8px] text-white font-[500] text-[11px] lg:text-[15px] h-[35px] ">
                    Make a report
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={`overflow-y-auto max-h-full hide-scrollbar scroll-smooth  place-self-center mb-5 w-[85%] ${
                isAdmin && "mt-4 w-[95%]"
              } `}
            >
              <IncidentItem
                searchTerm={searchTerm}
                onIncidentSelect={handleIncidentSelect}
              />
            </div>
          </div>
          <div className=" h-[full] w-[1px] bg-[#D9D9D9] "></div>
          <div
            className={`w-[49%] flex flex-col gap-8 pt-30 relative px-7 overflow-y-auto max-h-full  hide-scrollbar scroll-smooth  ${
              isAdmin && "hidden "
            } ${activeIncident ? "flex w-full md:w-[49%] " : "hidden"}`}
          >
            <button
              onClick={() => setActiveIncident(false)}
              className="flex items-center gap-2 rounded-lg absolute md:top-10 top-7 right-7 md:right-10 w-[65px] md:w-[80px] border-1 border-[#b9b9b9]
            font-[600] text-[13px] md:text-[16px] p-2 "
            >
              <img
                className="w-[8px] md:w-[10px] h-[20px] md:h-[27px]  "
                src="/assets/back.svg"
                alt=""
              />
              Back
            </button>
            {activeIncident ? (
              <>
                {/* <p className=" text-[16px] text-primary font-[600]  ">
                  {`${activeIncident?.User.firstName} ${activeIncident?.User.lastName}`}
                </p> */}
                <p className=" text-[16px] text-primary font-[600]  ">
                  {activeIncident?.subject}
                  <span className="text-[#D9D9D9] font-[600] text-[13px] ml-5 ">
                    {new Date(activeIncident?.updatedAt).toLocaleString()}
                  </span>
                </p>
                <p>{activeIncident?.incidentMessage}</p>
                {activeIncident?.incidentphoto ? (
                  <img
                    className="h-[350px] w-auto object-cover place-self-center"
                    src={activeIncident?.incidentphoto || ""}
                    alt="Incident photo"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-[254px] w-[319px] flex items-center justify-center text-gray-500 bg-gray-100 rounded">
                    No image available for this incident
                  </div>
                )}
              </>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-gray-500">
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <p className="text-lg font-medium">No Incident Selected</p>
                <p className="text-sm mt-2 text-center max-w-md">
                  Please select an incident from the list to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReport;
