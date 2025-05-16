import React from "react";

interface TableRow {
  sn: number;
  actionItem: string;
  ongoing: string;
  completed: string;
}

const data: TableRow[] = [
  {
    sn: 1,
    actionItem: "Enable branch protection rules.",
    ongoing: "Perform cost optimisim.",
    completed: "Scale down waverlite.",
  },
  {
    sn: 2,
    actionItem: "Enable branch protection rules.",
    ongoing: "Perform cost optimisim.",
    completed: "Scale down waverlite.",
  },
  {
    sn: 3,
    actionItem: "Enable branch protection rules.",
    ongoing: "Perform cost optimisim.",
    completed: "Scale down waverlite.",
  },
  {
    sn: 4,
    actionItem: "Enable branch protection rules.",
    ongoing: "Perform cost optimisim.",
    completed: "Scale down waverlite.",
  },
  {
    sn: 5,
    actionItem: "Enable branch protection rules.",
    ongoing: "Perform cost optimisim.",
    completed: "Scale down waverlite.",
  },
  {
    sn: 6,
    actionItem: "Enable branch protection rules.",
    ongoing: "Perform cost optimisim.",
    completed: "Scale down waverlite.",
  },
];

const WeeklyTable: React.FC = () => {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="min-w-full table-auto ">
        <thead>
          <tr className="bg-[#D6CBCB]">
            <th className="px-4 py-6 text-left border-r-1 text-[17px] border-[#F2F2F2] font-normal">
              S/N
            </th>
            <th className="px-4 py-6 text-left border-1 text-[17px] border-[#F2F2F2] font-normal">
              Action Item
            </th>
            <th className="px-4 py-6 text-left border-1 text-[17px] border-[#F2F2F2] font-normal">
              Ongoing
            </th>
            <th className="px-4 py-6 text-left border-1 text-[17px] border-[#F2F2F2] font-normal">
              Completed
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.sn} className="hover:bg-gray-100">
              <td className="px-4 py-4 text-[17px] border-1 border-[#F2F2F2]">
                {row.sn}
              </td>
              <td className="px-4 py-4 text-[17px] border-1 border-[#F2F2F2]">
                {row.actionItem}
              </td>
              <td className="px-4 py-4 text-[17px] border-1 border-[#F2F2F2]">
                {row.ongoing}
              </td>
              <td className="px-4 py-4 text-[17px] border-1 border-[#F2F2F2]">
                {row.completed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTable;
