import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit2, Crown, Gamepad2, MessageSquare, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getMyProfile, updateMyProfile } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Profile as ProfileT } from '@/lib/types';

const EMOJIS = ['🎮', '👾', '🕹️', '🎯', '🧙‍♀️', '🏎️', '🦊', '🐉', '⚔️', '🚀'];

const Profile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [profile, setProfile] = useState<ProfileT | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // editable fields
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState('');
  const [emoji, setEmoji] = useState('🎮');
  const [games, setGames] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        if (p) {
          setProfile(p);
          hydrate(p);
        }
      })
      .catch((e) => toast.error(e.message ?? 'Erro ao carregar o perfil'))
      .finally(() => setLoading(false));
  }, []);

  function hydrate(p: ProfileT) {
    setNickname(p.nickname);
    setUsername(p.username);
    setBio(p.bio);
    setLocation(p.location);
    setAge(p.age != null ? String(p.age) : '');
    setEmoji(p.avatar_emoji);
    setGames(p.top_games.join(', '));
    setInterests(p.interests.join(', '));
  }

  async function save() {
    setSaving(true);
    try {
      const updated = await updateMyProfile({
        nickname: nickname.trim() || 'Gamer',
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
        location: location.trim(),
        age: age ? Number(age) : null,
        avatar_emoji: emoji,
        top_games: splitList(games),
        interests: splitList(interests),
      });
      setProfile(updated);
      hydrate(updated);
      setIsEditing(false);
      toast.success('Perfil salvo!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar';
      toast.error(msg.includes('duplicate') ? 'Esse username já está em uso.' : msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/welcome');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Carregando perfil…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-gaming p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="text-white">← Voltar</Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Perfil</h1>
          <Button variant="ghost" className="text-white" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          <div className="h-32 gradient-gaming"></div>
          <CardContent className="relative -mt-16 space-y-4">
            <div className="flex items-end gap-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarFallback className="text-4xl bg-muted">{emoji}</AvatarFallback>
              </Avatar>

              <div className="flex-1 mt-8">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-2xl font-bold">{profile?.nickname}</h2>
                  <Badge variant="outline">@{profile?.username}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  {profile?.bio || 'Sem bio ainda — clique no lápis para editar.'}
                </p>
                {profile?.location && (
                  <p className="text-sm text-muted-foreground mt-1">📍 {profile.location}</p>
                )}
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
                  <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Seu nickname" />
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="seu_username" />
                </div>
                <div>
                  <label className="text-sm font-medium">Localização</label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cidade, Estado" />
                </div>
                <div>
                  <label className="text-sm font-medium">Idade</label>
                  <Input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))} placeholder="Idade" inputMode="numeric" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Avatar</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className={`text-2xl w-11 h-11 rounded-lg border transition ${
                        emoji === em ? 'border-secondary bg-secondary/10' : 'border-border'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Conte um pouco sobre você..." className="resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Jogos favoritos</label>
                  <Input value={games} onChange={(e) => setGames(e.target.value)} placeholder="Valorant, LoL, CS2" />
                  <p className="text-xs text-muted-foreground mt-1">Separe por vírgula</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Interesses</label>
                  <Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="FPS, RPG, MOBA" />
                  <p className="text-xs text-muted-foreground mt-1">Separe por vírgula</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="gaming" onClick={save} disabled={saving}>
                  {saving ? 'Salvando…' : 'Salvar'}
                </Button>
                <Button variant="outline" onClick={() => { if (profile) hydrate(profile); setIsEditing(false); }}>
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
                <Gamepad2 className="w-5 h-5" /> Jogos Favoritos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile && profile.top_games.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.top_games.map((g) => (
                    <Badge key={g} variant="outline" className="px-3 py-1">{g}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum jogo ainda. Edite seu perfil para adicionar.</p>
              )}
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Interesses</CardTitle>
            </CardHeader>
            <CardContent>
              {profile && profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1">{i}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Adicione seus interesses no editar.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <Link to="/swipe" className="flex-1">
            <Button variant="gaming" className="w-full" size="lg">Começar a Jogar</Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline" size="lg"><MessageSquare className="w-5 h-5" /></Button>
          </Link>
          <Link to="/premium">
            <Button variant="premium" size="lg"><Crown className="w-5 h-5" /></Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

function splitList(s: string): string[] {
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

export default Profile;
