import { useEffect, useState } from "react";
import { AuthApis } from "../api";

const authApi = new AuthApis();

const IncidentItem = () => {
  const [incidentValue, setIncidentValue] = useState<any>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authApi.getAllIncidentReport();
        setIncidentValue(response);
        return response;
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, []);

  return (
    // <li className=" w-[80%] list-none  bg-[#D6CBCB2E] px-6 py-2   rounded-[4px] mb-[12px]  hover:bg-[#D6CBCB] justify-self-center ">
    //   {incidentValue?.data.data.incidents.map(
    //     (incident: any, index: number) => (
    //       <div key={index} className="justify-right flex gap-0.5 m-0.5">
    //         <p className="text-primary font-[600] text-[16px] ">
    //           {incident.subject}
    //         </p>
    //         <p className="font-[400] text-[#4E4E4E] text-[14px] ">
    //           {incident.incidentMessage}
    //         </p>
    //       </div>
    //     )
    //   )}
    // </li>
    <ul className="w-[80%] space-y-2">
      {" "}
      {error && <li className="text-red-500">{error}</li>}
      {incidentValue?.data.data.incidents.map(
        (incident: any, index: number) => (
          <li
            key={incident.id || index}
            className="list-none bg-[#D6CBCB2E] px-6 py-2 rounded-[4px] hover:bg-[#D6CBCB]"
          >
            <div className="flex flex-col">
              <p className="text-primary font-semibold text-[16px]">
                {incident.subject}
              </p>
              <p className="text-[#4E4E4E] text-[14px]">
                {incident.incidentMessage}
              </p>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default IncidentItem;
