import ReportCard from "../../Components/ReportCard";
import AlertCard from "../../messageAlert/AlertCardProps";
import { Icon } from "@iconify/react";
import { SuccessCard } from "../../messageAlert/SuccessCard";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthApis } from "../../api";
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
    if (!actionItems || actionItems === "//" || actionItems === "////") {
      return showAlertMessage("No Action Item Added", "error");
    }
    if (!ongoingItems || ongoingItems === "//" || ongoingItems === "////") {
      return showAlertMessage("No Ongoing Task Added", "error");
    }
    if (
      !completedItems ||
      completedItems === "//" ||
      completedItems === "////"
    ) {
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
    <div className=" flex flex-1 w-full overflow-y-auto h-[calc(100vh-55px)]  ">
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

      <div className="flex flex-1 flex-col items-center relative">
        <Link to="/weekly-report">
          <div className="flex gap-4 absolute top-5 md:top-5 left-[40px] items-center ">
            <img
              className="w[9.14px] h-[16.17px] "
              src="/assets/back.svg"
              alt=""
            />
            <p className="font-[800] text-[13px] md:text-[16px] ">
              Weekly Report
            </p>
          </div>
        </Link>
        <p className="  t ml-[97px] mt-[50px] mb-[5%] font-[600] text-[24px]  ">
          New Report
        </p>

        <div className=" w-[90%] justify-center gap-13 mb-6 md:flex ">
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
  );
};

export default WeeklyCreate;
