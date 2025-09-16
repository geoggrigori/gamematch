import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  X, 
  Star, 
  MapPin, 
  Clock,
  Gamepad2,
  MessageCircle,
  Crown,
  ArrowLeft,
  Filter,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Swipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(0);

  const profiles = [
    {
      id: 1,
      nickname: 'ShadowHunter',
      username: 'shadowhunter99',
      age: 24,
      location: 'São Paulo, SP',
      bio: 'Procurando squad para Valorant ranked! Também jogo LoL nas horas vagas.',
      avatar: '👤',
      isOnline: true,
      currentGame: 'Valorant',
      topGames: ['Valorant', 'League of Legends', 'Apex Legends'],
      playtime: '1.2k hours',
      rank: 'Diamante II',
      interests: ['FPS', 'MOBA', 'Competitivo'],
      accounts: ['Steam', 'Discord', 'Riot']
    },
    {
      id: 2,
      nickname: 'MysticMage',
      username: 'mysticmage',
      age: 27,
      location: 'Rio de Janeiro, RJ',
      bio: 'RPG lover! Atualmente jogando Baldur\'s Gate 3 e procurando coop partners.',
      avatar: '🧙‍♀️',
      isOnline: false,
      currentGame: 'Baldur\'s Gate 3',
      topGames: ['Baldur\'s Gate 3', 'Elden Ring', 'The Witcher 3'],
      playtime: '850 hours',
      rank: null,
      interests: ['RPG', 'Co-op', 'Single Player'],
      accounts: ['Steam', 'GOG']
    },
    {
      id: 3,
      nickname: 'SpeedRacer',
      username: 'speedracer2024',
      age: 22,
      location: 'Belo Horizonte, MG',
      bio: 'Viciado em racing games! F1 2024, Forza, Gran Turismo... Bora correr!',
      avatar: '🏎️',
      isOnline: true,
      currentGame: 'F1 24',
      topGames: ['F1 24', 'Forza Horizon 5', 'Gran Turismo 7'],
      playtime: '600 hours',
      rank: null,
      interests: ['Racing', 'Simulação', 'Casual'],
      accounts: ['Steam', 'Xbox Live', 'PSN']
    }
  ];

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (liked: boolean) => {
    if (liked) {
      setMatches(matches + 1);
      // Show match animation
    }
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset or fetch more profiles
      setCurrentIndex(0);
    }
  };

  const handleSuperLike = () => {
    setMatches(matches + 1);
    // Show super match animation
    handleSwipe(true);
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎮</div>
          <h2 className="text-2xl font-bold">Acabaram os perfis!</h2>
          <p className="text-muted-foreground">Volte mais tarde para encontrar novos gamers.</p>
          <Link to="/profile">
            <Button variant="gaming">Ir para o Perfil</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-gaming p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-white text-center">
              <div className="text-lg font-bold">TinderGamer</div>
              <div className="text-xs opacity-80">{matches} matches hoje</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Filter className="w-5 h-5" />
            </Button>
            <Link to="/premium">
              <Button variant="ghost" size="icon" className="text-white">
                <Crown className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="p-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.02]">
            {/* Profile Header */}
            <div className="relative h-80 gradient-gaming flex items-end p-6">
              <div className="absolute top-4 right-4 flex gap-2">
                {currentProfile.isOnline && (
                  <Badge className="bg-green-500 text-white border-0">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    Online
                  </Badge>
                )}
                {currentProfile.currentGame && (
                  <Badge className="bg-black/50 text-white border-0">
                    <Gamepad2 className="w-3 h-3 mr-1" />
                    {currentProfile.currentGame}
                  </Badge>
                )}
              </div>
              
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-4xl">{currentProfile.avatar}</div>
                  <div>
                    <h3 className="text-2xl font-bold">{currentProfile.nickname}</h3>
                    <p className="opacity-80">@{currentProfile.username} • {currentProfile.age} anos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <MapPin className="w-4 h-4" />
                  {currentProfile.location}
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Bio */}
              <p className="text-sm leading-relaxed">{currentProfile.bio}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="font-bold text-lg">{currentProfile.playtime}</div>
                  <div className="text-xs text-muted-foreground">Total jogado</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {currentProfile.rank || 'Casual'}
                  </div>
                  <div className="text-xs text-muted-foreground">Rank</div>
                </div>
              </div>
              
              {/* Top Games */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">Jogos Favoritos</h4>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.topGames.map((game) => (
                    <Badge key={game} variant="outline" className="text-xs">
                      {game}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Interests */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">Interesses</h4>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Connected Accounts */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">Plataformas</h4>
                <div className="flex gap-2">
                  {currentProfile.accounts.map((account) => (
                    <Badge key={account} className="text-xs bg-gaming-purple text-white">
                      {account}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => handleSwipe(false)}
            >
              <X className="w-8 h-8" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-blue-500 hover:bg-blue-500 hover:text-white"
              onClick={handleSuperLike}
            >
              <Star className="w-6 h-6" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => handleSwipe(true)}
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>
          
          <div className="text-center mt-4 text-xs text-muted-foreground">
            Arraste para cima para Super Like • Toque nos botões para decidir
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="flex justify-center gap-4 max-w-md mx-auto">
          <Link to="/profile" className="flex-1">
            <Button variant="outline" className="w-full">
              Perfil
            </Button>
          </Link>
          <Link to="/chat" className="flex-1">
            <Button variant="outline" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Matches
            </Button>
          </Link>
          <Link to="/premium" className="flex-1">
            <Button variant="premium" className="w-full">
              <Crown className="w-4 h-4 mr-2" />
              Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Swipe;