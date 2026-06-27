import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Users, MessageCircle, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, enterDemo } = useAuth();
  const navigate = useNavigate();

  function handleDemo() {
    enterDemo();
    toast.success('Você entrou no modo visitante! 🎮');
    navigate('/swipe');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!isSupabaseConfigured) {
      toast.info('O backend está sendo configurado. A autenticação fica disponível em breve.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha precisa ter ao menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(traduzErro(error));
          return;
        }
        toast.success('Bem-vinda de volta! 🎮');
        navigate('/swipe');
      } else {
        const { error, needsConfirmation } = await signUp(email, password);
        if (error) {
          toast.error(traduzErro(error));
          return;
        }
        if (needsConfirmation) {
          toast.success('Conta criada! Confirme seu e-mail para entrar.');
          setIsLogin(true);
        } else {
          toast.success('Conta criada com sucesso! 🎉');
          navigate('/swipe');
        }
      }
    } catch {
      toast.error('Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
          <div className="mt-8 flex justify-center lg:justify-start">
            <div className="grid w-full max-w-xs grid-cols-1 gap-4 text-left sm:max-w-none sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 shrink-0 text-secondary" />
                <span>Match por jogos</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 shrink-0 text-secondary" />
                <span>Chat em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 shrink-0 text-secondary" />
                <span>Encontre sua squad</span>
              </div>
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
            {/* One-click guest access — no account needed */}
            <Button
              type="button"
              variant="gaming"
              className="w-full"
              size="lg"
              onClick={handleDemo}
            >
              🎮 Entrar como visitante
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Acesso instantâneo, sem cadastro — com perfis e chat de exemplo.
            </p>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou entre com e-mail
              <span className="h-px flex-1 bg-border" />
            </div>

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

              <Button
                type="submit"
                variant="gaming"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Aguarde…' : isLogin ? 'Entrar' : 'Criar Conta'}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/** Map common Supabase auth errors to friendly Portuguese messages. */
function traduzErro(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'Este e-mail já está cadastrado. Faça login.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde um pouco.';
  return message;
}

export default Welcome;
