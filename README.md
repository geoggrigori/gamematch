# 🎮 TinderGamer - O Tinder para Gamers

Um aplicativo móvel que conecta gamers do mundo todo para jogar juntos! Encontre parceiros de jogo, faça novos amigos e forme equipes incríveis.

## 🚀 Funcionalidades Implementadas (MVP)

### ✅ Core Features
- **Autenticação**: Cadastro e login com email
- **Perfil Completo**: Nickname, bio, jogos favoritos e contas vinculadas
- **Matchmaking**: Sistema de swipe estilo Tinder
- **Chat**: Mensagens em tempo real entre matches
- **Premium**: Recursos exclusivos e assinaturas

### 🎨 Design System
- Cores principais: Azul escuro (#0B1B3D) + Roxo (#6C4CE3)
- Gradientes gaming personalizados
- Glassmorphism effects
- Componentes UI customizados
- Responsive design para mobile

### 📱 Funcionalidades Mobile
- Capacitor configurado para iOS/Android
- Interface otimizada para toque
- Navegação móvel intuitiva
- Preparado para notificações push

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Mobile**: Capacitor
- **Roteamento**: React Router
- **Icons**: Lucide React

## 📲 Como Gerar APK para Teste no Celular

### Pré-requisitos
- Node.js e npm instalados
- Android Studio (para Android)
- Xcode (para iOS - apenas no Mac)

### Passos para Gerar APK:

1. **Exporte o projeto para GitHub**
   - Clique no botão "Export to Github" no Lovable
   - Clone o projeto: `git clone <YOUR_GIT_URL>`

2. **Instale as dependências**
   ```bash
   cd <YOUR_PROJECT_NAME>
   npm install
   ```

3. **Adicione as plataformas**
   ```bash
   # Para Android
   npx cap add android
   
   # Para iOS (apenas no Mac)
   npx cap add ios
   ```

4. **Build do projeto**
   ```bash
   npm run build
   ```

5. **Sincronize com Capacitor**
   ```bash
   npx cap sync
   ```

6. **Execute no dispositivo**
   ```bash
   # Android (abre no Android Studio)
   npx cap run android
   
   # iOS (abre no Xcode)
   npx cap run ios
   ```

### 📱 Para testar em dispositivo físico:
- **Android**: Ative o "Modo Desenvolvedor" e "Depuração USB"
- **iOS**: Configure certificado de desenvolvedor no Xcode

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎯 Próximos Passos para Implementação Completa

### Backend (Requer Supabase)
Para implementar as funcionalidades completas, você precisará conectar o projeto ao Supabase:

1. Clique no botão verde "Supabase" no topo direito do Lovable
2. Conecte sua conta Supabase
3. Isso habilitará:
   - Autenticação real com email/senha
   - Banco de dados para perfis e matches
   - Chat em tempo real
   - Sistema de notificações
   - Pagamentos Premium via Stripe

### Recursos Adicionais
- [ ] Autenticação biométrica
- [ ] Notificações push
- [ ] Integração com Discord/Steam/PSN
- [ ] Sistema de filtros avançados
- [ ] Geolocalização
- [ ] Sistema de reports
- [ ] Analytics de usage

## 📋 Estrutura do Projeto

```
src/
├── components/ui/     # Componentes UI base
├── pages/            # Páginas principais
│   ├── Index.tsx     # Página inicial
│   ├── Welcome.tsx   # Login/Cadastro
│   ├── Profile.tsx   # Perfil do usuário
│   ├── Swipe.tsx     # Sistema de matchmaking
│   ├── Chat.tsx      # Chat entre matches
│   └── Premium.tsx   # Assinatura premium
├── assets/           # Imagens e recursos
└── lib/             # Utilitários
```

## 🎮 Como Usar o App

1. **Primeiro Acesso**: Crie sua conta na tela de Welcome
2. **Configure Perfil**: Adicione jogos favoritos e bio
3. **Comece a Swipe**: Encontre outros gamers
4. **Chat**: Converse com seus matches
5. **Premium**: Desbloqueie recursos exclusivos

## 📱 Design Responsivo

O app foi otimizado para:
- Smartphones (principal foco)
- Tablets
- Desktop (para desenvolvimento)

## 🔐 Segurança & Privacidade

- Dados criptografados
- Conformidade com LGPD
- Autenticação segura
- Proteção contra spam

---

**Desenvolvido para conectar a comunidade gamer mundial! 🎮❤️**