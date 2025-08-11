import { useState } from "react";
import IncidentItem from "./componets/IncidentItem";
import { Link } from "react-router-dom";
import { use } from "react";
import { UserDetailsContext } from "../../context/AuthContext.tsx";

const IncidentReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeIncident, setActiveIncident] = useState<any>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  const clearDateFilter = () => {
    setDateFilter("");
  };

  const { userDetails, setIncidentDetails } = use(UserDetailsContext);
  const isAdmin =
    userDetails?.data.user.role == "admin" ||
    userDetails?.data.user.role == "superadmin";

  const handleIncidentSelect = (incident: any) => {
    setActiveIncident(incident);
    setIncidentDetails(incident);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-55px)] ">
      <div className=" flex flex-1 w-full ">
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
                      placeholder="Search"
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
                      value={dateFilter}
                      onChange={handleDateChange}
                    />
                  )}
                  {isAdmin && dateFilter && (
                    <button
                      onClick={clearDateFilter}
                      className="h-[35px] px-2 bg-red-500 text-white rounded-[4px] ml-1 hover:bg-red-600 transition-colors"
                      title="Clear date filter"
                    >
                      ✕
                    </button>
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
                dateFilter={dateFilter}
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
              className="flex cursor-pointer items-center gap-2 rounded-lg absolute md:top-10 top-7 right-7 md:right-10 w-[65px] md:w-[80px] border-1 border-[#b9b9b9]
            font-[600] text-[13px] md:text-[16px] p-2 "
            >
              <img
                className="w-[8px]  md:w-[10px] h-[20px] md:h-[27px]  "
                src="/assets/back.svg"
                alt=""
              />
              Back
            </button>
            {activeIncident ? (
              <>
                <p className="text-primary font-semibold text-lg tracking-tight mb-1">
                  {activeIncident?.subject}
                  <span className="ml-3 text-xs text-gray-400 font-medium px-2 py-1 bg-gray-100 rounded-full">
                    {new Date(activeIncident?.updatedAt).toLocaleString(
                      undefined,
                      {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </p>
                {activeIncident?.voiceNote && (
                  <audio
                    className="mt-3 mb-3 md:mt-0 md:mb-0"
                    controls
                    src={activeIncident?.voiceNote}
                  />
                )}

                <p className="text-gray-700 mb-4">
                  {activeIncident?.incidentMessage}
                </p>

                {activeIncident?.incidentphoto ? (
                  <div className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-r from-gray-50 to-gray-100 p-1 max-w-2xl mx-auto">
                    <div className="overflow-hidden rounded-lg">
                      <img
                        className="h-[40vh] w-full object-contain transform hover:scale-[1.02] transition-transform duration-300"
                        src={activeIncident?.incidentphoto || ""}
                        alt="Incident photo"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-[254px] w-full max-w-md mx-auto flex flex-col items-center justify-center text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-2 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="font-medium">
                      No image available for this incident
                    </p>
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
