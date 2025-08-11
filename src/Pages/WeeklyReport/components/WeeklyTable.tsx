import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AuthApis } from "../../../api";
import Modal from "../../../Components/Modal";
import { SuccessCard } from "../../../messageAlert/SuccessCard";

const authApis = new AuthApis();

function getWeekRange(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  // Saturday is 6 days after Monday
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  // Set Saturday 8pm
  const saturday8pm = new Date(saturday);
  saturday8pm.setHours(18, 0, 0, 0);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const format = (d: Date) =>
    `${d.getDate()}${
      ["th", "st", "nd", "rd"][d.getDate() % 10 > 3 ? 0 : d.getDate() % 10]
    } ${d.toLocaleString("default", { month: "short" })}`;

  return {
    startDate: format(monday),
    endDate: format(friday),
    saturday8pm,
  };
}

interface Props {
  selectedUser: number;
  searchTerm: string;
}

const WeeklyTable: React.FC<Props> = ({ selectedUser, searchTerm }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionItem, setActionItem] = useState("");
  const [ongoing, setOngoing] = useState("");
  const [completed, setCompleted] = useState("");
  const [actionItemId, setActionItemId] = useState("");
  const [ongoingTaskId, setOngoingTaskId] = useState("");
  const [completedTaskId, setCompletedTaskId] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: any = await authApis.getAllReports();
        setReports(response.data.data);
        setIsLoading(false);
      } catch (error) {
        // showAlertMessage("An error occurred while sending report", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isEditModalOpen]);
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  useEffect(() => {
    const filtered = reports
      .filter((row) => row.userId === selectedUser)
      .filter((row) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        const actionItems =
          row.ActionItems?.[0]?.description?.toLowerCase() || "";
        const ongoingTasks =
          row.OngoingTasks?.[0]?.description?.toLowerCase() || "";
        const completedTasks =
          row.CompletedTasks?.[0]?.description?.toLowerCase() || "";

        return (
          actionItems.includes(searchLower) ||
          ongoingTasks.includes(searchLower) ||
          completedTasks.includes(searchLower)
        );
      });

    setFilteredReports(filtered);
  }, [reports, selectedUser, searchTerm]);

  const handleUpdate = async () => {
    if (isEditLoading) return;
    try {
      setIsEditLoading(true);
      const response: any = await authApis.updateWeeklyReport(selectedUser, {
        actionItemsId: actionItemId,
        actionItemsdescription: actionItem,
        ongoingTaskId: ongoingTaskId,
        ongoingTaskdescription: ongoing,
        completedTaskId: completedTaskId,
        completedTaskdescription: completed,
      });
      if (response.status === 200) {
        setIsEditLoading(false);
        setIsEditModalOpen(false);
        setSuccessMessage("Report updated successfully");
        setShowSuccess(true);
      }
    } catch (error) {
    } finally {
      setIsEditLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto bg-white">
      {isLoading ? (
        <div className={`flex justify-center items-center h-[55vh] `}>
          <Icon
            icon="svg-spinners:ring-resize"
            width="30"
            height="30"
            color="#93221D"
          />
        </div>
      ) : (
        <table className="min-w-full table-auto ">
          <thead>
            <tr className="bg-[#D6CBCB]">
              <th className="px-4 py-4 text-center border-r-1 text-[14px] md:text-[17px] border-[#F2F2F2] font-normal">
                Week
              </th>
              <th className="px-4 py-4 text-left border-1 text-[14px] md:text-[17px] border-[#F2F2F2] font-normal">
                Action Item
              </th>
              <th className="px-4 py-4 text-left border-1 text-[14px] md:text-[17px] border-[#F2F2F2] font-normal">
                Ongoing
              </th>
              <th className="px-4 py-4 text-left border-1 text-[14px] md:text-[17px] border-[#F2F2F2] font-normal">
                Completed
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              filteredReports.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100 ">
                  <td className="md:px-4 md:py-4 text-center text-[12px]  md:text-[15px] border-1 border-[#F2F2F2]">
                    {getWeekRange(row.createdAt).startDate} -{" "}
                    {getWeekRange(row.createdAt).endDate}
                    {(() => {
                      const { saturday8pm } = getWeekRange(row.createdAt);
                      const createdAtDate = new Date(row.createdAt);
                      if (createdAtDate > saturday8pm) {
                        return (
                          <div>
                            <span
                              className="md:hidden ml-2 px-2  py-[1px] md:py-1 bg-red-500 text-white text-[8px] md:text-xs rounded font-semibold align-middle"
                              title="Submitted late"
                            >
                              Late
                            </span>
                            <div
                              className=" hidden md:block ml-2 px-2  py-[1px] md:py-1 bg-red-500 text-white text-[8px] md:text-xs rounded font-semibold align-middle"
                              title="Submitted late"
                            >
                              Late
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </td>
                  <td className="md:px-4 md:py-4 text-[12px] md:text-[15px]  border-1 border-[#F2F2F2]">
                    <ul className="list-disc pl-5">
                      {row.ActionItems &&
                        Array.isArray(row.ActionItems) &&
                        row.ActionItems.length > 0 &&
                        row.ActionItems[0].description
                          .split("\n")
                          .map((desc: string, i: number) =>
                            desc.trim() ? <p key={i}>{desc.trim()}</p> : null
                          )}
                    </ul>
                  </td>
                  <td className="md:px-4 md:py-4 text-[12px] md:text-[15px] border-1 border-[#F2F2F2]">
                    <ul className="list-disc pl-5">
                      {row.OngoingTasks &&
                        Array.isArray(row.OngoingTasks) &&
                        row.OngoingTasks.length > 0 &&
                        row.OngoingTasks[0].description
                          .split("\n")
                          .map((desc: string, i: number) =>
                            desc.trim() ? <p key={i}>{desc.trim()}</p> : null
                          )}
                    </ul>
                  </td>
                  <td className="md:px-4 md:py-4 text-[12px] md:text-[15px] border-1 border-[#F2F2F2] relative">
                    <ul className=" flex gap-2 list-disc pl-5">
                      <p>
                        {row.CompletedTasks &&
                          Array.isArray(row.CompletedTasks) &&
                          row.CompletedTasks.length > 0 &&
                          row.CompletedTasks[0].description
                            .split("\n")
                            .map((desc: string, i: number) =>
                              desc.trim() ? <p key={i}>{desc.trim()}</p> : null
                            )}{" "}
                      </p>
                      <button
                        className="md:block hidden cursor-pointer place-items-end "
                        onClick={() => {
                          setActionItem(
                            row.ActionItems?.[0]?.description || ""
                          );
                          setOngoing(row.OngoingTasks?.[0]?.description || "");
                          setCompleted(
                            row.CompletedTasks?.[0]?.description || ""
                          );
                          setActionItemId(row.ActionItems?.[0]?.id || "");
                          setOngoingTaskId(row.OngoingTasks?.[0]?.id || "");
                          setCompletedTaskId(row.CompletedTasks?.[0]?.id || "");
                          setIsEditModalOpen(true);
                        }}
                      >
                        <img
                          className="w-3 h-3  cursor-pointer"
                          src="/assets/pen.svg"
                          alt=""
                        />
                      </button>
                    </ul>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="w-[35vw] h-auto bg-white rounded-[10px] ">
          <div className="flex justify-between p-4 mb-2 border-b-1 border-[#808080] w-full">
            <p className="text-primary font-[700] text-[16px] w-full">
              Edit Weekly Report
            </p>
            <button
              className="place-self-end cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={() => setIsEditModalOpen(false)}
            >
              <img src="/assets/cancel-icon.svg" alt="" />
            </button>
          </div>
          <div className="p-4">
            <p className="font-semibold">Action Item</p>
            <textarea
              className="w-full h-[100px] border-1 border-gray-300 rounded-[5px] resize-none p-2"
              value={actionItem}
              onChange={(e) => setActionItem(e.target.value)}
            />
            <p className="font-semibold">Ongoing</p>
            <textarea
              className="w-full h-[100px] border-1 border-gray-300 rounded-[5px] resize-none p-2"
              value={ongoing}
              onChange={(e) => setOngoing(e.target.value)}
            />
            <p className="font-semibold">Completed</p>
            <textarea
              className="w-full h-[100px] border-1 border-gray-300 rounded-[5px] resize-none p-2"
              value={completed}
              onChange={(e) => setCompleted(e.target.value)}
            />

            <button
              className={`w-full mt-4  h-[40px]  text-white rounded-[5px] 
              ${
                isEditLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary cursor-pointer"
              }`}
              disabled={isEditLoading}
              onClick={handleUpdate}
            >
              {isEditLoading ? (
                <div className={`flex justify-center items-center h-auto `}>
                  <Icon
                    icon="svg-spinners:ring-resize"
                    width="27"
                    height="27"
                    color="#FFFFFF"
                  />
                </div>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </Modal>
      <SuccessCard
        message={successMessage}
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        autoClose={true}
        autoCloseTime={2000}
      />
    </div>
  );
};

export default WeeklyTable;
