# 🎮 GameMatch - O match perfeito para gamers

Um aplicativo que conecta gamers do mundo todo para jogar juntos! Encontre parceiros de jogo, faça novos amigos e forme equipes incríveis.

## 🚀 Funcionalidades (MVP)

- **Autenticação**: telas de cadastro e login com email
- **Perfil**: nickname, bio, jogos favoritos e contas vinculadas
- **Matchmaking**: sistema de swipe para encontrar outros gamers
- **Chat**: conversa entre matches
- **Premium**: recursos exclusivos e planos de assinatura

> Esta versão é o front-end (interface) do produto. A camada de back-end
> (autenticação real, banco de dados e chat em tempo real) é o próximo passo.

## 🎨 Design

- Cores principais: azul escuro (#0B1B3D) + roxo (#6C4CE3)
- Gradientes gaming, efeitos de glassmorphism e UI customizada
- Design responsivo, com foco em mobile

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Mobile**: Capacitor (iOS/Android)
- **Roteamento**: React Router
- **Ícones**: Lucide React

## 🔧 Desenvolvimento local

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📲 Gerar app mobile (Capacitor)

```bash
# Adicionar plataformas
npx cap add android        # Android
npx cap add ios            # iOS (somente no macOS)

# Build + sincronizar
npm run build
npx cap sync

# Abrir no Android Studio / Xcode
npx cap run android
npx cap run ios
```

Para testar em dispositivo físico: no Android, ative "Modo Desenvolvedor" e
"Depuração USB"; no iOS, configure um certificado de desenvolvedor no Xcode.

## 🎯 Próximos passos

### Back-end
- [ ] Autenticação real com email/senha
- [ ] Banco de dados para perfis e matches
- [ ] Chat em tempo real
- [ ] Pagamentos Premium

### Extras
- [ ] Integração com Discord/Steam/PSN
- [ ] Notificações push
- [ ] Filtros avançados e geolocalização

## 📋 Estrutura do projeto

```
src/
├── components/ui/    # Componentes UI base (shadcn/ui)
├── pages/            # Páginas
│   ├── Index.tsx     # Página inicial
│   ├── Welcome.tsx   # Login/Cadastro
│   ├── Profile.tsx   # Perfil do usuário
│   ├── Swipe.tsx     # Matchmaking (swipe)
│   ├── Chat.tsx      # Chat entre matches
│   └── Premium.tsx   # Assinatura premium
├── assets/           # Imagens e recursos
└── lib/              # Utilitários
```

---

**Desenvolvido para conectar a comunidade gamer! 🎮💜**
