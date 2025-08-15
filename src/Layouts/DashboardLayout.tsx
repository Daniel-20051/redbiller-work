import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import { useCurrentPage } from "../context/SidebarContext";
import { useEffect, useState } from "react";
import ChatDialog from "../Components/Chat/components/ChatDialog";
import AlertCard from "../messageAlert/AlertCardProps";
import { Icon } from "@iconify/react";
import socketService from "../services/socketService";
import { use } from "react";
import { UserDetailsContext } from "../context/AuthContext";
import { AuthApis } from "../api";

const FloatingChatButton = ({
  onClick,
  unreadCount,
}: {
  onClick: () => void;
  unreadCount?: number;
}) => (
  <div className="fixed bottom-6 right-6 z-50">
    <button
      onClick={onClick}
      className="bg-primary cursor-pointer shadow-lg rounded-full p-4 hover:scale-110 transition-transform relative"
      aria-label="Open chat"
    >
      <Icon icon="mdi:chat" width="36" height="36" color="white" />
      {unreadCount !== undefined && unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[24px]">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  </div>
);

export default function DashboardLayout() {
  const { currentPage, setCurrentPage } = useCurrentPage();
  const [chatOpen, setChatOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
  const { userDetails, setOnlineUsers, removeOnlineUser, addOnlineUser } =
    use(UserDetailsContext);
  const { setSocketConnected } = use(UserDetailsContext);
  const location = useLocation();
  const authApis = new AuthApis();

  // Global alert state
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // Show alert message function
  const showAlertMessage = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const calculateTotalUnreadCount = async () => {
    try {
      const response: any = await authApis.getUserAllChats();
      if (response.status === 200) {
        const chats = response.data.data.chats;
        let totalUnread = 0;

        chats.forEach((chat: any) => {
          const currentUserParticipant = chat.participants.find(
            (participant: any) =>
              participant.userId === userDetails?.data.user.id
          );
          if (currentUserParticipant?.unreadCount) {
            totalUnread += currentUserParticipant.unreadCount;
          }
        });

        setTotalUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error calculating unread count:", error);
    }
  };

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
        calculateTotalUnreadCount(); // Calculate unread count on socket connection
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
    socketService.onLastMessageUpdate((data: any) => {
      console.log("last_message_update", data);
      // Recalculate unread count when last message updates
      calculateTotalUnreadCount();
    });
    socketService.onMedia_Error((data: any) => {
      console.log("media_error", data);
    });

    // Listen for new messages to update unread count
    socketService.onNewMessage((message: any) => {
      // Only update if the message is not from the current user and chat is not open
      if (message.senderId !== userDetails?.data.user.id && !chatOpen) {
        calculateTotalUnreadCount();
      }
    });
  }, [userDetails, chatOpen]);

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
          // Recalculate unread count when chat is opened
          setTimeout(() => calculateTotalUnreadCount(), 500);
        }}
        unreadCount={totalUnreadCount}
      />
      <ChatDialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        unreadCount={totalUnreadCount}
        showAlertMessage={showAlertMessage}
      />

      {/* Global Alert Component */}
      <AlertCard
        message={alertMessage}
        type={alertType}
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        autoClose={true}
        autoCloseTime={4000}
      />
    </div>
  );
}
