import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState, use } from "react";
import ChatCard from "./ChatCard.js";
import { AuthApis } from "../../../api/index.js";
import UserSkeleton from "./UserSkeleton.js";
import ChatTextArea from "./ChatTextArea.js";
import GroupChatModal from "./GroupChatModal.js";
import { UserDetailsContext } from "../../../context/AuthContext.js";
const authApis = new AuthApis();

interface ChatDialogProps {
  open: boolean;
  onClose: () => void;
  unreadCount?: number;
  showAlertMessage?: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
}

const ChatDialog = ({ open, onClose, showAlertMessage }: ChatDialogProps) => {
  const { userDetails, socketConnected, isUserOnline } =
    use(UserDetailsContext);

  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [chatId, setChatId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [previousChats, setPreviousChats] = useState<any[]>([]);

  // chatNumber removed; rely on previousChats.length instead
  const [isPreviousChatLoading, setIsPreviousChatLoading] =
    useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isChatTextAreaOpen, setIsChatTextAreaOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipientId, setRecipientId] = useState<string>("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [groupParticipantIds, setGroupParticipantIds] = useState<string[]>([]);
  const userIdToName = useMemo(() => {
    const mapping: Record<string, string> = {};
    for (const user of users) {
      const first = (user.firstName || "").toString();
      const last = (user.lastName || "").toString();
      const full = `${capitalizeName(first)} ${capitalizeName(last)}`.trim();
      mapping[String(user.id)] = full || String(user.email || "");
    }
    return mapping;
  }, [users]);
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

  // Find existing chat with a user or create new one
  const findOrCreateChat = async (userId: string): Promise<string | null> => {
    // If the provided ID matches an existing chat (e.g., a group chat ID), return it directly
    const existingChatById = previousChats.find((chat) => chat._id === userId);
    if (existingChatById) {
      return existingChatById._id;
    }

    // Otherwise, check if we already have a direct chat with this user
    const existingDirectChat = previousChats.find((chat) => {
      const otherUserId =
        chat.metadata?.recipientId === userDetails?.data?.user?.id
          ? chat.metadata?.senderId
          : chat.metadata?.recipientId;
      return otherUserId === userId;
    });

    if (existingDirectChat) {
      // Return existing chat ID - this will load previous messages
      return existingDirectChat._id;
    }

    // Create new direct chat if none exists
    try {
      const response: any = await authApis.submitDirectMessage({
        recipientId: userId,
      });

      if (response?.data?.data?.chat?._id) {
        // Refresh the chats list to include the new chat
        await handleChats();
        return response.data.data.chat._id;
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    }

    return null;
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

  // Filter previous chats based on search
  const filteredPreviousChats = previousChats.filter((chat: any) => {
    const currentUserId = userDetails?.data?.user?.id;
    const recipientName =
      chat.metadata?.recipientName ||
      (chat.metadata?.senderName && chat.metadata?.senderId !== currentUserId
        ? chat.metadata.senderName
        : chat.metadata.senderName) ||
      "";

    const lastMessage = chat?.lastMessage?.content || "";

    return (
      recipientName.toLowerCase().includes(chatSearch.toLowerCase()) ||
      lastMessage.toLowerCase().includes(chatSearch.toLowerCase())
    );
  });

  function capitalizeName(name?: string | null) {
    if (!name || typeof name !== "string") return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const handleChats = async () => {
    setIsPreviousChatLoading(true);
    try {
      const response: any = await authApis.getUserAllChats();
      console.log(response.data.data.chats);
      setPreviousChats(response.data.data.chats);
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

      return response.data.data.messages;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return [];
    }
  };

  // Unified function to open chat with any user
  const openChatWithUser = async (userId: string, userName: string) => {
    if (!socketConnected) {
      return;
    }

    // Smooth transition: first show the loading state
    setIsChatTextAreaOpen(true);
    setName(userName);
    setRecipientId(userId);
    setMessages([]);
    setIsLoading(true);

    try {
      // Find or create chat
      const foundChatId = await findOrCreateChat(userId);

      if (foundChatId) {
        setChatId(foundChatId);
        // If this is a group chat, compute participants list for header
        const chatObj = previousChats.find((c: any) => c._id === foundChatId);
        const isGroupChat = chatObj?.chatType === "group";
        if (isGroupChat) {
          setIsGroup(true);
          const currentUserId = userDetails?.data?.user?.id;
          const ids: string[] = (chatObj?.participants || [])
            .map((p: any) => String(p.userId))
            .filter((id: string) => id !== String(currentUserId));
          setGroupParticipantIds(ids);
        }
        // Load existing messages with nice transition
        const chatMessages = await handleGetMessages(foundChatId);
        setMessages(chatMessages || []);
      } else {
        setIsLoading(false);
        console.error("Failed to find or create chat");
      }
    } catch (error) {
      console.error("Error opening chat:", error);
      setIsLoading(false);
    }
  };

  // Handle group creation
  const handleCreateGroup = async (selectedUsers: any[], groupName: string) => {
    setIsCreatingGroup(true);

    try {
      // Step 1: Create the group chat with participants
      const participantIds = selectedUsers.map((user) => user.id);

      const groupResponse: any = await authApis.createGroupChat({
        participantIds: participantIds,
        groupName: groupName,
      });

      if (groupResponse?.status === 200 || groupResponse?.status === 201) {
        const chatId =
          groupResponse.data?.data?.chat?._id || groupResponse.data?.chatId;

        if (chatId) {
          // Close modal and show success
          setIsGroupModalOpen(false);
          showAlertMessage?.(
            `Group "${groupName}" created successfully with ${selectedUsers.length} members!`,
            "success"
          );

          // Refresh chats to show new group
          await handleChats();
        } else {
          throw new Error("No chat ID returned from group creation");
        }
      } else {
        throw new Error(
          groupResponse?.data?.message || "Failed to create group"
        );
      }
    } catch (error: any) {
      console.error("Error creating group:", error);
      showAlertMessage?.(
        error?.response?.data?.message ||
          "Failed to create group. Please try again.",
        "error"
      );
    } finally {
      setIsCreatingGroup(false);
    }
  };
  useEffect(() => {
    handleUsers();
    handleChats();
  }, []);

  // Refetch previous chats whenever the dialog is opened
  useEffect(() => {
    if (open) {
      handleChats();
      setChatSearch(""); // Reset chat search when dialog opens
    }
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center px-5 md:px-10  pb-15 justify-end transition-all duration-300 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={` flex flex-col place-self-end relative p-2 bg-white rounded-2xl shadow-2xl w-full md:w-[400px] max-h-[80vh] md:max-h-[82vh] transform transition-all duration-300 overflow-hidden ${
          open ? "translate-y-0 scale-100" : "translate-y-10 scale-95"
        } `}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={` flex-1 h-full flex-col gap-3 ${
            isChatTextAreaOpen ? "hidden" : "flex"
          } overflow-hidden`}
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
                      className="w-full flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-3"
                      style={{ maxHeight: "120px", minHeight: "0" }}
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
                            online={isUserOnline(user.id)}
                            key={index}
                            name={
                              capitalizeName(user.firstName) +
                              " " +
                              capitalizeName(user.lastName)
                            }
                            email={user.email}
                            isChat={true}
                            onClick={() => {
                              const fullName =
                                capitalizeName(user.firstName) +
                                " " +
                                capitalizeName(user.lastName);
                              openChatWithUser(String(user.id), fullName);
                            }}
                          />
                        ))
                      )}
                    </div>

                    <div className="relative z-20 w-full">
                      <div className="absolute inset-0 backdrop-blur-lg bg-gradient-to-t from-white/90 to-white/60 rounded-b-lg"></div>
                      <button
                        onClick={() => setIsGroupModalOpen(true)}
                        className="relative z-10 flex cursor-pointer font-medium items-center justify-center gap-2 bg-primary w-full text-white px-3 py-2 rounded-md transition-colors shadow-lg hover:shadow-xl"
                      >
                        <Icon icon="ic:round-plus" width="24" height="24" />
                        Create Group
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col items-center p-3 gap-3 rounded-lg border-1 border-[#d2d2d2] transition-all duration-300 min-h-0 ${
                  isOpen ? "flex-1" : "flex-[2]"
                }`}
              >
                <div className="w-full flex place-self-start gap-2 items-center">
                  <img src="./assets/redlogodashboard.svg" alt="" />
                  {isPreviousChatLoading && (
                    <Icon
                      icon="svg-spinners:3-dots-scale"
                      width="18"
                      height="18"
                      className="text-primary"
                    />
                  )}
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
                    placeholder="Search chats..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    className="w-full h-[35px] text-[16px] rounded-md border-1 border-[#d2d2d2] outline-0 p-2 pl-10"
                  />
                </div>
                <div className="w-full flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 min-h-0">
                  {filteredPreviousChats.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {filteredPreviousChats.map((chat: any, index: number) => {
                        // Get current user ID
                        const currentUserId = userDetails?.data?.user?.id;

                        // Find the participant entry for the current user to get their unread count
                        const currentUserParticipant = chat.participants?.find(
                          (participant: any) =>
                            participant.userId === currentUserId
                        );

                        // Get unread count for current user
                        const unreadCount =
                          currentUserParticipant?.unreadCount || 0;

                        // Determine the recipient name (the other person in the chat)
                        const recipientName =
                          chat.metadata?.recipientName ||
                          (chat.metadata?.senderName &&
                          chat.metadata?.senderId !== currentUserId
                            ? chat.metadata.senderName
                            : chat.metadata?.recipientName) ||
                          "";

                        // Determine the recipient ID
                        const recipientId =
                          chat.metadata?.recipientId ||
                          (chat.metadata?.senderId !== currentUserId
                            ? chat.metadata.senderId
                            : chat.metadata?.recipientId);

                        const groupID =
                          chat.chatType === "group" ? chat._id : null;

                        return (
                          <ChatCard
                            key={index}
                            isChat={false}
                            name={
                              chat.chatType === "group"
                                ? chat.metadata?.name
                                : capitalizeName(recipientName)
                            }
                            online={isUserOnline(recipientId)}
                            unreadCount={unreadCount}
                            lastMessage={chat?.lastMessage?.content ?? ""}
                            isMetaLoading={false}
                            onClick={() => {
                              if (groupID) {
                                setIsGroup(true);
                                openChatWithUser(
                                  groupID,
                                  capitalizeName(chat.metadata?.name)
                                );
                              } else {
                                setIsGroup(false);
                                openChatWithUser(
                                  recipientId,
                                  capitalizeName(recipientName)
                                );
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      {chatSearch
                        ? "No chats found matching your search."
                        : "No previous chats found."}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className={`flex-1 flex flex-col min-h-0 ${
            isChatTextAreaOpen ? "flex" : "hidden"
          }`}
        >
          <ChatTextArea
            chatId={chatId}
            name={name}
            messages={messages}
            setMessages={setMessages}
            setIsChatTextAreaOpen={setIsChatTextAreaOpen}
            isChatTextAreaOpen={isChatTextAreaOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            recipientId={recipientId}
            refetchChats={handleChats}
            isGroup={isGroup}
            userIdToName={userIdToName}
            participantIds={groupParticipantIds}
          />
        </div>
      </div>

      {/* Group Chat Modal - Rendered outside the main dialog */}
      <GroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        users={users}
        currentUserId={userDetails?.data?.user?.id || ""}
        onCreateGroup={handleCreateGroup}
        isLoading={isCreatingGroup}
      />
    </div>
  );
};

export default ChatDialog;
