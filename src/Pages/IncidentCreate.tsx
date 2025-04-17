import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import DropDown from "../Components/DropDown";
const currentDate = new Date();
import { useRef, useState } from "react";

const IncidentCreate = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>incident-report</SideBar>
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-[87.8%] h-[85%] md:h-[81%] border-1 border-[#D9D9D9] relative ">
            <p className="font-[600] text-[13px] text-[#898A8D] absolute right-[62px] top-[22px]">
              {currentDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex flex-col items-center justify-center h-full ">
              <p className=" text-[30px] md:text-[48px] font-[700] text-primary ">
                Incident Report
              </p>
              <div className="w-[69%] text-left mt-[15px]  ">
                <p className="font-[400] text-[17px] md:text-[20px] mb-[11px] ">
                  Reason for Complaints
                </p>
                <div className="w-full ">
                  <DropDown></DropDown>
                  <textarea
                    className="resize-none p-[20px] w-full h-[337px] border-[1px] border-t-0 rounded-b-[5px] border-[#CCCCCC] focus:outline-0"
                    name=""
                    id=""
                  ></textarea>
                </div>
                <div className="md:flex justify-between mt-[15px]">
                  <input
                    className="hidden "
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                    type="file"
                  />
                  <button
                    className=" flex justify-between items-center border-1 border-[#E7E3E3] rounded-[8px] w-full md:w-auto px-[14px] h-auto py-[10px] "
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className="text-[#817979] font-[400] text-[14px] mx-[17px] max-w-[200px] overflow-x-auto whitespace-nowrap hide-scrollbar scroll-smooth ">
                      {selectedFile ? selectedFile.name : "Upload"}
                    </p>
                    <img
                      className="ml-[30px] mr-[11px] "
                      src="../src/assets/upload.svg"
                      alt=""
                    />
                  </button>

                  <button className="w-full md:w-auto h-auto px-[16px] py-[6.5px] mt-2 text-white bg-primary rounded-[8px] ">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentCreate;
