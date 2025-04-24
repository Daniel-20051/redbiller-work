import { useEffect, useState } from "react";
import { AuthApis } from "../api";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

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
  onIncidentSelect?: (incident: Incident) => void;
}

const IncidentItem: React.FC<IncidentItemProps> = ({
  searchTerm = "",
  onIncidentSelect,
}) => {
  const [incidentValue, setIncidentValue] = useState<any>(null);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState(false);
  const { userDetails } = use(UserDetailsContext);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const isAdmin = userDetails?.data.user.role == "admin";

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
      <div className="flex justify-center items-center h-[75vh] w-full">
        <p className="text-[#980000] text-center text-[1.1rem]">Loading...</p>
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

  const handleClick = (incident: Incident) => {
    setSelectedIncident(incident);
    if (onIncidentSelect) {
      onIncidentSelect(incident);
    }
  };

  return (
    <ul className="w-full space-y-2 hover:cursor-pointer">
      {filteredIncidents.map((incident, index) => (
        <li
          onClick={() => handleClick(incident)}
          key={incident.id || index}
          className="list-none bg-[#D6CBCB2E] px-6 py-2 rounded-[4px] hover:bg-[#D6CBCB]"
        >
          {isAdmin ? (
            <Link
              to={`/incident-report/${incident.id}`}
              className="flex flex-col"
            >
              <p className="text-primary font-semibold text-[16px]">
                {incident.subject}
                {isAdmin && (
                  <span className="text-[#767676] text-[10px] ml-2">
                    ➔{" "}
                    {incident.User.firstName.charAt(0).toUpperCase() +
                      incident.User.firstName.slice(1).toLowerCase()}{" "}
                    {incident.User.lastName.toLowerCase()}
                  </span>
                )}
              </p>
              <p className="text-[#4E4E4E] text-[14px]">
                {incident.incidentMessage}
              </p>
            </Link>
          ) : (
            <div className="flex flex-col">
              <p className="text-primary font-semibold text-[16px]">
                {incident.subject}
                {isAdmin && (
                  <span className="text-[#767676] text-[10px] ml-2">
                    ➔{" "}
                    {incident.User.firstName.charAt(0).toUpperCase() +
                      incident.User.firstName.slice(1).toLowerCase()}{" "}
                    {incident.User.lastName.toLowerCase()}
                  </span>
                )}
              </p>
              <p className="text-[#4E4E4E] text-[14px]">
                {incident.incidentMessage}
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default IncidentItem;
