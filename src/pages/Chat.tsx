import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Gamepad2, MessageCircle, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isDemo } from '@/lib/demo';
import { getMessages, getMyMatches, sendMessage } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { MatchSummary, Message } from '@/lib/types';

const Chat = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialChat = searchParams.get('id');

  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [selected, setSelected] = useState<string | null>(initialChat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load matches
  useEffect(() => {
    getMyMatches()
      .then(setMatches)
      .catch((e) => toast.error(e.message ?? 'Erro ao carregar matches'))
      .finally(() => setLoadingMatches(false));
  }, []);

  // Load messages + subscribe to realtime when a chat is selected
  useEffect(() => {
    if (!selected) return;
    let active = true;

    getMessages(selected)
      .then((m) => { if (active) setMessages(m); })
      .catch((e) => toast.error(e.message ?? 'Erro ao carregar mensagens'));

    // Demo mode keeps messages in local state — no backend to subscribe to.
    if (isDemo()) return () => { active = false; };

    const channel = supabase
      .channel(`messages:${selected}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${selected}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [selected]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content || !selected || sending) return;
    setText('');
    setSending(true);
    try {
      const msg = await sendMessage(selected, content);
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar');
      setText(content);
    } finally {
      setSending(false);
    }
  }

  const currentMatch = matches.find((m) => m.match_id === selected);

  // ---- Chat list view ----
  if (!selected || !currentMatch) {
    return (
      <div className="min-h-screen bg-background">
        <div className="gradient-gaming p-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Link to="/swipe">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Matches</h1>
            <span className="w-9" />
          </div>
        </div>

        <div className="p-4 max-w-md mx-auto">
          {loadingMatches ? (
            <p className="text-center text-muted-foreground mt-10">Carregando…</p>
          ) : matches.length === 0 ? (
            <div className="text-center mt-16 space-y-3">
              <Heart className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-muted-foreground">
                Você ainda não tem matches. Vá dar uns swipes! 🎮
              </p>
              <Link to="/swipe"><Button variant="gaming">Ir para o Swipe</Button></Link>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" /> Mensagens
              </h2>
              {matches.map((m) => (
                <Card key={m.match_id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4" onClick={() => setSelected(m.match_id)}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 text-xl bg-gradient-to-br from-gaming-blue to-gaming-purple rounded-full flex items-center justify-center">
                          {m.other_profile.avatar_emoji}
                        </div>
                        {m.other_profile.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{m.other_profile.nickname}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {m.last_message ?? 'Vocês deram match! Diga olá 👋'}
                        </p>
                        {m.other_profile.current_game && (
                          <div className="flex items-center gap-1 mt-1">
                            <Gamepad2 className="w-3 h-3 text-gaming-purple" />
                            <span className="text-xs text-gaming-purple">
                              Jogando {m.other_profile.current_game}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Individual chat view ----
  const other = currentMatch.other_profile;
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="gradient-gaming p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setSelected(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 text-lg bg-white/20 rounded-full flex items-center justify-center">
                {other.avatar_emoji}
              </div>
              {other.is_online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
              )}
            </div>
            <div className="text-white">
              <p className="font-semibold">{other.nickname}</p>
              <p className="text-xs opacity-80">
                {other.is_online && other.current_game
                  ? `Jogando ${other.current_game}`
                  : other.is_online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <span className="w-9" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            Vocês deram match! Mande a primeira mensagem 👋
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? 'gradient-gaming text-white' : 'bg-muted'}`}>
                <p className="text-sm break-words">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSend} className="flex gap-2 max-w-md mx-auto">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" variant="gaming" size="icon" disabled={sending || !text.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default Chat;
