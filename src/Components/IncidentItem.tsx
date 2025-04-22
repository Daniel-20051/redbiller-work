import { useEffect, useState } from "react";
import { AuthApis } from "../api";

const authApi = new AuthApis();

interface Incident {
  id: string;
  subject: string;
  incidentMessage: string;
  User: {
    firstName: string;
    lastName: string;
  };
}

interface IncidentItemProps {
  searchTerm?: string;
}

const IncidentItem: React.FC<IncidentItemProps> = ({ searchTerm = "" }) => {
  const [incidentValue, setIncidentValue] = useState<any>(null);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(true);
      try {
        const response = await authApi.getAllIncidentReport();
        setIncidentValue(response);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (incidentValue?.data?.data?.incidents) {
      const filtered = incidentValue.data.data.incidents.filter(
        (incident: Incident) =>
          incident.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.incidentMessage
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${incident.User.firstName} ${incident.User.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredIncidents(filtered);
    }
  }, [incidentValue, searchTerm]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p className="text-red-500 text-center">Loading...</p>
      </div>
    );
  }

  if (filteredIncidents.length === 0) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p className="text-[#767676] text-center">No incidents found</p>
      </div>
    );
  }

  return (
    <ul className="w-full space-y-2">
      {filteredIncidents.map((incident, index) => (
        <li
          key={incident.id || index}
          className="list-none bg-[#D6CBCB2E] px-6 py-2 rounded-[4px] hover:bg-[#D6CBCB]"
        >
          <div className="flex flex-col">
            <p className="text-primary font-semibold text-[16px]">
              {incident.subject}
              <span className="text-[#767676] text-[10px] ml-2">
                ➔{" "}
                {incident.User.firstName.charAt(0).toUpperCase() +
                  incident.User.firstName.slice(1).toLowerCase()}{" "}
                {incident.User.lastName.toLowerCase()}
              </span>
            </p>
            <p className="text-[#4E4E4E] text-[14px]">
              {incident.incidentMessage}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default IncidentItem;
