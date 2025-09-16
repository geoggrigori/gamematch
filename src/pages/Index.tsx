import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Users, MessageCircle, Crown, Star } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Auto redirect to welcome for new users
  useEffect(() => {
    const hasVisited = localStorage.getItem('tinderGamer_hasVisited');
    if (!hasVisited) {
      localStorage.setItem('tinderGamer_hasVisited', 'true');
      navigate('/welcome');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-gaming flex items-center justify-center p-4">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Logo & Title */}
        <div className="text-center text-white space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm glow-gaming">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">TinderGamer</h1>
          <p className="text-xl text-white/90 mb-8">
            O Tinder para gamers
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-white mx-auto mb-2" />
              <div className="text-white font-bold">10k+</div>
              <div className="text-xs text-white/70">Gamers</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-6 h-6 text-white mx-auto mb-2" />
              <div className="text-white font-bold">50k+</div>
              <div className="text-xs text-white/70">Matches</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-white mx-auto mb-2" />
              <div className="text-white font-bold">4.8</div>
              <div className="text-xs text-white/70">Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            variant="gaming" 
            className="w-full" 
            size="lg"
            onClick={() => navigate('/welcome')}
          >
            Começar Agora
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="swipe" 
              className="w-full"
              onClick={() => navigate('/profile')}
            >
              Ver Perfil
            </Button>
            <Button 
              variant="swipe" 
              className="w-full"
              onClick={() => navigate('/swipe')}
            >
              Explorar
            </Button>
          </div>
          
          <Button 
            variant="premium" 
            className="w-full"
            onClick={() => navigate('/premium')}
          >
            <Crown className="w-4 h-4 mr-2" />
            TinderGamer Premium
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-sm">Encontre gamers com os mesmos jogos</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-sm">Chat integrado com Discord e Steam</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-sm">Match por habilidade e interesses</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-xs mt-8">
          <p>Conecte-se com gamers do mundo todo</p>
          <p className="mt-1">TinderGamer © 2024</p>
        </div>
      </div>
    </div>
  );
};

export default Index;