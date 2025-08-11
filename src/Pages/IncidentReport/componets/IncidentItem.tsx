import { useEffect, useState, use } from "react";
import { AuthApis } from "../../../api";
import { UserDetailsContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const authApi = new AuthApis();

interface Incident {
  id: string;
  subject: string;
  incidentMessage: string;
  createdAt?: string;
  updatedAt?: string;
  User: {
    firstName: string;
    lastName: string;
  };
}

interface IncidentItemProps {
  searchTerm?: string;
  dateFilter?: string;
  onIncidentSelect?: (incident: Incident) => void;
}

const IncidentItem: React.FC<IncidentItemProps> = ({
  searchTerm = "",
  dateFilter = "",
  onIncidentSelect,
}) => {
  const [incidentValue, setIncidentValue] = useState<any>(null);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState(false);
  const { userDetails } = use(UserDetailsContext);

  const isAdmin =
    userDetails?.data.user.role == "admin" ||
    userDetails?.data.user.role == "superadmin";

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
        (incident: Incident) => {
          // Text search filtering
          const textMatch =
            incident.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.incidentMessage
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            `${incident.User.firstName} ${incident.User.lastName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

          // Date filtering
          let dateMatch = true;
          if (dateFilter) {
            const incidentDate = incident.createdAt || incident.updatedAt;
            if (incidentDate) {
              const incidentDateOnly = new Date(incidentDate)
                .toISOString()
                .split("T")[0];
              dateMatch = incidentDateOnly === dateFilter;
            } else {
              dateMatch = false;
            }
          }

          return textMatch && dateMatch;
        }
      );
      setFilteredIncidents(filtered);
    }
  }, [incidentValue, searchTerm, dateFilter]);

  if (error) {
    return (
      <div className={`flex justify-center items-center h-[55vh] `}>
        <Icon
          icon="svg-spinners:ring-resize"
          width="30"
          height="30"
          color="#93221D"
        />
      </div>
    );
  }

  if (filteredIncidents.length === 0) {
    return (
      <div className="flex justify-center items-center h-[55vh] w-full ">
        <Icon
          icon="line-md:document-delete"
          width="60"
          height="60"
          color="#93221D"
        />
        <p className=" font-[600] text-lg">No Incident found</p>
      </div>
    );
  }

  const handleClick = (incident: Incident) => {
    if (onIncidentSelect) {
      onIncidentSelect(incident);
    }
  };

  return (
    <div className="w-[95%]">
      <ul className="flex flex-col  gap-2 hover:cursor-pointer overflow-y-auto max-h-full  scroll-smooth ">
        {filteredIncidents.map((incident, index) => (
          <li
            onClick={() => handleClick(incident)}
            key={incident.id || index}
            className="list-none bg-[#D6CBCB14] px-6 py-2 rounded-[4px] w-full hover:bg-[#D6CBCB]"
          >
            {isAdmin ? (
              <Link
                to={`/incident-report/${incident.id}`}
                className="flex flex-col hover:bg-[#D6CBCB]"
              >
                <p className="text-primary font-semibold text-[16px]">
                  {incident.subject}
                  {isAdmin && (
                    <span className="text-[#898A8D] font-[400] text-[12px] ml-2">
                      ➔{" "}
                      {incident.User.firstName.charAt(0).toUpperCase() +
                        incident.User.firstName.slice(1).toLowerCase()}{" "}
                      {incident.User.lastName.toLowerCase()}
                    </span>
                  )}
                </p>
                <p className="text-[#4E4E4E] text-[14px] clamp-responsive ">
                  {incident.incidentMessage}
                </p>
              </Link>
            ) : (
              <div className="flex flex-col hover:bg-[#D6CBCB] ">
                <p className="text-primary font-[600] text-[16px]">
                  {incident.subject}
                </p>
                <p className="text-[#4E4E4E] text-[14px] clamp-responsive">
                  {incident.incidentMessage}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncidentItem;
