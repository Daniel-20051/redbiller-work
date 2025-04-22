import { useState } from "react";
import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import IncidentItem from "../Components/IncidentItem";
import { Link } from "react-router-dom";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";

const IncidentReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const { userDetails } = use(UserDetailsContext);
  const isAdmin = userDetails?.data.user.role == "admin";

  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>incident-report</SideBar>
        <div className="flex flex-1 ">
          <div className="  flex flex-1 flex-col gap-6">
            <div className="flex   justify-between items-center px-3  mt-[24px]">
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
                  <button className="w-[80px] md:[110px] lg:w-[121px] bg-primary rounded-[8px] text-white font-[500] text-[11px] lg:text-[15px] h-[35px] ">
                    Make a report
                  </button>
                </Link>
              </div>
            </div>
            <div className="overflow-y-auto max-h-full hide-scrollbar scroll-smooth  place-self-center w-[80%]  ">
              <IncidentItem searchTerm={searchTerm} />
            </div>
          </div>
          <div className=" h-[full] w-[1px] bg-[#D9D9D9] "></div>
          <div
            className={`w-[49%]  ${isAdmin ? "hidden" : "hidden  md:flex"} `}
          >
            hi
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReport;
