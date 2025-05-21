import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Message {
  type: 'message' | 'system';
  content: string;
  username: string;
  timestamp: string;
  room: string;
}

interface ChatRoomProps {
  username: string;
  room: string;
  onLeave: () => void;
}

const ChatRoom = ({ username, room, onLeave }: ChatRoomProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    websocketRef.current = new WebSocket(wsUrl);
    
    // Connection opened
    websocketRef.current.addEventListener('open', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
      
      // Join the specified room
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'join',
          username,
          room
        }));
      }
    });
    
    // Listen for messages
    websocketRef.current.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
          case 'system':
            setMessages(prevMessages => [...prevMessages, data]);
            break;
          case 'room_users':
            setActiveUsers(data.users);
            break;
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    
    // Connection closed
    websocketRef.current.addEventListener('close', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
      
      toast({
        title: "Disconnected",
        description: "You've been disconnected from the chat server",
        variant: "destructive"
      });
    });
    
    // Connection error
    websocketRef.current.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      
      toast({
        title: "Connection Error",
        description: "There was an error connecting to the chat server",
        variant: "destructive"
      });
    });
    
    // Clean up on component unmount
    return () => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'leave',
          username,
          room
        }));
        
        websocketRef.current.close();
      }
    };
  }, [username, room, toast]);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending messages
  const sendMessage = () => {
    if (message.trim() && isConnected && websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'message',
        content: message.trim(),
        room
      }));
      
      setMessage('');
    }
  };
  
  // Handle leaving the room
  const handleLeave = () => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'leave',
        username,
        room
      }));
    }
    
    onLeave();
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get initials from username for avatar
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };
  
  return (
    <div className="h-full flex flex-col">
      <Card className="w-full h-full flex flex-col shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-medium">
                {room} {!isConnected && <span className="text-red-500">(Disconnected)</span>}
              </CardTitle>
              <CardDescription>
                You are chatting as <span className="font-semibold">{username}</span>
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleLeave}>
              Leave Room
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Chat messages */}
          <div className="flex-1 flex flex-col overflow-hidden p-2">
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex gap-3 ${
                        msg.type === 'system' 
                          ? 'justify-center' 
                          : msg.username === username 
                            ? 'justify-end' 
                            : 'justify-start'
                      }`}
                    >
                      {msg.type === 'system' ? (
                        <div className="text-center">
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            {msg.content}
                          </Badge>
                        </div>
                      ) : msg.username === username ? (
                        <div className="flex flex-row-reverse gap-2 max-w-[80%]">
                          <Avatar className="h-8 w-8 bg-primary">
                            <AvatarFallback>{getInitials(username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                              {msg.content}
                            </div>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 max-w-[80%]">
                          <Avatar className="h-8 w-8 bg-secondary">
                            <AvatarFallback>{getInitials(msg.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <div className="rounded-lg bg-muted p-3 text-muted-foreground">
                              {msg.content}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium">
                                {msg.username}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(msg.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
            
            <div className="pt-4 px-4">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!isConnected || !message.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active users sidebar */}
          <div className="w-56 border-l p-4 hidden md:block">
            <h3 className="font-medium mb-2">Active Users ({activeUsers.length})</h3>
            <Separator className="mb-2" />
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-2">
                {activeUsers.map((user) => (
                  <div 
                    key={user} 
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className={user === username ? "font-medium" : ""}>
                      {user} {user === username && "(You)"}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatRoom;