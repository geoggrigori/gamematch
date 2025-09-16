import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Send, 
  Gamepad2, 
  Phone, 
  Video,
  MoreVertical,
  Heart,
  MessageCircle,
  Users
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('id');
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(chatId || '1');

  const matches = [
    {
      id: '1',
      nickname: 'ShadowHunter',
      username: 'shadowhunter99',
      avatar: '👤',
      isOnline: true,
      currentGame: 'Valorant',
      lastMessage: 'Bora jogar ranked agora?',
      lastMessageTime: '2 min',
      unreadCount: 2,
      matchedAt: 'Hoje'
    },
    {
      id: '2',
      nickname: 'MysticMage',
      username: 'mysticmage',
      avatar: '🧙‍♀️',
      isOnline: false,
      currentGame: null,
      lastMessage: 'Adorei seu setup! Que placa de vídeo você usa?',
      lastMessageTime: '1h',
      unreadCount: 0,
      matchedAt: 'Ontem'
    },
    {
      id: '3',
      nickname: 'SpeedRacer',
      username: 'speedracer2024',
      avatar: '🏎️',
      isOnline: true,
      currentGame: 'F1 24',
      lastMessage: 'Match!',
      lastMessageTime: '3h',
      unreadCount: 1,
      matchedAt: 'Ontem'
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: '2',
      content: 'Oi! Vi que você também joga Valorant 🎮',
      timestamp: '14:30',
      isMe: false
    },
    {
      id: 2,
      senderId: 'me',
      content: 'Opa! Que rank você tá?',
      timestamp: '14:32',
      isMe: true
    },
    {
      id: 3,
      senderId: '2',
      content: 'Diamante 2! E você?',
      timestamp: '14:33',
      isMe: false
    },
    {
      id: 4,
      senderId: 'me',
      content: 'Imortal 1! Bora jogar uns ranked?',
      timestamp: '14:35',
      isMe: true
    },
    {
      id: 5,
      senderId: '2',
      content: 'Siimmm! Qual seu nick no Valorant?',
      timestamp: '14:36',
      isMe: false
    },
    {
      id: 6,
      senderId: 'me',
      content: 'É TinderGamer#BR1. Te add lá!',
      timestamp: '14:37',
      isMe: true
    },
    {
      id: 7,
      senderId: '2',
      content: 'Bora jogar ranked agora?',
      timestamp: '14:38',
      isMe: false
    }
  ];

  const currentMatch = matches.find(m => m.id === selectedChat);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // TODO: Send message via Supabase realtime
    console.log('Sending message:', message);
    setMessage('');
  };

  // Chat List View
  if (!selectedChat || !currentMatch) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="gradient-gaming p-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Link to="/swipe">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Matches</h1>
            <Button variant="ghost" size="icon" className="text-white">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* New Matches */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Novos Matches
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {matches.filter(m => m.matchedAt === 'Hoje').map((match) => (
                <div key={match.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                  <div className="relative">
                    <div className="w-16 h-16 text-2xl bg-gradient-to-br from-gaming-blue to-gaming-purple rounded-full flex items-center justify-center">
                      {match.avatar}
                    </div>
                    {match.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-xs text-center font-medium truncate w-full">
                    {match.nickname}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Mensagens
            </h2>
            {matches.map((match) => (
              <Card key={match.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent 
                  className="p-4"
                  onClick={() => setSelectedChat(match.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 text-lg bg-gradient-to-br from-gaming-blue to-gaming-purple rounded-full flex items-center justify-center">
                        {match.avatar}
                      </div>
                      {match.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold truncate">{match.nickname}</p>
                        <span className="text-xs text-muted-foreground">
                          {match.lastMessageTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {match.lastMessage}
                        </p>
                        {match.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                            {match.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      {match.currentGame && (
                        <div className="flex items-center gap-1 mt-1">
                          <Gamepad2 className="w-3 h-3 text-gaming-purple" />
                          <span className="text-xs text-gaming-purple">
                            Jogando {match.currentGame}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Individual Chat View
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Chat Header */}
      <div className="gradient-gaming p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setSelectedChat('')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 text-lg bg-white/20 rounded-full flex items-center justify-center">
                {currentMatch.avatar}
              </div>
              {currentMatch.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
              )}
            </div>
            <div className="text-white">
              <p className="font-semibold">{currentMatch.nickname}</p>
              {currentMatch.isOnline && currentMatch.currentGame ? (
                <p className="text-xs opacity-80">
                  Jogando {currentMatch.currentGame}
                </p>
              ) : (
                <p className="text-xs opacity-80">
                  {currentMatch.isOnline ? 'Online' : 'Offline'}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-white">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Video className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              msg.isMe 
                ? 'gradient-gaming text-white' 
                : 'bg-muted'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" variant="gaming" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;