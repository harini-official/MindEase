import { useState } from 'react';
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ChatLobbyProps {
  onJoinRoom: (username: string, room: string) => void;
}

// List of available chat rooms
const AVAILABLE_ROOMS = [
  { id: 'study-tips', name: 'Study Tips & Techniques' },
  { id: 'exam-stress', name: 'Exam Stress Support' },
  { id: 'wellness', name: 'Wellness & Self-Care' },
  { id: 'motivation', name: 'Motivation Corner' },
  { id: 'tech-help', name: 'Tech Help' },
  { id: 'general', name: 'General Chat' },
];

const ChatLobby = ({ onJoinRoom }: ChatLobbyProps) => {
  const [username, setUsername] = useState('');
  const [customRoom, setCustomRoom] = useState('');
  const [isCustomRoom, setIsCustomRoom] = useState(false);
  const { toast } = useToast();

  const handleJoinRoom = (roomId: string, roomName: string) => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to join the chat room",
        variant: "destructive"
      });
      return;
    }

    onJoinRoom(username, roomName);
  };

  const handleJoinCustomRoom = () => {
    if (!username.trim() || !customRoom.trim()) {
      toast({
        title: "Information Required",
        description: "Please enter both username and room name",
        variant: "destructive"
      });
      return;
    }

    onJoinRoom(username, customRoom);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
          Student Chat Community
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Connect with other students, share study tips, get support for exam stress, 
          or just chat about your day in our wellness community.
        </p>
      </div>

      <div className="mb-8">
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle>Join a Chat Room</CardTitle>
            <CardDescription>
              Enter your nickname and select a room to start chatting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Your Nickname</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your nickname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This is how other students will see you in the chat
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="h-px flex-1 bg-muted"></div>
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-muted"></div>
              </div>

              {isCustomRoom ? (
                <div className="space-y-2">
                  <Label htmlFor="custom-room">Create Your Own Room</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="custom-room"
                      placeholder="Enter room name"
                      value={customRoom}
                      onChange={(e) => setCustomRoom(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleJoinCustomRoom}>
                      Join Room
                    </Button>
                  </div>
                  <Button
                    variant="link"
                    onClick={() => setIsCustomRoom(false)}
                    className="px-0"
                  >
                    Back to room list
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCustomRoom(true)}
                    className="w-full"
                  >
                    Create Your Own Room
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AVAILABLE_ROOMS.map((room) => (
          <Card key={room.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{room.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Connect with students and discuss {room.id.replace('-', ' ')} related topics.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleJoinRoom(room.id, room.name)}
                className="w-full group-hover:bg-primary-dark transition-colors"
                disabled={!username.trim()}
              >
                Join Room
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatLobby;