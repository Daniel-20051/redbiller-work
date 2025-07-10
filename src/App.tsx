import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, use, useCallback } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import EventInfo from "./Pages/EventInfo";
import Event from "./Pages/Event";
import WeeklyReport from "./Pages/WeeklyReport";
import IncidentReport from "./Pages/IncidentReport";
import WeeklyView from "./Pages/WeeklyView";
import IncidentCreate from "./Pages/IncidentCreate";
import WeeklyCreate from "./Pages/WeeklyCreate";
import Profile from "./Pages/Profile";
import User from "./Pages/Users";
import ProtectedRoute from "./routes/protectedRoute";
import Chat from "./Pages/Chat";
import { UserDetailsContext } from "./context/AuthContext.js";

import IncidentView from "./Pages/IncidentView";

const App = () => {
  const { userDetails } = use(UserDetailsContext);
  const isAdmin =
    userDetails?.data.user.role == "admin" ||
    userDetails?.data.user.role == "superadmin";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const INACTIVE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const logoutDueToInactivity = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("lastActiveTime");
    setIsAuthenticated(false);
    alert("You have been logged out due to inactivity");
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;
    let checkTimer: ReturnType<typeof setInterval>;

    const updateLastActiveTime = () => {
      localStorage.setItem("lastActiveTime", Date.now().toString());
    };

    const resetTimer = () => {
      updateLastActiveTime();
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutDueToInactivity, INACTIVE_TIMEOUT);
    };

    const checkInactivity = () => {
      const lastActiveTime = localStorage.getItem("lastActiveTime");
      if (lastActiveTime) {
        const timeElapsed = Date.now() - parseInt(lastActiveTime);
        if (timeElapsed >= INACTIVE_TIMEOUT) {
          logoutDueToInactivity();
          return;
        }
      }
    };
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkInactivity();
        if (isAuthenticated) {
          resetTimer();
        }
      } else {
        updateLastActiveTime();
      }
    };

    const handleFocus = () => {
      checkInactivity();
      if (isAuthenticated) {
        resetTimer();
      }
    };

    const handleBlur = () => {
      updateLastActiveTime();
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
      "touchend",
      "click",
      "dblclick",
      "wheel",
    ];

    events.forEach((event) => {
      document.addEventListener(event, resetTimer, true);
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    checkTimer = setInterval(checkInactivity, 30000);

    resetTimer();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (checkTimer) clearInterval(checkTimer);

      events.forEach((event) => {
        document.removeEventListener(event, resetTimer, true);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isAuthenticated, logoutDueToInactivity]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
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
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Event />} />
            <Route path="/events/:id" element={<EventInfo />} />
            <Route path="/weekly-report" element={<WeeklyReport />} />
            <Route path="/weekly-report/:id" element={<WeeklyView />} />
            <Route path="/weekly-report/create" element={<WeeklyCreate />} />
            <Route path="/incident-report" element={<IncidentReport />} />
            {isAdmin && (
              <Route path="/incident-report/:id" element={<IncidentView />} />
            )}
            <Route
              path="/incident-report/create"
              element={<IncidentCreate />}
            />
            <Route path="/profile" element={<Profile />} />
            {isAdmin && <Route path="/users" element={<User />} />}
            <Route path="/chat" element={<Chat />} />
          </Route>
          {/* Catch all - redirect to home if authenticated, otherwise to login */}
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
    </div>
  );
};

export default App;
