import React, { useState, useRef, useEffect, use } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ProfileName from "./ProfileName";
import socketService from "../services/socketService";
import { UserDetailsContext } from "../context/AuthContext.js";
import MessageSkeleton from "./MessageSkeleton";
import { AuthApis } from "../api";
import DateSeparator from "./DateSeparator";
import ReactDOM from "react-dom";

interface Message {
  content: string;
  createdAt: string | number | Date;
  [key: string]: any;
}

interface ChatTextAreaProps {
  chatId: string;
  name: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isNewChat: boolean;
  newChatId: string;
  onChatCreated?: () => void;
  setIsNewChat: (isNewChat: boolean) => void;
  setNewChatId: (newChatId: string) => void;
  setChatId: (chatId: string) => void;
  setIsChatTextAreaOpen: (isChatTextAreaOpen: boolean) => void;
  isChatTextAreaOpen: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  recipientId: string;
  handleChats: () => void;
}

const authApis = new AuthApis();

const ChatTextArea = ({
  chatId,
  name,
  messages,
  setMessages,
  isNewChat,
  newChatId,
  onChatCreated,
  setIsNewChat,
  setNewChatId,
  setChatId,
  setIsChatTextAreaOpen,
  isChatTextAreaOpen,
  isLoading,
  setIsLoading,
  recipientId,
}: ChatTextAreaProps) => {
  const { userDetails, socketConnected, isUserOnline } =
    use(UserDetailsContext);
  const [text, setText] = useState("");

  const [typingInfo, setTypingInfo] = useState<string | null>(null);

  const [messageStatus, setMessageStatus] = useState<string | null>(
    "delivered"
  );

  const userId = userDetails?.data.user.id;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle new chat state changes
  useEffect(() => {
    if (isNewChat) {
      // Show skeleton while creating chat
      setIsLoading(true);
      setMessages([]);
      setText(""); // Clear any existing text input
      setTypingInfo(null);
    }
  }, [isNewChat]);

  // Fetch previous messages for new chatId as soon as it's available
  useEffect(() => {
    if (isNewChat && newChatId) {
      (async () => {
        setIsLoading(true);
        try {
          const prevMessagesResponse = await authApis.getAllMessages(newChatId);
          if (
            prevMessagesResponse &&
            typeof prevMessagesResponse === "object" &&
            "data" in prevMessagesResponse &&
            prevMessagesResponse.data &&
            typeof prevMessagesResponse.data === "object" &&
            "data" in prevMessagesResponse.data &&
            prevMessagesResponse.data.data &&
            typeof prevMessagesResponse.data.data === "object" &&
            "messages" in prevMessagesResponse.data.data
          ) {
            setMessages(prevMessagesResponse.data.data.messages as Message[]);
          }
        } catch (err) {
          // Optionally handle error
        }
        setIsLoading(false);
      })();
    }
  }, [isNewChat, newChatId]);

  // Handle socket connection
  useEffect(() => {
    if (socketConnected && isChatTextAreaOpen && !isNewChat) {
      socketService.joinChat(chatId);
      setIsLoading(true);

      // Define handlers
      const handleNewMessage = (message: any) => {
        if (message.senderId !== userId) {
          setMessages((prev) => [
            ...prev,
            {
              content: message.content,
              createdAt: message.createdAt,
              senderId: message.senderId,
              isSent: false,
            },
          ]);
          // Set loading to false after receiving first message
          setIsLoading(false);
        }
      };
      const handleTyping = (data: any) => {
        if (data.user !== userId) {
          setTypingInfo("typing");
          setTimeout(() => setTypingInfo(null), 2000);
        }
      };
      const handleDelivered = () => {
        setMessageStatus("delivered");
      };

      // Register handlers
      socketService.onNewMessage(handleNewMessage);
      socketService.onTyping(handleTyping);
      socketService.onMessageDelivered(handleDelivered);

      // If no messages are received within 3 seconds, stop loading
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      // Cleanup: remove handlers
      return () => {
        clearTimeout(timeout);
        socketService.offNewMessage(handleNewMessage);
        socketService.offTyping(handleTyping);
        socketService.offMessageDelivered(handleDelivered);
      };
    }
  }, [
    socketConnected,
    isChatTextAreaOpen,
    chatId,
    userId,
    setMessages,
    isNewChat,
  ]);

  const handleLeaveChat = () => {
    socketService.onLeaveChat(chatId);
    socketService.onLeftChat((data: any) => {
      console.log("left_chat", data);
    });

    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (text.trim()) {
      if (isNewChat || !chatId) {
        // Don't send if newChatId is not available yet
        if (!newChatId) {
          console.log("Chat ID not available yet, please wait...");
          return;
        }

        try {
          const response: any = await authApis.sendMessage(newChatId, {
            content: text,
          });

          if (response.status === 201) {
            setText("");
            setMessages((prev) => [
              ...prev,
              {
                content: text,
                createdAt: new Date(),
                senderId: userId,
                isSent: true,
              },
            ]);

            // Call the callback to reload chats list after first message is sent
            if (onChatCreated) {
              onChatCreated();
            }

            // Reset new chat state after first message is sent
            setIsNewChat(false);
            // Set the chatId to the newChatId so the chat becomes an existing chat
            setChatId(newChatId);
            // Clear newChatId since it's no longer needed
            setNewChatId("");
            // No need to fetch previous messages or set loading here, just update messages array
          }
        } catch (error) {
          console.log(error);
          return [];
        }
      } else if (socketConnected) {
        // Send message via socket for existing chats
        socketService.sendMessage(chatId, text);
        setMessages((prev) => [
          ...prev,
          {
            content: text,
            createdAt: new Date(),
            senderId: userId,
            isSent: true,
          },
        ]);
        setMessageStatus("sending");
        setText("");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (socketConnected && socketService["socket"] && !isNewChat) {
      socketService["socket"].emit("typing_start", { chatId, user: userId });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Find the last message sent by the current user
  const lastUserMessageIndex = messages
    .map((msg, idx) => ({ idx, senderId: msg.senderId }))
    .filter((msg) => msg.senderId === userId)
    .pop()?.idx;

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    message: Message | null;
  }>({ visible: false, x: 0, y: 0, message: null });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");

  // Add this style block for animation
  const contextMenuStyle = `
    .custom-context-menu-anim {
      opacity: 0;
      transform: scale(0.95);
      animation: fadeScaleIn 0.18s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    @keyframes fadeScaleIn {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .custom-context-menu-light {
      background: #fff;
      color: #23272a;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.13);
      min-width: 180px;
      padding: 8px 0;
      font-size: 15px;
      border: none;
    }
    .custom-context-menu-item {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      padding: 12px 20px;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      transition: background 0.15s;
    }
    .custom-context-menu-item:hover {
      background: #f2f2f2;
    }
    .custom-context-menu-icon {
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  // Improved outside click handler for portal
  useEffect(() => {
    if (!contextMenu.visible) return;
    const handleClick = (e: MouseEvent) => {
      // Only close if click is outside the menu
      const menu = document.getElementById("custom-context-menu");
      if (menu && !menu.contains(e.target as Node)) {
        setContextMenu((c) => ({ ...c, visible: false }));
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [contextMenu.visible]);

  // Calculate menu position to prevent overflow
  const menuWidth = 200; // px
  const menuHeight = 100; // px (approximate, 2 items)
  let menuX = contextMenu.x;
  let menuY = contextMenu.y;
  if (typeof window !== "undefined") {
    if (menuX + menuWidth > window.innerWidth) {
      menuX = window.innerWidth - menuWidth - 8;
    }
    if (menuY + menuHeight > window.innerHeight) {
      menuY = window.innerHeight - menuHeight - 8;
    }
  }

  return (
    <div
      className={`w-full border-1 border-[#d2d2d2] items-center rounded-lg h-full flex flex-col max-h-[77vh]`}
    >
      {/* Animation style for context menu */}
      <style>{contextMenuStyle}</style>
      {/* Header */}
      <div className="h-[60px] w-[97%] border-b-1 border-[#d2d2d2] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Icon
            icon="ic:round-arrow-back"
            className="cursor-pointer"
            width="24"
            height="24"
            onClick={() => {
              setIsChatTextAreaOpen(false);
              handleLeaveChat();
              setMessages([]);

              // handleChats(); // Fetch previous chats again on close
            }}
          />
          <ProfileName name={name} online={isUserOnline(recipientId)} />
          <div>
            <p className="text-[15px] font-[500] ">{name}</p>
            {isUserOnline(recipientId) && typingInfo ? (
              <p className="text-[10px] font-[400] text-[#808080] ">
                typing...
              </p>
            ) : isUserOnline(recipientId) ? (
              <p className="text-[10px] font-[400] text-[#808080] ">online</p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="ic:round-more-vert" width="24" height="24" />
        </div>
      </div>

      {/* Chat Messages Area */}
      {isLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="flex-1 w-full overflow-y-auto z-250 bg-white px-3 pt-3 mb-3">
          <div className="flex flex-col gap-3 min-h-full">
            <>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-400 text-base font-medium py-10">
                  Start a conversation
                </div>
              ) : (
                (() => {
                  let lastMessageDate: string | null = null;
                  return messages.map((message, index) => {
                    const messageDate = new Date(message.createdAt);
                    const formattedDate = messageDate.toLocaleDateString();

                    // Optionally, show "Today" or "Yesterday"
                    const today = new Date();
                    const yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);

                    let dateLabel = formattedDate;
                    if (messageDate.toDateString() === today.toDateString()) {
                      dateLabel = "Today";
                    } else if (
                      messageDate.toDateString() === yesterday.toDateString()
                    ) {
                      dateLabel = "Yesterday";
                    }

                    const showDateSeparator =
                      !lastMessageDate || lastMessageDate !== formattedDate;
                    lastMessageDate = formattedDate;

                    return (
                      <React.Fragment key={index}>
                        {showDateSeparator && (
                          <DateSeparator date={dateLabel} />
                        )}
                        <div
                          className={`flex ${
                            message.senderId === userId
                              ? "justify-end"
                              : "justify-start"
                          } animate-fadeIn`}
                        >
                          <div
                            className={`max-w-[70%] md:max-w-[60%]  lg:max-w-[50%] px-4 py-2 rounded-2xl shadow-sm transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                              message.senderId === userId
                                ? "bg-[#f2f2f2] text-gray-800 rounded-br-md"
                                : "bg-primary text-white rounded-bl-md"
                            }`}
                            onContextMenu={(e) => {
                              if (message.senderId !== userId) return; // Only allow for own messages
                              e.preventDefault();
                              setContextMenu({
                                visible: true,
                                x: e.clientX,
                                y: e.clientY,
                                message,
                              });
                            }}
                          >
                            <p className="text-sm leading-relaxed break-words">
                              {message.content}
                            </p>
                            <p
                              className={`flex justify-between items-center gap-1 text-xs mt-1 ${
                                message.senderId === userId
                                  ? "text-gray-500 text-right"
                                  : "text-gray-200 text-left"
                              }`}
                            >
                              {formatTime(new Date(message.createdAt))}
                              {message.isEdited && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    marginLeft: 4,
                                    color:
                                      message.senderId === userId
                                        ? "#888"
                                        : "#f2f2f2",
                                  }}
                                >
                                  edited
                                </span>
                              )}
                              {message.senderId === userId &&
                                index === lastUserMessageIndex &&
                                (messageStatus === "sending" ? (
                                  <Icon
                                    icon="svg-spinners:clock"
                                    width="15"
                                    height="15"
                                    style={{ color: "#000" }}
                                  />
                                ) : messageStatus === "delivered" ? (
                                  <Icon
                                    icon="material-symbols:check-rounded"
                                    width="15"
                                    height="15"
                                    style={{ color: "#000" }}
                                  />
                                ) : null)}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  });
                })()
              )}
            </>

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="w-full bg-[#F2F2F2] gap-5 flex items-center px-3 rounded-b-lg h-[60px] flex-shrink-0">
        <div className="flex gap-2 items-center">
          <Icon
            icon="mingcute:emoji-fill"
            className="cursor-pointer"
            width="25"
            height="25"
            style={{ color: "#808080" }}
          />{" "}
          <Icon
            icon="material-symbols:image-rounded"
            className="cursor-pointer"
            width="25"
            height="25"
            style={{ color: "#808080" }}
          />
        </div>
        <input
          className="flex-1 outline-0 resize-none px-2 h-full py-2"
          placeholder={
            isNewChat && !newChatId ? "Creating chat..." : "Type a message"
          }
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {text.trim() ? (
          <Icon
            className={`transition-transform duration-200 hover:scale-110 ${"cursor-pointer"}`}
            icon="mynaui:send-solid"
            width="24"
            height="24"
            style={{ color: "#93221D" }}
            onClick={handleSendMessage}
          />
        ) : (
          <Icon
            className="cursor-pointer transition-transform duration-200 hover:scale-110"
            icon="ic:baseline-mic"
            width="24"
            height="24"
            style={{ color: "#93221D" }}
          />
        )}
      </div>
      {/* Context Menu rendered via Portal */}
      {contextMenu.visible &&
        ReactDOM.createPortal(
          <div
            id="custom-context-menu"
            className="custom-context-menu-anim custom-context-menu-light"
            style={{
              position: "fixed",
              top: menuY,
              left: menuX,
              zIndex: 9999,
              // Remove background, border, etc. (handled by class)
              // Add transition for smoothness
              transition:
                "opacity 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="custom-context-menu-item"
              onClick={() => {
                if (contextMenu.message?._id && contextMenu.message?.content) {
                  setMessageToEdit(contextMenu.message);
                  setEditText(contextMenu.message.content);
                  setShowEditModal(false);
                  setTimeout(() => setShowEditModal(true), 0);
                }
                setContextMenu((c) => ({ ...c, visible: false }));
              }}
            >
              <span className="custom-context-menu-icon">
                <Icon icon="mdi:pencil-outline" />
              </span>
              Edit message
            </button>
            <button
              className="custom-context-menu-item"
              onClick={() => {
                setContextMenu((c) => ({ ...c, visible: false }));
                setMessageToDelete(contextMenu.message);
                setShowDeleteModal(true);
              }}
            >
              <span className="custom-context-menu-icon">
                <Icon icon="mdi:trash-can-outline" />
              </span>
              Delete
            </button>
          </div>,
          document.body
        )}
      {/* Confirm Delete Modal */}
      {showDeleteModal &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 32,
                minWidth: 300,
                boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
                textAlign: "center",
              }}
            >
              <p style={{ marginBottom: 24 }}>
                Are you sure you want to delete this message?
              </p>
              <div
                style={{ display: "flex", justifyContent: "center", gap: 16 }}
              >
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: 6,
                    border: "none",
                    background: "#f2f2f2",
                    color: "#23272a",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMessageToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: 6,
                    border: "none",
                    background: "#93221D",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (messageToDelete?._id) {
                      socketService.deleteMessage(messageToDelete._id);
                      setMessages((prev) =>
                        prev.filter((msg) => msg._id !== messageToDelete._id)
                      );
                    }
                    setShowDeleteModal(false);
                    setMessageToDelete(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      {/* Edit Message Modal */}
      {showEditModal &&
        ReactDOM.createPortal(
          <div
            key={messageToEdit?._id}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 32,
                minWidth: 300,
                boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
                textAlign: "center",
              }}
            >
              <p style={{ marginBottom: 16 }}>Edit your message:</p>
              <input
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 24,
                  fontSize: 15,
                }}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
              />
              <div
                style={{ display: "flex", justifyContent: "center", gap: 16 }}
              >
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: 6,
                    border: "none",
                    background: "#f2f2f2",
                    color: "#23272a",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowEditModal(false);
                    setMessageToEdit(null);
                    setEditText("");
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: 6,
                    border: "none",
                    background: "#93221D",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  disabled={!editText.trim()}
                  onClick={async () => {
                    if (messageToEdit?._id && editText.trim()) {
                      try {
                        await socketService.editMessage(
                          messageToEdit._id,
                          editText
                        );
                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg._id === messageToEdit._id
                              ? { ...msg, content: editText, isEdited: true }
                              : msg
                          )
                        );
                      } catch (e) {
                        // Optionally show error
                      }
                    }
                    setShowEditModal(false);
                    setMessageToEdit(null);
                    setEditText("");
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ChatTextArea;
