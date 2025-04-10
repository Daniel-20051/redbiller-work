import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import EventInfo from "./Pages/EventInfo";
import Event from "./Pages/Event";
import WeeklyReport from "./Pages/WeeklyReport";
import IncidentReport from "./Pages/IncidentReport";
import IncidentCreate from "./Pages/IncidentCreate";
import WeeklyCreate from "./Pages/WeeklyCreate";
import Profile from "./Pages/Profile";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/home" element={<Home>Elvis</Home>} />
          <Route path="/events" element={<Event />} />
          <Route path="/events/:slug" element={<EventInfo />} />
          <Route path="/weekly-report" element={<WeeklyReport />} />
          <Route path="/weekly-report/create" element={<WeeklyCreate />} />
          <Route path="/incident-report" element={<IncidentReport />} />
          <Route path="/incident-report/create" element={<IncidentCreate />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
