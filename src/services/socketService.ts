import io, { Socket } from 'socket.io-client';
import { AuthApis } from '../api';

interface MessageData {
  chatId: string;
  content: string;
  messageType: 'text';
  tempId: number;
}



interface AuthenticationData {
  userId: string;
}

type MessageCallback = (message: any) => void;
type DeliveryCallback = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private userId: string | null = null;
  private authApis = new AuthApis();

connect(userId: string, onConnect?: () => void, serverUrl: string = "https://r-report-v1.onrender.com"): void {
    this.userId = userId;

    console.log('Connecting to socket server...');

    this.socket = io(serverUrl, {
      timeout: 10000,
      transports: ['websocket', 'polling'],
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to socket server');
      this.isConnected = true;

      const authData: AuthenticationData = { userId: this.userId! };
      this.socket?.emit('authenticate', authData);
      console.log('🔐 Authentication sent');
      if (onConnect) onConnect();
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('❌ Socket connection failed:', error);
      this.isConnected = false;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from socket server');
      this.isConnected = false;
    });
  }

  joinChat(chatId: string): void {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return;
    }

    console.log(`📨 Joining chat room: ${chatId}`);
    this.socket.emit('join_chat', { chatId });

    // Remove any previous listener before adding a new one
    this.socket.off('joined_chat');
    this.socket.on('joined_chat', (data: any) => {
      console.log('✅ Successfully joined chat:', data);
    });

    this.socket.on('error', (error: any) => {
      console.error('❌ Error joining chat:', error);
    });
    
  }

  subscribeToLastMessage(): void {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return;
    }
    console.log("subscribing to last messages");
    this.socket.emit('subscribe_to_last_messages');
  }

  onLastMessageUpdate(callback: any): void {
    this.socket?.on('last_message_update', (data: any) => {
      callback(data);
    });
  }

 
  

  sendMessage(chatId: string, content: string): void {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return;
    }

    const messageData: MessageData = {
      chatId,
      content,
      messageType: 'text',
      tempId: Date.now(),
    };

    
    this.socket.emit('send_message', messageData);
  }

  sendVoiceNote(chatId: string, audioData: string, duration: number): void {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return;
    }

    const voiceNoteData = {
      chatId,
      audioData,
      duration,
      tempId: Date.now(),
    };

    this.socket.emit('send_voice_note', voiceNoteData);
  }

  sendDocument(chatId: string, documentData: any): void {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return;
    }

    // Always upload via endpoint for all files
    this.uploadFileAndSendMetadata(chatId, documentData);
  }

  private async uploadFileAndSendMetadata(chatId: string, file: File): Promise<void> {
    try {
     
      
      // Upload file using the API service
      const response = await this.authApis.uploadFile(file, chatId);
      
      
      
      if (
        response &&
        typeof response === 'object' &&
        'data' in response &&
        response.data &&
        typeof response.data === 'object' &&
        'data' in response.data
      ) {
        const uploadResult = response.data.data as any;
        
        
        // Send only the file metadata through socket
        const MediaData = {
          chatId: chatId,
          fileData: uploadResult.fileData || {
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            url: uploadResult.fileUrl || uploadResult.url || '', // URL from server
            duration: 0,
            timestamp: Date.now(),
          },
          messageContent: uploadResult.messageContent || file.name,
          messageType:'file',
          
        };

        
        this.socket?.emit("send_uploaded_media", MediaData);
      } else {
        console.error('❌ Invalid response structure:', response);
        throw new Error('File upload failed - invalid response structure');
      }

    } catch (error) {
      console.error('❌ Error uploading file:', error);
      console.error('❌ Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Emit error event that the UI can handle
      this.socket?.emit('media_upload_error', {
        chatId,
        fileName: file.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  onMedia_Error(callback: any): void {
    this.socket?.off('media_error');
    this.socket?.off('media_upload_error');
    this.socket?.on('media_error', (data: any) => {
      callback(data);
    });
    this.socket?.on('media_upload_error', (data: any) => {
      callback(data);
    });
  }

  onMedia_Delivered(callback: any): void {
    this.socket?.off('media_delivered');
    this.socket?.off('media_upload_success');
    this.socket?.on('media_delivered', (data: any) => {
      callback(data);
    });
    this.socket?.on('media_upload_success', (data: any) => {
      callback(data);
    });
  }

  requestVoiceNoteUrl(filePath: string, requestId?: string): void {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return;
    }

    
    this.socket.emit('get_voice_note_url', { filePath, requestId });
  }

  onVoiceNoteUrl(callback: (data: { filePath: string; signedUrl: string; requestId?: string }) => void): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.on('voice_note_url', (data: any) => {
      callback(data);
    });
  }

  offVoiceNoteUrl(callback: (data: { filePath: string; signedUrl: string; requestId?: string }) => void): void {
    if (!this.socket) return;
    this.socket.off('voice_note_url', callback);
  }
    
  onVoiceNoteError(callback: (data: { filePath: string; error: string; requestId?: string }) => void): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.on('voice_note_error', (data: any) => {
      console.log("voice_note_error", data);
      callback(data);
    });
  }

  offVoiceNoteError(callback: (data: { filePath: string; error: string; requestId?: string }) => void): void {
    if (!this.socket) return;
    this.socket.off('voice_note_error', callback);
  }

  onNewVoiceNote(callback: any): void {
    this.socket?.off('voice_note_delivered');
    this.socket?.on('voice_note_delivered', (data: any) => {
      callback(data);
    });
  }

  deleteMessage( messageId: string): void {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('delete_message', { messageId });
  }

  editMessage(messageId: string, content: string): void {
    if (!this.isConnected || !this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('edit_message', { messageId, content });
  }
 
  onUserGlobalStatus(callback: any): void {
    this.socket?.on('user_global_status', (data: any) => {
      
      
      // Call the callback with the status data
      callback(data);
    });
  }

  
  onNewMessage(callback: MessageCallback): void {

    this.socket?.off('new_message');
    
    
    this.socket?.on('new_message', (message: any) => { 
    
      callback(message);
      
      
       // Show browser notification if tab is not active
      //  if (
      //   "Notification" in window &&
      //   Notification.permission === "granted" &&
      //   document.visibilityState !== "visible"
      // ) {
      //   new Notification("New Message", {
      //     body: message.content,
      //     icon: "/assets/chat-active.svg",
      //   });
      // }
    });
  }




  
  
 

 

  offNewMessage(callback: MessageCallback): void {
    this.socket?.off('new_message', callback);
  }

  onOnlineUsersList(callback: any): void {
    this.socket?.on('online_users_list', (data: any) => {
     
      callback(data);
    });
  }

  

  onMessageDelivered(callback: DeliveryCallback): void {
    this.socket?.off('message_delivered');
    this.socket?.on('message_delivered', (data: any) => {
      callback(data);  
    });
    
  }

  offMessageDelivered(callback: DeliveryCallback): void {
    this.socket?.off('message_delivered', callback);
  }

 

  chatDetails(callback: any): void {
    this.socket?.on('chat_details', (data: any) => {
      callback(data);
      console.log("chat_details", data);
    });
  }

  onLeaveChat(chatId: string): void {
    this.socket?.off('left_chat');
    this.socket?.emit('leave_chat', { chatId })
    
   ;
 
  }

  

  onLeftChat(callback: any): void {
    this.socket?.on('left_chat', (data: any) => {
      console.log("left_chat", data);
      callback(data);
    });
  }




  onUserOffline(callback: any): void {
    this.socket?.on('user_offline', (data: any) => {
      
      callback(data);
    });
  }

  onUserOnline(callback: any): void {
    this.socket?.on('user_online', (data: any) => {
      
      callback(data);
    });
  }

  onMarkMessageRead(callback: any): void {
    this.socket?.emit('mark_message_read', (data: any) => {
      console.log('✅ Message read by:', data);
      callback(data);
    });
  }

  onMessageRead(callback: any): void {
    this.socket?.on('message_read', (data: any) => {
      console.log('✅ Message read:', data);
      callback(data);
    });
  }

  onTyping(callback: any): void {
    this.socket?.off('user_typing');
    this.socket?.on('user_typing', (data: any) => {
      callback(data);
    });
  }

  offTyping(callback: any): void {
    this.socket?.off('user_typing', callback);
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket !== null;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

const socketService = new SocketService();
export default socketService;
