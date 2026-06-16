import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart, X, Star, MapPin, Gamepad2, MessageCircle, Crown, ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getCandidates, recordSwipe } from '@/lib/api';
import type { Profile } from '@/lib/types';

const Swipe = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    getCandidates(30)
      .then(setProfiles)
      .catch((e) => toast.error(e.message ?? 'Erro ao carregar perfis'))
      .finally(() => setLoading(false));
  }, []);

  const current = profiles[index];

  async function swipe(liked: boolean, superLike = false) {
    if (!current || acting) return;
    setActing(true);
    try {
      const res = await recordSwipe(current.id, liked, superLike);
      if (res.matched) {
        setMatches((m) => m + 1);
        toast.success(`É um match com ${current.nickname}! 🎉`, {
          description: 'Vá até Matches para conversar.',
        });
      }
      setIndex((i) => i + 1);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao registrar swipe');
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Buscando gamers…
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <div className="text-6xl">🎮</div>
          <h2 className="text-2xl font-bold">Acabaram os perfis!</h2>
          <p className="text-muted-foreground">
            Volte mais tarde para encontrar novos gamers — ou convide um amigo a se cadastrar.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/chat"><Button variant="gaming">Ver Matches</Button></Link>
            <Link to="/profile"><Button variant="outline">Meu Perfil</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-gaming p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-white text-center">
            <div className="text-lg font-bold">GameMatch</div>
            <div className="text-xs opacity-80">{matches} matches nesta sessão</div>
          </div>
          <Link to="/premium">
            <Button variant="ghost" size="icon" className="text-white">
              <Crown className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Card */}
      <div className="p-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden shadow-2xl">
            <div className="relative h-72 gradient-gaming flex items-end p-6">
              <div className="absolute top-4 right-4 flex gap-2">
                {current.is_online && (
                  <Badge className="bg-green-500 text-white border-0">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div> Online
                  </Badge>
                )}
                {current.current_game && (
                  <Badge className="bg-black/50 text-white border-0">
                    <Gamepad2 className="w-3 h-3 mr-1" /> {current.current_game}
                  </Badge>
                )}
              </div>

              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-5xl">{current.avatar_emoji}</div>
                  <div>
                    <h3 className="text-2xl font-bold">{current.nickname}</h3>
                    <p className="opacity-80">
                      @{current.username}{current.age ? ` • ${current.age} anos` : ''}
                    </p>
                  </div>
                </div>
                {current.location && (
                  <div className="flex items-center gap-2 text-sm opacity-80">
                    <MapPin className="w-4 h-4" /> {current.location}
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {current.bio && <p className="text-sm leading-relaxed">{current.bio}</p>}

              {current.top_games.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Jogos Favoritos</h4>
                  <div className="flex flex-wrap gap-1">
                    {current.top_games.map((g) => (
                      <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {current.interests.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Interesses</h4>
                  <div className="flex flex-wrap gap-1">
                    {current.interests.map((i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline" size="icon"
              className="w-16 h-16 rounded-full border-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => swipe(false)} disabled={acting}
            >
              <X className="w-8 h-8" />
            </Button>
            <Button
              variant="outline" size="icon"
              className="w-14 h-14 rounded-full border-blue-500 hover:bg-blue-500 hover:text-white"
              onClick={() => swipe(true, true)} disabled={acting}
            >
              <Star className="w-6 h-6" />
            </Button>
            <Button
              variant="outline" size="icon"
              className="w-16 h-16 rounded-full border-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => swipe(true)} disabled={acting}
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="flex justify-center gap-4 max-w-md mx-auto">
          <Link to="/profile" className="flex-1">
            <Button variant="outline" className="w-full">Perfil</Button>
          </Link>
          <Link to="/chat" className="flex-1">
            <Button variant="outline" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" /> Matches
            </Button>
          </Link>
          <Link to="/premium" className="flex-1">
            <Button variant="premium" className="w-full">
              <Crown className="w-4 h-4 mr-2" /> Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Swipe;
