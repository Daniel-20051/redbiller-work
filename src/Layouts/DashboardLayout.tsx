import NavBar from "../Components/NavBar";
import SideBar from "../Components/SideBar";
import { Outlet } from "react-router-dom";
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
  const { currentPage } = useCurrentPage();
  const [chatOpen, setChatOpen] = useState(false);
  const { userDetails, setOnlineUsers, removeOnlineUser, addOnlineUser } =
    use(UserDetailsContext);
  const { setSocketConnected } = use(UserDetailsContext);

  useEffect(() => {
    if (userDetails?.data.user.id) {
      socketService.connect(userDetails?.data.user.id);
      setSocketConnected(true);
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
    socketService.onLastMessage((data: any) => {
      console.log(data);
    });
  }, [userDetails]);

  return (
    <div>
      <div className="flex flex-col  h-screen">
        <NavBar></NavBar>
        <div className=" flex flex-1 w-full relative max-h-[calc(100vh-55px)]">
          <SideBar>{currentPage}</SideBar>

          <div className=" w-full h-full ">
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
    </div>
  );
}
