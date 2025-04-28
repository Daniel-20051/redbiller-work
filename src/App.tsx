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
import SwipeActionCard from "./Pages/test";
import IncidentView from "./Pages/IncidentView";

const App = () => {
  const [isAdmin] = useState(true);
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
            path="/Login"
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
            <Route
              path="/test"
              element={
                <SwipeActionCard
                  onEdit={() => alert("Edit clicked")}
                  onDelete={() => alert("Delete clicked")}
                >
                  <div>
                    <h2 className="font-bold text-lg">Swipeable Card</h2>
                    <p className="text-gray-600 text-sm">
                      Swipe left to edit or delete.
                    </p>
                  </div>
                </SwipeActionCard>
              }
            />
            <Route path="/incident-report" element={<IncidentReport />} />
            <Route path="/incident-report/:id" element={<IncidentView />} />
            <Route
              path="/incident-report/create"
              element={<IncidentCreate />}
            />
            <Route path="/profile" element={<Profile />} />
            {isAdmin && <Route path="/users" element={<User />} />}
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
                <Navigate to="/Login" replace />
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
