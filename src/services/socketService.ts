import io, { Socket } from 'socket.io-client';

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

connect(userId: string, serverUrl: string = "https://r-report-v1.onrender.com"): void {
    this.userId = userId;

    console.log('Connecting to socket server...');

    this.socket = io(serverUrl, {
      timeout: 10000,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to socket server');
      this.isConnected = true;

      const authData: AuthenticationData = { userId: this.userId! };
      this.socket?.emit('authenticate', authData);
      console.log('🔐 Authentication sent');
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



onLastMessage(callback: any): void {
  this.socket?.on('last_message', (data: any) => {
    callback(data);
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
