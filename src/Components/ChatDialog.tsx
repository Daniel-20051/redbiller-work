import { Icon } from "@iconify/react";
import { useEffect, useState, use } from "react";
import ChatCard from "../Components/ChatCard";
import { AuthApis } from "../api";
import UserSkeleton from "../Components/UserSkeleton";
import ChatTextArea from "../Components/ChatTextArea";
import { UserDetailsContext } from "../context/AuthContext.js";
const authApis = new AuthApis();

interface ChatDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChatDialog = ({ open, onClose }: ChatDialogProps) => {
  const { userDetails, socketConnected } = use(UserDetailsContext);

  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [chatId, setChatId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [previousChats, setPreviousChats] = useState<any[]>([]);
  const [chatNumber, setChatNumber] = useState<number>(0);
  const [isPreviousChatLoading, setIsPreviousChatLoading] =
    useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  const [newChatId, setNewChatId] = useState<string>("");
  const [isChatTextAreaOpen, setIsChatTextAreaOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleUsers = async () => {
    setIsUserLoading(true);
    try {
      const response: any = await authApis.getAllUser();

      if (response.status === 200) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleSubmitDirectMessage = async (recipientId: string) => {
    try {
      const response: any = await authApis.submitDirectMessage({
        recipientId: recipientId,
      });
      console.log("Response", response);
      if (response?.data?.data?.chat?._id) {
        setNewChatId(response.data.data.chat._id);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      // Exclude the current user from the list
      user.id !== userDetails?.data.user.id &&
      ((user.firstName + " " + user.lastName)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
  );

  function capitalizeName(name: string) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const handleChats = async () => {
    setIsPreviousChatLoading(true);
    try {
      const response: any = await authApis.getUserAllChats();
      setPreviousChats(response.data.data.chats);
      setChatNumber(response.data.data.chats.length);
    } catch (error) {
    } finally {
      setIsPreviousChatLoading(false);
    }
  };

  const handleGetMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const response: any = await authApis.getAllMessages(chatId);
      setIsLoading(false);
      console.log("Response", response);
      return response.data.data.messages;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return [];
    }
  };
  useEffect(() => {
    handleUsers();
    handleChats();
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center px-5 md:px-10  pb-15 justify-end transition-all duration-300 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={` flex-col place-self-end overflow-y-auto  relative p-2 bg-white rounded-2xl shadow-2xl w-full md:w-[400px] max-h-[86vh] md:max-h-[80vh] transform transition-all duration-300 ${
          open ? "translate-y-0 scale-100" : "translate-y-10 scale-95"
        } `}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={` flex-1 h-full  flex-col gap-3 ${
            isChatTextAreaOpen ? "hidden" : "flex"
          }  overflow-y-auto `}
        >
          {!socketConnected ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Icon
                icon="svg-spinners:ring-resize"
                width="40"
                height="40"
                color="#93221D"
              />
              <p className="text-gray-600 text-center">
                Connecting to chat server...
              </p>
              <p className="text-gray-400 text-sm text-center">
                Please wait while we establish a secure connection
              </p>
            </div>
          ) : (
            <>
              <div
                className={`flex flex-col  rounded-lg border-1  border-[#d2d2d2] 
                  `}
              >
                <div
                  className={`flex bg-[#F2F2F2] px-3 h-[50px] items-center justify-between transition-transform duration-300 ${
                    isOpen ? "rounded-t-lg" : "rounded-lg"
                  }`}
                >
                  <div className="flex items-center  gap-5 h-full">
                    <Icon icon="octicon:people-24" width="25" height="25" />
                    <p className="text-[15px] font-[500] ">All Members</p>
                  </div>
                  <Icon
                    className={`cursor-pointer transition-transform duration-300 ${
                      isOpen ? "" : "rotate-180"
                    }`}
                    icon="ep:arrow-down"
                    width="24"
                    height="24"
                    onClick={() => setIsOpen((prev) => !prev)}
                  />
                </div>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden`}
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="p-3 flex flex-col items-center gap-3">
                    <div className="relative w-[97%]">
                      <Icon
                        icon="mynaui:search"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        width="20"
                        height="20"
                      />
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-[35px] text-[16px] rounded-md border-1 border-[#d2d2d2] outline-0 p-2 pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div
                      className="w-full flex flex-col gap-3 overflow-y-auto"
                      style={{ maxHeight: "160px" }}
                    >
                      {isUserLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <UserSkeleton key={i} />
                        ))
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          No members found.
                        </div>
                      ) : (
                        filteredUsers.map((user, index) => (
                          <ChatCard
                            key={index}
                            name={
                              capitalizeName(user.firstName) +
                              " " +
                              capitalizeName(user.lastName)
                            }
                            email={user.email}
                            isChat={true}
                            onClick={async () => {
                              if (!socketConnected) {
                                return; // Don't open chat if socket is not connected
                              }
                              setIsChatTextAreaOpen(true);
                              setName(
                                capitalizeName(user.firstName) +
                                  " " +
                                  capitalizeName(user.lastName)
                              );
                              setMessages([]);
                              setIsNewChat(true);
                              setChatId(""); // Clear any previous chatId
                              await handleSubmitDirectMessage(String(user.id));
                            }}
                          />
                        ))
                      )}
                    </div>

                    <button className="flex cursor-pointer font-medium items-center justify-center gap-2 bg-primary  w-[97%] text-white px-3 py-2 rounded-md ">
                      <Icon icon="ic:round-plus" width="24" height="24" />
                      Create Group
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`flex-1  flex flex-col items-center p-3  gap-3 rounded-lg border-1 border-[#d2d2d2] transition-all duration-300 ${
                  isOpen ? "h-[43%]" : "h-[40%]"
                }`}
              >
                <div className="w-full flex place-self-start gap-2 items-center">
                  <img src="./assets/redlogodashboard.svg" alt="" />
                </div>
                <div className="relative w-[97%]">
                  <Icon
                    icon="mynaui:search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    width="20"
                    height="20"
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full h-[35px] text-[16px] rounded-md border-1 border-[#d2d2d2] outline-0 p-2 pl-10"
                  />
                </div>
                <div className="w-full flex flex-col gap-3  overflow-y-auto flex-1">
                  {isPreviousChatLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <UserSkeleton key={i} />
                    ))
                  ) : chatNumber !== 0 ? (
                    <div className="flex flex-col gap-3">
                      {previousChats.map((chat: any, index: number) => (
                        <ChatCard
                          key={index}
                          isChat={false}
                          name={capitalizeName(chat.metadata.recipientName)}
                          onClick={async () => {
                            if (!socketConnected) {
                              return; // Don't open chat if socket is not connected
                            }
                            setIsChatTextAreaOpen(true);
                            setChatId(chat._id);
                            setName(
                              capitalizeName(chat.metadata.recipientName)
                            );
                            setIsNewChat(false);

                            // Fetch messages for this chat
                            const chatMessages = await handleGetMessages(
                              chat._id
                            );
                            setMessages(chatMessages);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No previous chats found.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className={`flex h-auto  max-h-[79vh] flex-col ${
            isChatTextAreaOpen ? "flex" : "hidden"
          }`}
        >
          <ChatTextArea
            chatId={chatId}
            name={name}
            messages={messages}
            setMessages={setMessages}
            isNewChat={isNewChat}
            newChatId={newChatId}
            onChatCreated={handleChats}
            setIsNewChat={setIsNewChat}
            setNewChatId={setNewChatId}
            setChatId={setChatId}
            setIsChatTextAreaOpen={setIsChatTextAreaOpen}
            isChatTextAreaOpen={isChatTextAreaOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;
