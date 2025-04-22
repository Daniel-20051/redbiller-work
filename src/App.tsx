import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import EventInfo from "./Pages/EventInfo";
import Event from "./Pages/Event";
import WeeklyReport from "./Pages/WeeklyReport";
import IncidentReport from "./Pages/IncidentReport";
import IncidentCreate from "./Pages/IncidentCreate";
import WeeklyCreate from "./Pages/WeeklyCreate";
import Profile from "./Pages/Profile";
import User from "./Pages/Users";
import ProtectedRoute from "./routs/protectedRoute";
import UserDropdown from "./Pages/test";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      // const userData = JSON.parse(localStorage.getItem("user") || "{}");
      // setIsAdmin(userData.isAdmin || false);
    }
  }, []);

  return (
    <div>
      {/* <AuthLogin> */}
      <BrowserRouter>
        <Routes>
          /* Public route */
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Login />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Login />
            }
          />
          /* Protected routes */
          {/* <AuthProvider> */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Event />} />
            <Route path="/events/:slug" element={<EventInfo />} />
            <Route path="/weekly-report" element={<WeeklyReport />} />
            <Route path="/weekly-report/create" element={<WeeklyCreate />} />
            <Route path="/test" element={<UserDropdown />} />
            <Route path="/incident-report" element={<IncidentReport />} />
            <Route
              path="/incident-report/create"
              element={<IncidentCreate />}
            />
            <Route path="/profile" element={<Profile />} />
            {isAdmin && <Route path="/users" element={<User total={40} />} />}
          </Route>
          {/* </AuthProvider> */}
          /* Catch all - redirect to home if authenticated, otherwise to login
          */
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
      {/* </AuthLogin> */}
    </div>
  );
};

export default App;
