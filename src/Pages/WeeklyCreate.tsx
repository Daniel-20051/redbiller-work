import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import ReportCard from "../Components/ReportCard";
import AlertCard from "../messageAlert/AlertCardProps";
import { Icon } from "@iconify/react";
import { SuccessCard } from "../messageAlert/SuccessCard";
import { useState } from "react";
import { AuthApis } from "../api";
const authApis = new AuthApis();

const WeeklyCreate = () => {
  const [actionItems, setActionItems] = useState("");
  const [ongoingItems, setOngoingItems] = useState("");
  const [completedItems, setCompletedItems] = useState("");
  //loaders
  const [loading, setLoading] = useState(false);
  //alerts
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [resetCards, setResetCards] = useState(false);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };
  const showAlertMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    if (!actionItems) {
      return showAlertMessage("No Action Item Added", "error");
    }
    if (!ongoingItems) {
      return showAlertMessage("No Ongoing Task Added", "error");
    }
    if (!completedItems) {
      return showAlertMessage("No Completed Task Added", "error");
    }
    try {
      setLoading(true);
      const response: any = await authApis.submitWeeklyReport({
        actionItems: actionItems || "",
        ongoingItems: ongoingItems || "",
        completedItems: completedItems || "",
      });

      if (response.data.status === "successful" || response.status === 201) {
        setLoading(false);
        showSuccessMessage("Your report has been Recorded");
        setActionItems("");
        setOngoingItems("");
        setCompletedItems("");
        setResetCards(true);
        setTimeout(() => setResetCards(false), 100);
      }
      return response;
    } catch (error) {
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
      <SuccessCard
        message={successMessage}
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        autoClose={true}
        autoCloseTime={2000}
      />
      <NavBar></NavBar>
      <div className=" flex flex-1 w-full overflow-y-auto  max-h-[calc(100vh-55px)]  ">
        <SideBar>weekly-report</SideBar>
        <div className="flex flex-1 flex-col items-center">
          <p className="  place-self-start ml-[97px] mt-[50px] mb-[8%] font-[600] text-[20px]  ">
            Submit Weekly Reports
          </p>

          <div className=" w-[90%] justify-center gap-13 mb-6 md:flex">
            <ReportCard
              name="Action Item"
              color="bg-primary"
              onValueChange={setActionItems}
              reset={resetCards}
            />
            <ReportCard
              name="Ongoing"
              color="bg-[#B0AB51]"
              onValueChange={setOngoingItems}
              reset={resetCards}
            />
            <ReportCard
              name="Completed"
              color="bg-[#931D4E]"
              onValueChange={setCompletedItems}
              reset={resetCards}
            />
          </div>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className={` ${
              loading ? "bg-gray-400" : "bg-primary"
            } text-[16px] cursor-pointer text-white py-[7px] px-[16px] font-[500] rounded-[8px] mr-[11%] place-self-end`}
          >
            {loading ? (
              <div className="flex cursor-not-allowed justify-center items-center h-full">
                <Icon
                  icon="svg-spinners:ring-resize"
                  width="20"
                  height="20"
                  color="#ffffff"
                />
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCreate;
