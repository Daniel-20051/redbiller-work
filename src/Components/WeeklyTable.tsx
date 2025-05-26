import React, { useEffect, useState } from "react";
import { AuthApis } from "../api";
const authApis = new AuthApis();
interface Props {
  selectedUser: number;
  searchTerm: string;
}

const WeeklyTable: React.FC<Props> = ({ selectedUser, searchTerm }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setEventLoading(true);
        const response: any = await authApis.getAllReports();
        setReports(response.data.data);
        // setEvents(response.data.data);
        // setFilteredEvents(response.data.data);
      } catch (error) {
        // showAlertMessage("An error occurred while sending report", "error");
      } finally {
        // setEventLoading(false);
      }
    };
    fetchData();
  }, []);

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

  return (
    <div className="overflow-x-auto bg-white">
      <table className="min-w-full table-auto ">
        <thead>
          <tr className="bg-[#D6CBCB]">
            <th className="px-4 py-4 text-left border-r-1 text-[14px] md:text-[17px] border-[#F2F2F2] font-normal">
              S/N
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
              <tr key={index} className="hover:bg-gray-100">
                <td className="md:px-4 md:py-4 text-center text-[14px] md:text-[17px] border-1 border-[#F2F2F2]">
                  {index + 1}
                </td>
                <td className="md:px-4 md:py-4 text-[14px] md:text-[17px] border-1 border-[#F2F2F2]">
                  <ul className="list-disc pl-5">
                    {row.ActionItems &&
                      Array.isArray(row.ActionItems) &&
                      row.ActionItems.length > 0 &&
                      row.ActionItems[0].description
                        .split("//")
                        .map((desc: string, i: number) =>
                          desc.trim() ? <li key={i}>{desc.trim()}</li> : null
                        )}
                  </ul>
                </td>
                <td className="md:px-4 md:py-4 text-[14px] md:text-[17px] border-1 border-[#F2F2F2]">
                  <ul className="list-disc pl-5">
                    {row.OngoingTasks &&
                      Array.isArray(row.OngoingTasks) &&
                      row.OngoingTasks.length > 0 &&
                      row.OngoingTasks[0].description
                        .split("//")
                        .map((desc: string, i: number) =>
                          desc.trim() ? <li key={i}>{desc.trim()}</li> : null
                        )}
                  </ul>
                </td>
                <td className="md:px-4 md:py-4 text-[14px] md:text-[17px] border-1 border-[#F2F2F2]">
                  <ul className="list-disc pl-5">
                    {row.CompletedTasks &&
                      Array.isArray(row.CompletedTasks) &&
                      row.CompletedTasks.length > 0 &&
                      row.CompletedTasks[0].description
                        .split("//")
                        .map((desc: string, i: number) =>
                          desc.trim() ? <li key={i}>{desc.trim()}</li> : null
                        )}
                  </ul>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTable;
