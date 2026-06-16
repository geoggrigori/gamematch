import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Users, MessageCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication with Supabase
    console.log(isLogin ? 'Login' : 'Signup', { email, password });
  };

  return (
    <div className="min-h-screen gradient-gaming flex items-center justify-center p-4">
      {/* Hero Section */}
      <div className="w-full max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left text-white space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">GameMatch</h1>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-semibold">
            Conecte-se com gamers do mundo todo
          </h2>
          
          <p className="text-lg text-white/80 max-w-md">
            Encontre parceiros de jogo, faça novos amigos e forme equipes incríveis para suas aventuras gaming.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-secondary" />
              <span>Match por jogos</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-secondary" />
              <span>Chat em tempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-secondary" />
              <span>Encontre sua squad</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <Card className="glass-card border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </CardTitle>
            <CardDescription>
              {isLogin ? 'Acesse sua conta GameMatch' : 'Junte-se à maior comunidade gamer'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-card border-white/20 focus:border-secondary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-card border-white/20 focus:border-secondary"
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-card border-white/20 focus:border-secondary"
                    required
                  />
                </div>
              )}
              
              <Button type="submit" variant="gaming" className="w-full" size="lg">
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-secondary hover:underline"
                >
                  {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                </button>
              </div>
            </form>
            
            {/* Demo Navigation */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Demo - Navegar sem login:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    Perfil
                  </Button>
                </Link>
                <Link to="/swipe">
                  <Button variant="outline" size="sm" className="w-full">
                    Swipe
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;