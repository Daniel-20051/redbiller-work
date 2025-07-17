import { useState, useRef, useEffect, use } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ProfileName from "./ProfileName";
import socketService from "../services/socketService";
import { UserDetailsContext } from "../context/AuthContext.js";
import MessageSkeleton from "./MessageSkeleton";
import { AuthApis } from "../api";

interface Message {
  content: string;
  createdAt: string | number | Date;
  [key: string]: any;
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
}: {
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
}) => {
  const { userDetails, socketConnected, isUserOnline } =
    use(UserDetailsContext);
  const [text, setText] = useState("");

  const [typingInfo, setTypingInfo] = useState<string | null>(null);

  const [messageStatus, setMessageStatus] = useState<string | null>("sent");

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
      // Clear messages and set loading when starting a new chat
      setMessages([]);
      setText(""); // Clear any existing text input

      setTypingInfo(null);
    }
  }, [isNewChat]);

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
            // Set loading to false since we now have messages
            setIsLoading(false);
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

  return (
    <div
      className={`w-full border-1 border-[#d2d2d2] items-center rounded-lg h-full flex flex-col max-h-[77vh]`}
    >
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
            }}
          />
          <ProfileName name={name} online={isUserOnline(userId)} />
          <div>
            <p className="text-[15px] font-[500] ">{name}</p>
            {typingInfo && (
              <p className="text-[10px] font-[400] text-[#808080] ">
                typing...
              </p>
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
        <div className="flex-1 w-full overflow-y-auto bg-white px-3 pt-3 mb-3">
          <div className="flex flex-col gap-3 min-h-full">
            <>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-400 text-base font-medium py-10">
                  Start a conversation
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
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
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {message.content}
                      </p>
                      <p
                        className={`flex items-center gap-1 text-xs mt-1 ${
                          message.senderId === userId
                            ? "text-gray-500 text-right"
                            : "text-gray-200 text-left"
                        }`}
                      >
                        {formatTime(new Date(message.createdAt))}
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
                ))
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
    </div>
  );
};

export default ChatTextArea;
