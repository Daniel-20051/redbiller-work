import { use, useState } from "react";
import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Link } from "react-router-dom";
import { UserDetailsContext } from "../context/AuthContext.js";

const IncidentView = () => {
  const { incidentDetails } = use(UserDetailsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen ">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>incident-report</SideBar>
        <div className="flex flex-1 relative overflow-y-auto max-h-full  hide-scrollbar scroll-smooth pt-10 md:pt-15 ">
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
          <div className="flex flex-col w-[full] gap-2 md:gap-4  px-5 md:px-15 ">
            <div className="flex gap-4 items-center mb-10">
              <img
                className=" w-[55px] md:w-[75px] h-[55px] md:h-[75px] rounded-full border-2 border-primary"
                src="/assets/blank-profile.png"
                alt=""
              />
              <div className="flex flex-col text-[11px] md:text-[15px] gap-2">
                <p>
                  Name:{" "}
                  <span>{`${
                    incidentDetails?.User?.firstName?.charAt(0).toUpperCase() +
                    incidentDetails?.User?.firstName?.slice(1).toLowerCase()
                  } ${
                    incidentDetails?.User?.lastName?.charAt(0).toUpperCase() +
                    incidentDetails?.User?.lastName?.slice(1).toLowerCase()
                  }`}</span>
                </p>
                <p>
                  Department:{" "}
                  <span>
                    {incidentDetails?.User?.occupation
                      ?.charAt(0)
                      .toUpperCase() +
                      incidentDetails?.User?.occupation?.slice(1).toLowerCase()}
                  </span>
                </p>
                <p>
                  Biller ID: <span>{incidentDetails?.User?.email}</span>
                </p>
              </div>
            </div>
            <div className=" justify-center items-center">
              <div className="md:flex gap-3 md:gap-7 items-center">
                <p className="flex gap-5 items-center  text-[16px] md:text-[20px] text-primary font-[600]  ">
                  {` ${incidentDetails?.subject}`}
                  <span className="text-[#b9b9b9] font-[600] text-[12px]">
                    {new Date(incidentDetails?.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </p>
                {incidentDetails?.voiceNote && (
                  <audio
                    className="mt-3 mb-3 md:mt-0 md:mb-0"
                    controls
                    src={incidentDetails?.voiceNote}
                  />
                )}
              </div>
              <p className="text-[13px] md:text-[16px]">
                {incidentDetails?.incidentMessage}
              </p>
              {incidentDetails?.incidentphoto ? (
                <div className="relative group h-[40vh] w-full max-w-3xl mx-auto mt-8 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    src={incidentDetails?.incidentphoto}
                    loading="lazy"
                    alt="Incident photo"
                    onClick={() => setIsModalOpen(true)}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/fallback-image-path.jpg";
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <span className="text-white px-4 py-3 font-medium">
                      View full image
                    </span>
                  </div>

                  {isModalOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <div className="relative max-w-[35vw] max-h-[90vh] self-center transform transition-all duration-500 scale-95 animate-fadeIn">
                        <img
                          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                          src={incidentDetails?.incidentphoto}
                          alt="Incident photo"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 transition-colors"
                          onClick={() => setIsModalOpen(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
