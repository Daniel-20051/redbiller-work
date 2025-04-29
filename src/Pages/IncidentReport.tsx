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
            className={`flex flex-1 flex-col my-15 items-center ${
              isAdmin &&
              "my-[4%] mx-[3%] border-1  border-[#D9D9D9] rounded-[8px]"
            } ${activeIncident && " hidden md:flex"} `}
          >
            <div
              className={`flex items-center justify-between w-[95%]  ${
                isAdmin && "flex-col gap-3 md:gap-6 py-3 items-start w-[95%]"
              }`}
            >
              <div>
                <p className="font-[600] text-[19px] lg:text-[24px]  ">
                  Incident Report
                </p>
              </div>
              <div
                className={`flex  gap-3 ${
                  isAdmin && " w-full justify-between"
                }`}
              >
                <div className="flex py-[17px] h-[35px] items-center font-[600]   ">
                  <input
                    className={`w-[120px] h-[35px] px-4 bg-[#F2F2F2] rounded-[8px]  outline-0 ${
                      isAdmin && "hidden"
                    } `}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {isAdmin && (
                    <input
                      className={` h-[35px] px-4  rounded-l-[8px] 
                        outline-1 bg-white w-[115px] md:w-[170px]  outline-[#E7E3E3]
                      `}
                      type="text"
                      placeholder="Biller ID"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  )}
                  {isAdmin && (
                    <div className="bg-[#E7E3E3] w-[12px] py-[18.5px] "></div>
                  )}
                  {isAdmin && (
                    <input
                      className={` h-[35px] px-4  rounded-r-[8px] 
                        outline-1 bg-white w-[115px] md:w-[170px]  outline-[#E7E3E3]
                      `}
                      type="date"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  )}
                </div>
                <Link to="/incident-report/create">
                  <button className="w-[80px] md:[110px] lg:w-[121px] cursor-[pointer] bg-primary rounded-[8px] text-white font-[500] text-[11px] lg:text-[15px] h-[35px] ">
                    Make a report
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={`flex flex-1 justify-center pt-10 overflow-y-auto max-h-full hide-scrollbar scroll-smooth  w-[95%] ${
                isAdmin && "w-full bg-[#FBFBFB] "
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
                    className="h-[40vh] w-[30vw] object-contain place-self-center"
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
