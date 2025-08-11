import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import { useCurrentPage } from "../context/SidebarContext";
import { useEffect, useState } from "react";
import ChatDialog from "../Components/ChatDialog";
import { Icon } from "@iconify/react";
import socketService from "../services/socketService";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";

const FloatingChatButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 bg-primary cursor-pointer shadow-lg rounded-full p-4 hover:scale-110 transition-transform"
    aria-label="Open chat"
  >
    <Icon icon="mdi:chat" width="36" height="36" color="white" />
  </button>
);

export default function DashboardLayout() {
  const { currentPage, setCurrentPage } = useCurrentPage();
  const [chatOpen, setChatOpen] = useState(false);
  const { userDetails, setOnlineUsers, removeOnlineUser, addOnlineUser } =
    use(UserDetailsContext);
  const { setSocketConnected } = use(UserDetailsContext);
  const location = useLocation();

  // Sync currentPage with URL pathname on mount and route changes
  useEffect(() => {
    const pathname = location.pathname;

    // Map URL paths to sidebar page names
    const pathToPageMap: { [key: string]: string } = {
      "/home": "home",
      "/users": "users",
      "/events": "event",
      "/incident-report": "incident-report",
      "/weekly-report": "weekly-report",
      "/tasks": "tasks",
    };

    // Find the matching page for the current path
    const matchingPage = pathToPageMap[pathname];

    // For dynamic routes, check if the path starts with known patterns
    if (!matchingPage) {
      if (pathname.startsWith("/events/")) {
        setCurrentPage("event");
      } else if (pathname.startsWith("/incident-report/")) {
        setCurrentPage("incident-report");
      } else if (pathname.startsWith("/weekly-report/")) {
        setCurrentPage("weekly-report");
      } else if (pathname === "/profile") {
        // Profile is not in sidebar, so keep current page
        // Don't change the currentPage state
        return;
      } else {
        // Default to home if no match found
        setCurrentPage("home");
      }
    } else {
      setCurrentPage(matchingPage);
    }
  }, [location.pathname, setCurrentPage]);

  useEffect(() => {
    if (userDetails?.data.user.id) {
      socketService.connect(userDetails?.data.user.id, () => {
        setSocketConnected(true);
        socketService.subscribeToLastMessage();
      });
    }
    socketService.onOnlineUsersList((data: any) => {
      setOnlineUsers(data.map((user: any) => user.userId));
    });
    socketService.onUserGlobalStatus((data: any) => {
      const userId = data.userId;
      if (data.status === "online") {
        addOnlineUser(userId);
      } else if (data.status === "offline") {
        removeOnlineUser(userId);
      }
    });
    // socketService.onLastMessageUpdate((data: any) => {
    //   console.log("last_message_update", data);
    //   setLastMessageDetails(data);
    // });
    socketService.onMedia_Error((data: any) => {
      console.log("media_error", data);
    });
  }, [userDetails]);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar>{currentPage}</SideBar>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
      <FloatingChatButton
        onClick={() => {
          setChatOpen(true);
        }}
      />
      <ChatDialog open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
