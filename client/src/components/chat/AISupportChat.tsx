import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Send } from 'lucide-react';
import axios from 'axios';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

interface AISupportChatProps {
  onClose: () => void;
}

export function AISupportChat({ onClose }: AISupportChatProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: 'system',
      content: "Hello! I'm Claude, your emotional support assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle Claude response
  const claudeMutation = useMutation({
    mutationFn: async (data: { message: string, chatHistory: { role: 'user' | 'assistant', content: string }[] }) => {
      const response = await axios.post('/api/ai-chat/response', data);
      return response.data;
    },
    onSuccess: (data: any) => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    },
    onError: (error) => {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        role: 'system',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    setChatHistory((prev) => [...prev, userMessage]);
    
    // Format chat history for API request
    const historyForAPI = chatHistory
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));
    
    // Get response from Claude
    claudeMutation.mutate({
      message,
      chatHistory: historyForAPI,
    });
    
    // Clear input field
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-3xl h-[600px] flex flex-col shadow-lg">
      <CardHeader className="bg-blue-50 dark:bg-blue-950 rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/images/claude-avatar.png" alt="Claude" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-medium">AI Support Chat</div>
            <div className="text-sm text-muted-foreground">Powered by Claude</div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <ScrollArea ref={scrollRef} className="flex-1 p-4 overflow-y-auto">
        <CardContent className="space-y-4 pb-2">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role !== 'user' ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : msg.role === 'system'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-blue-100 dark:bg-blue-900 text-foreground'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {claudeMutation.isPending && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-lg p-3 bg-blue-50 dark:bg-blue-900">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Claude is typing...</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
      
      <Separator />
      
      <CardFooter className="p-3">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1 resize-none"
            rows={2}
            disabled={claudeMutation.isPending}
          />
          <div className="flex flex-col gap-2">
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              disabled={!message.trim() || claudeMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              ✕
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AISupportChat;