import { useState } from 'react';
import { Helmet } from "react-helmet-async";
import ChatLobby from '@/components/chat/ChatLobby';
import ChatRoom from '@/components/chat/ChatRoom';
import AISupportChat from '@/components/chat/AISupportChat';
import { Button } from '@/components/ui/button';
import { HeartPulse } from 'lucide-react';

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [showAISupport, setShowAISupport] = useState(false);

  const handleJoinRoom = (username: string, room: string) => {
    setUsername(username);
    setActiveRoom(room);
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
  };

  const toggleAISupport = () => {
    setShowAISupport(prev => !prev);
  };

  return (
    <>
      <Helmet>
        <title>Student Chat Community | MindEase</title>
        <meta 
          name="description" 
          content="Connect with other students in our chat community. Share study tips, find support for exam stress, and build connections." 
        />
        <meta property="og:title" content="Student Chat Community | MindEase" />
        <meta 
          property="og:description" 
          content="Connect with fellow students in our supportive chat community." 
        />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-[80vh] bg-white dark:bg-neutral-900 py-6">
        <div className="container mx-auto">
          {showAISupport ? (
            <div className="flex flex-col items-center">
              <AISupportChat onClose={toggleAISupport} />
            </div>
          ) : (
            <>
              {activeRoom ? (
                <ChatRoom 
                  username={username} 
                  room={activeRoom} 
                  onLeave={handleLeaveRoom} 
                />
              ) : (
                <ChatLobby onJoinRoom={handleJoinRoom} />
              )}
              
              <div className="fixed bottom-6 right-6">
                <Button 
                  onClick={toggleAISupport}
                  className="rounded-full p-4 h-14 w-14 flex items-center justify-center bg-purple-600 hover:bg-purple-700"
                >
                  <HeartPulse className="h-6 w-6" />
                  <span className="sr-only">AI Emotional Support</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;