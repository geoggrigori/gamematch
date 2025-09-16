import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Camera, 
  Edit2, 
  Settings, 
  Crown,
  Gamepad2,
  Clock,
  Monitor,
  MessageSquare,
  Music,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('GamerPro2024');
  const [username, setUsername] = useState('gamerpro');
  const [bio, setBio] = useState('Apaixonado por RPGs e FPS competitivo. Sempre procurando novas aventuras e parceiros de jogo!');

  const topGames = [
    { name: 'Valorant', hours: 1240, image: '🎯' },
    { name: 'League of Legends', hours: 856, image: '⚔️' },
    { name: 'CS2', hours: 632, image: '💥' },
    { name: 'Elden Ring', hours: 428, image: '🛡️' },
  ];

  const connectedAccounts = [
    { platform: 'Steam', username: 'gamerpro2024', connected: true, icon: Monitor },
    { platform: 'Discord', username: 'GamerPro#1234', connected: true, icon: MessageSquare },
    { platform: 'Twitch', username: 'gamerpro_live', connected: false, icon: Video },
    { platform: 'Spotify', username: 'gamerpro', connected: true, icon: Music },
  ];

  const interests = ['FPS', 'RPG', 'MOBA', 'Battle Royale', 'Co-op', 'Competitivo'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-gaming p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="text-white">
              ← Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Perfil</h1>
          <Link to="/premium">
            <Button variant="premium" size="sm">
              <Crown className="w-4 h-4 mr-2" />
              Premium
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          <div className="h-32 gradient-gaming"></div>
          <CardContent className="relative -mt-16 space-y-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl">{nickname[0]}</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 p-2 bg-secondary rounded-full text-white shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 mt-8">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{nickname}</h2>
                  <Badge variant="outline">@{username}</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground">{bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Mode */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nickname</label>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Seu nickname"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Pode ser alterado a cada 7 dias
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Seu username"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Pode ser alterado a cada 30 dias
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  className="resize-none"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="gaming" onClick={() => setIsEditing(false)}>
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Games */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Jogos Mais Jogados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topGames.map((game, index) => (
                <div key={game.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">{game.image}</div>
                  <div className="flex-1">
                    <p className="font-medium">{game.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {game.hours}h jogadas
                    </div>
                  </div>
                  <div className="text-xs bg-secondary text-white px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Gerenciar Jogos
              </Button>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Contas Vinculadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedAccounts.map((account) => (
                <div key={account.platform} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <account.icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{account.platform}</p>
                      {account.connected && (
                        <p className="text-sm text-muted-foreground">
                          {account.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant={account.connected ? "outline" : "gaming"} 
                    size="sm"
                  >
                    {account.connected ? "Conectado" : "Conectar"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle>Interesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="px-3 py-1">
                  {interest}
                </Badge>
              ))}
              <Button variant="outline" size="sm">
                <Edit2 className="w-3 h-3 mr-1" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <Link to="/swipe" className="flex-1">
            <Button variant="gaming" className="w-full" size="lg">
              Começar a Jogar
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline" size="lg">
              <MessageSquare className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;