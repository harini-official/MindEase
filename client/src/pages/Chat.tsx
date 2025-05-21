import { useState } from 'react';
import { Helmet } from "react-helmet-async";
import ChatLobby from '@/components/chat/ChatLobby';
import ChatRoom from '@/components/chat/ChatRoom';

const Chat = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  const handleJoinRoom = (username: string, room: string) => {
    setUsername(username);
    setActiveRoom(room);
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
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
          {activeRoom ? (
            <ChatRoom 
              username={username} 
              room={activeRoom} 
              onLeave={handleLeaveRoom} 
            />
          ) : (
            <ChatLobby onJoinRoom={handleJoinRoom} />
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;