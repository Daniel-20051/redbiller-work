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

    console.log('📤 Sending message:', messageData);
    this.socket.emit('send_message', messageData);
  }

  onNewMessage(callback: MessageCallback): void {
    this.socket?.on('new_message', (message: any) => {
      console.log('📨 New message received:', message);
      callback(message);
    });
  }

  onMessageDelivered(callback: DeliveryCallback): void {
    this.socket?.on('message_delivered', (data: any) => {
      console.log('✅ Message delivered:', data);
      callback(data);
    });
  }

  onReadBy(callback: DeliveryCallback): void {
    this.socket?.on('mark_message_read', (data: any) => {
      console.log('✅ Message read by:', data);
      callback(data);
    });
  }

  onTyping(callback: DeliveryCallback): void {
    this.socket?.on('user_typing', (data: any) => {
      console.log('✍️ Typing event received:', data);
      callback(data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new SocketService();
