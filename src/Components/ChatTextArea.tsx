import React, { useState, useRef, useEffect, use } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ProfileName from "./ProfileName";
import socketService from "../services/socketService";
import { UserDetailsContext } from "../context/AuthContext.js";
import MessageSkeleton from "./MessageSkeleton";
import { AuthApis } from "../api";
import DateSeparator from "./DateSeparator";
import CustomAudioPlayer from "./CustomAudioPlayer";
import DocumentMessage from "./DocumentMessage";
import ContextMenu from "./ContextMenu";
import EmojiSelector from "./EmojiSelector";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  const [typingInfo, setTypingInfo] = useState<string | null>(null);

  const [messageStatus, setMessageStatus] = useState<string | null>(
    "delivered"
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              fileData: {
                ...message.fileData,
                url: message.fileData?.url || message.fileData?.fileUrl || "", // Ensure URL is included
              },
              content: message.content,
              messageType: message.messageType,
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

      // Handle media upload completion
      const handleMediaDelivered = (data: any) => {
        setIsUploading(false);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);

        // Update the message with the file URL if available
        if (data && data.fileData && data.fileData.url) {
          setMessages((prev) =>
            prev.map((msg) => {
              // Clean up temporary URL if it exists
              if (msg.fileData?.url && msg.fileData.url.startsWith("blob:")) {
                URL.revokeObjectURL(msg.fileData.url);
              }

              return msg._id === data.tempId || msg._id === data._id
                ? {
                    ...msg,
                    fileData: {
                      ...msg.fileData,
                      url: data.fileData.url,
                    },
                  }
                : msg;
            })
          );
        }
      };

      // Handle media upload errors
      const handleMediaError = (data: any) => {
        console.error("Media upload error:", data);
        setIsUploading(false);
        setUploadProgress(0);
        alert(`Failed to upload ${data.fileName}: ${data.error}`);
      };

      // Register handlers
      socketService.onNewMessage(handleNewMessage);
      socketService.onTyping(handleTyping);
      socketService.onMessageDelivered(handleDelivered);
      socketService.onMedia_Delivered(handleMediaDelivered);
      socketService.onMedia_Error(handleMediaError);

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
        socketService.subscribeToLastMessage();
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

  const handleEmojiClick = (emojiObject: any) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const extractDurationFromContent = (content: string): number => {
    // Match pattern like "(14s)" or "(1m 30s)" or "(2m)"
    const durationMatch = content.match(/\((\d+m?\s*\d*s?)\)/);
    if (durationMatch) {
      const durationStr = durationMatch[1];
      let totalSeconds = 0;

      // Extract minutes
      const minutesMatch = durationStr.match(/(\d+)m/);
      if (minutesMatch) {
        totalSeconds += parseInt(minutesMatch[1]) * 60;
      }

      // Extract seconds
      const secondsMatch = durationStr.match(/(\d+)s/);
      if (secondsMatch) {
        totalSeconds += parseInt(secondsMatch[1]);
      }

      return totalSeconds;
    }

    return 0;
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

  // Handle clicking outside emoji picker
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEmojiPicker]);

  // Handle window resize for responsive emoji picker
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleSendVoiceNote = (audioData: string, duration: number) => {
    socketService.sendVoiceNote(chatId, audioData, duration);

    // Use duration if it exists, otherwise extract from content
    let finalDuration = duration;
    if (!duration || duration <= 0) {
      finalDuration = extractDurationFromContent("Voice note");
    }

    setMessages((prev) => [
      ...prev,
      {
        fileData: {
          filename: audioUrl || "",
          duration: finalDuration,
        },
        content: "Voice note",
        messageType: "voice",
        createdAt: new Date(),
        senderId: userId,
        isSent: true,
      },
    ]);
  };

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );

  // Send voice note when both audioBase64 and audioDuration are available
  useEffect(() => {
    if (audioBase64 && audioDuration !== null) {
      handleSendVoiceNote(audioBase64, audioDuration);
      // Reset states after sending
      setAudioBase64(null);
      setAudioDuration(null);
      setAudioUrl(null);
    }
    socketService.onNewVoiceNote((data: any) => {
      console.log(data, "data");
    });
  }, [audioBase64, audioDuration]);

  const handleRecordClick = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorder?.stop();
      setIsRecording(false);
      // Send voice note if base64 is available

      // Calculate duration from start time
      if (recordingStartTime) {
        const duration = (Date.now() - recordingStartTime) / 1000; // Convert to seconds
        setAudioDuration(duration);
        setRecordingStartTime(null);
      }

      return;
    }

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingStartTime(Date.now()); // Record start time

      let chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg" });
        setAudioUrl(URL.createObjectURL(blob));
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result?.toString().split(",")[1] || null;
          setAudioBase64(base64String);
        };
        reader.readAsDataURL(blob);
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        chunks = [];
      };
      recorder.start();
    } catch (err) {
      setIsRecording(false);
      setRecordingStartTime(null);
      // Optionally show error
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create a temporary message to show in the chat
      const tempMessageId = Date.now().toString();
      const fileUrl = URL.createObjectURL(file); // Create temporary URL for immediate preview
      const fileMessage = {
        content: `${file.name} `,
        messageType: "file",
        fileData: {
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: fileUrl, // Use temporary URL for immediate preview
          duration: 0,
          timestamp: Date.now(),
        },
        createdAt: new Date(),
        senderId: userId,
        _id: tempMessageId,
      };

      setMessages((prev) => [...prev, fileMessage]);

      // Send document to socket (this will handle upload for large files)
      socketService.sendDocument(chatId, file);

      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += Math.random() * 6 + 3; // Slower progress for large files
        if (progress >= 85) {
          // Stop at 90% until we get confirmation
          progress = 90;
          clearInterval(uploadInterval);
        }
        setUploadProgress(progress);
      }, 300);
    } catch (error) {
      console.error("Error handling file:", error);
      alert("Failed to process file. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
              socketService.subscribeToLastMessage();
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
              <p className="text-[10px] font-[400] text-[#808080] ">offline</p>
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
                            className={`max-w-[70%] md:max-w-[60%]  lg:max-w-[50%] px-2 py-1 rounded-2xl shadow-sm transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
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
                            {message.messageType === "voice" ? (
                              <CustomAudioPlayer
                                src={message.fileData?.filename}
                                isOwnMessage={message.senderId === userId}
                                duration={
                                  message.fileData?.duration ||
                                  extractDurationFromContent(message.content)
                                }
                              />
                            ) : message.messageType === "file" ||
                              message.messageType === "photo" ? (
                              <DocumentMessage
                                message={message}
                                isOwnMessage={message.senderId === userId}
                                isUploading={
                                  isUploading &&
                                  message._id ===
                                    messages[messages.length - 1]?._id
                                }
                                uploadProgress={uploadProgress}
                              />
                            ) : (
                              <p className="text-sm leading-relaxed break-words">
                                {message.content}
                              </p>
                            )}
                            <p
                              className={`flex justify-between items-center gap-1 text-[10.5px] mt-1 ${
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
      <div className="w-full bg-[#F2F2F2] gap-5 flex items-center px-3 rounded-b-lg h-[60px] flex-shrink-0 relative">
        <div className="flex gap-2 items-center">
          <Icon
            icon="mingcute:emoji-fill"
            className="cursor-pointer"
            width="25"
            height="25"
            style={{ color: "#808080" }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />{" "}
          <Icon
            icon={"fluent:attach-12-filled"}
            width="25"
            height="25"
            style={{ color: "#808080" }}
            className="cursor-pointer"
            onClick={
              isUploading ? undefined : () => fileInputRef.current?.click()
            }
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.mp4,.mp3"
            onChange={handleFileUpload}
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
            className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${
              isRecording ? "animate-pulse" : ""
            }`}
            icon="ic:baseline-mic"
            width="24"
            height="24"
            style={{ color: isRecording ? "#d32f2f" : "#93221D" }}
            onClick={handleRecordClick}
          />
        )}

        {/* Emoji Selector */}
        <EmojiSelector
          visible={showEmojiPicker}
          onEmojiClick={handleEmojiClick}
          onClose={() => setShowEmojiPicker(false)}
          screenSize={screenSize}
        />
      </div>
      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={menuX}
        y={menuY}
        message={contextMenu.message}
        onEdit={(message) => {
          setMessageToEdit(message);
          setShowEditModal(false);
          setTimeout(() => setShowEditModal(true), 0);
        }}
        onDelete={(message) => {
          setMessageToDelete(message);
          setShowDeleteModal(true);
        }}
        onClose={() => setContextMenu((c) => ({ ...c, visible: false }))}
      />
      {/* Delete Modal */}
      <DeleteModal
        visible={showDeleteModal}
        onConfirm={() => {
          if (messageToDelete?._id) {
            socketService.deleteMessage(messageToDelete._id);
            setMessages((prev) =>
              prev.filter((msg) => msg._id !== messageToDelete._id)
            );
          }
          setShowDeleteModal(false);
          setMessageToDelete(null);
        }}
        onCancel={() => {
          setShowDeleteModal(false);
          setMessageToDelete(null);
        }}
      />
      {/* Edit Modal */}
      <EditModal
        visible={showEditModal}
        message={messageToEdit}
        onSave={async (messageId, newContent) => {
          if (newContent.trim()) {
            try {
              await socketService.editMessage(messageId, newContent);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg._id === messageId
                    ? { ...msg, content: newContent, isEdited: true }
                    : msg
                )
              );
            } catch (e) {
              // Optionally show error
            }
          }
          setShowEditModal(false);
          setMessageToEdit(null);
        }}
        onCancel={() => {
          setShowEditModal(false);
          setMessageToEdit(null);
        }}
      />
    </div>
  );
};

export default ChatTextArea;
