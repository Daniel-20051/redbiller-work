import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import ReportCard from "../Components/ReportCard";

const WeeklyCreate = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)]  ">
        <SideBar>weekly-report</SideBar>
        <div className="flex flex-1 flex-col items-center">
          <p className="  place-self-start ml-[97px] mt-[70px] mb-[8%] font-[600] text-[20px]  ">
            Submit Weekly Reports
          </p>

          <div className=" w-[90%] justify-center gap-13 mb-6  md:flex">
            <ReportCard name="Action Item" color="bg-primary"></ReportCard>
            <ReportCard name="Ongoing" color="bg-[#B0AB51] "></ReportCard>
            <ReportCard name="Completed" color="bg-[#931D4E]"></ReportCard>
          </div>
          <button className="bg-primary text-[16px]  text-white py-[7px] px-[16px] font-[500] rounded-[8px] mr-[11%] place-self-end">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCreate;
