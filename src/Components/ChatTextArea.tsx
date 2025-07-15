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
}) => {
  const { userDetails } = use(UserDetailsContext);
  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [typingInfo, setTypingInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      setIsConnected(false);
      setTypingInfo(null);
    }
  }, [isNewChat]);

  useEffect(() => {
    // Only connect to socket when both userId and chatId are provided, chat is active, and it's not a new chat
    if (userId && chatId && isChatTextAreaOpen && !isNewChat) {
      // Connect to socket on mount
      socketService.connect(userId);

      const socket = socketService["socket"];

      if (socket) {
        // Connection handlers
        socket.on("connect", () => {
          setIsConnected(true);
          setIsLoading(false);
          socketService.joinChat(chatId);
        });

        socket.on("disconnect", () => {
          setIsConnected(false);
          setIsLoading(true);
        });
      }

      socketService.onNewMessage((message: any) => {
        console.log("📨 New message received in ChatTextArea:", message);

        // Transform the socket message to match our Message interface
        const newMessage: Message = {
          content: message.content,
          createdAt: message.createdAt,
          senderId: message.senderId,
          isSent: message.senderId === userId,
        };

        setMessages((prev) => [...prev, newMessage]);
      });

      socketService.onMessageDelivered((data: any) => {
        console.log("Message was delivered:", data);
      });

      // Typing event listener
      socketService.onTyping((data: any) => {
        setTypingInfo(`${data.user || "Someone"} is typing...`);
        setTimeout(() => setTypingInfo(null), 1500);
      });
    } else if (!isChatTextAreaOpen && isConnected) {
      // Disconnect when chat becomes inactive
      socketService.disconnect();
      setIsConnected(false);
      setIsLoading(true);
      setTypingInfo(null);
    } else if (isNewChat) {
      // For new chats, always start with loading state
      setIsLoading(true);
      setIsConnected(false);

      if (newChatId) {
        // Load previous messages for the new chat
        const loadPreviousMessages = async () => {
          try {
            const response: any = await authApis.getAllMessages(newChatId);
            if (response?.data?.data?.messages) {
              setMessages(response.data.data.messages);
            }
          } catch (error) {
            console.log("Error loading previous messages:", error);
          } finally {
            setIsLoading(false);
          }
        };

        loadPreviousMessages();
      }
    } else if (!isNewChat && chatId) {
      // When transitioning from new chat to existing chat, load messages
      const loadMessages = async () => {
        try {
          setIsLoading(true);
          const response: any = await authApis.getAllMessages(chatId);
          if (response?.data?.data?.messages) {
            setMessages(response.data.data.messages);
          }
        } catch (error) {
          console.log("Error loading messages:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadMessages();
    }

    // Cleanup function
    return () => {
      if (isConnected) {
        socketService.disconnect();
        setIsConnected(false);
      }
    };
  }, [userId, chatId, isChatTextAreaOpen, isNewChat, newChatId]);

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
          }
        } catch (error) {
          setIsLoading(false);

          console.log(error);
          return [];
        }
      } else if (isConnected) {
        // Send message via socket for existing chats
        socketService.sendMessage(chatId, text);
        setText("");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (isConnected && socketService["socket"] && !isNewChat) {
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

  return (
    <div
      className={` w-full  border-1   border-[#d2d2d2] items-center rounded-lg h-full  flex-col max-h-[80vh] `}
    >
      <div className="h-[60px] w-[97%] border-b-1 border-[#d2d2d2] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="ic:round-arrow-back"
            className="cursor-pointer"
            width="24"
            height="24"
            onClick={() => {
              setIsChatTextAreaOpen(false);
            }}
          />
          <ProfileName name={name} />
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
      <div className="flex-1 px-3 pt-3 mb-3 w-full overflow-y-auto bg-white">
        <div className="flex flex-col gap-3 h-full">
          {isLoading ? (
            <MessageSkeleton />
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  } animate-fadeIn`}
                >
                  <div
                    className={`max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-4 py-2 rounded-2xl shadow-sm transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                      message.senderId === userId
                        ? "bg-[#f2f2f2] text-gray-800 rounded-br-md"
                        : "bg-primary text-white rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === userId
                          ? "text-gray-500 text-right"
                          : "text-gray-200 text-left"
                      }`}
                    >
                      {formatTime(new Date(message.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className=" w-full bg-[#F2F2F2] gap-5 flex items-center px-3 rounded-b-lg h-[60px]">
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
            isNewChat && !newChatId
              ? "Creating chat..."
              : isNewChat && isLoading
              ? "Loading messages..."
              : isLoading
              ? "Connecting..."
              : "Type a message"
          }
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        {text.trim() ? (
          <Icon
            className={`transition-transform duration-200 hover:scale-110 ${
              isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            icon="mynaui:send-solid"
            width="24"
            height="24"
            style={{ color: "#93221D" }}
            onClick={!isLoading ? handleSendMessage : undefined}
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
