import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
const currentDate = new Date();
import { useRef, useState } from "react";
import AlertCard from "../messageAlert/AlertCardProps";
import { AuthApis } from "../api";
const authApis = new AuthApis();

const IncidentCreate = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textAreaValue, setTextAreaValue] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [incidentResponse, setIncidentResponse] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  console.log(incidentResponse);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const showAlertMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };
  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextAreaValue(newValue);
  };
  const handleSubject = (e: any) => {
    const newValue = e.target.value;
    setSubject(newValue);
  };

  const sendReport = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    if (!textAreaValue || !subject) {
      return showAlertMessage("Empty message field", "error");
    }
    try {
      setLoading(true);
      const response = await authApis.submitIncidentReport({
        message: textAreaValue || "",
        subject: subject || "",
        photo: selectedFile as File,
      });
      setIncidentResponse(response);
      setLoading(false);
      showAlertMessage("Incident report submitted successfully", "success");
      setTextAreaValue(null);
      setSubject("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return response;
    } catch (error) {
      console.log(error);
      showAlertMessage("An error occurred while sending report", "error");
      return error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AlertCard
        message={alertMessage}
        type={alertType}
        isOpen={showAlert}
        onClose={handleCloseAlert}
        autoClose={true}
        autoCloseTime={3000}
      />
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full max-h-[calc(100vh-55px)] ">
        <SideBar>incident-report</SideBar>
        <div className="flex flex-1 items-center justify-center relative ">
          {/* <Link
            to="/incident-report"
            className="flex items-center gap-2 rounded-lg absolute md:top-5 top-2 left-7 md:left-10 w-[65px] md:w-[80px] border-1 border-[#b9b9b9]
            font-[600] text-[13px] md:text-[16px] p-2 "
          >
            <img
              className="w-[8px] md:w-[10px] h-[20px] md:h-[27px]  "
              src="/assets/back.svg"
              alt=""
            />
            Back
          </Link> */}
          <div className="w-[87.8%] h-[85%] md:h-[81%] border-1 border-[#D9D9D9] relative ">
            <p className="font-[600] text-[13px] text-[#898A8D] absolute right-2 md:right-[62px] top-2 md:top-[22px]">
              {currentDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex flex-col items-center justify-center h-full ">
              <p className=" text-[24px] md:text-[48px] font-[700] text-primary ">
                Incident Report
              </p>
              <form
                onSubmit={sendReport}
                className="w-[69%] text-left mt-[15px]  "
              >
                <p className="font-[400] text-[17px] md:text-[20px] mb-[11px] ">
                  Reason for Complaints
                </p>
                <div className="w-full ">
                  <input
                    onChange={handleSubject}
                    value={subject}
                    type="text"
                    className=" border-1 p-2 w-full text-sm rounded-t-[5px] border-[#CCCCCC] focus:outline-0"
                    name=""
                    placeholder="Subject"
                  />
                  <textarea
                    onChange={handleTextArea}
                    value={textAreaValue || ""}
                    className="resize-none p-[20px] w-full h-[35vh] border-[1px] border-t-0 rounded-b-[5px] border-[#CCCCCC] focus:outline-0"
                    name=""
                    id=""
                  ></textarea>
                </div>
                <div className="md:flex justify-between mt-[15px]">
                  <input
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                    type="file"
                  />
                  <button
                    type="button"
                    className=" flex cursor-pointer justify-between items-center border-1 border-[#E7E3E3] rounded-[8px] w-full md:w-auto px-[14px] h-auto py-[10px] "
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className="text-[#817979] font-[400] text-[14px] mx-[17px] max-w-[200px] overflow-x-auto whitespace-nowrap hide-scrollbar scroll-smooth ">
                      {selectedFile ? selectedFile.name : "Upload"}
                    </p>
                    <img
                      className="ml-[30px] mr-[11px] "
                      src="/assets/upload.svg"
                      alt=""
                    />
                  </button>

                  <button
                    disabled={loading}
                    type="submit"
                    className={
                      loading
                        ? "bg-[#6b6b6b] w-full md:w-auto h-auto px-[16px] py-[6.5px] mt-2 text-white rounded-[8px]"
                        : "w-full md:w-auto h-auto px-[16px] py-[6.5px] mt-2 text-white cursor-[pointer] bg-primary rounded-[8px]"
                    }
                  >
                    {loading ? (
                      <p className=" cursor-not-allowed">loading...</p>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentCreate;
