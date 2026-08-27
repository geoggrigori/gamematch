<!-- ══════════════════════════ PORTADA ══════════════════════════ -->
<div align="center">
  <img src="assets/title-banner.svg" width="100%" alt="gamematch"/>
</div>

<br/>

<!-- ══════════════════════ IDIOMAS / LANGUAGES ══════════════════════ -->
<div align="center">
<a href="README.md"><img src="https://img.shields.io/badge/Português-555555?style=for-the-badge" alt="Português"/></a>
<a href="README.en.md"><img src="https://img.shields.io/badge/English-555555?style=for-the-badge" alt="English"/></a>
<a href="README.es.md"><img src="https://img.shields.io/badge/Español-1987F0?style=for-the-badge" alt="Español"/></a>
</div>

<br/>

<!-- ══════════════════════════ PORTADA ══════════════════════════ -->
<div align="center">

<img src="https://img.shields.io/badge/License-All_Rights_Reserved-D32F2F?style=for-the-badge" alt="license"/>
<img src="https://img.shields.io/badge/iOS_%26_Android-via_Capacitor-000000?style=for-the-badge" alt="mobile"/>
<br/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="typescript"/>
<img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="react"/>
<img src="https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="vite"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="tailwind"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="supabase"/>
<img src="https://img.shields.io/badge/Capacitor-119EFF?style=flat-square&logo=capacitor&logoColor=white" alt="capacitor"/>

</div>

<div align="center">

<a href="#acerca-de"><img src="https://img.shields.io/badge/▸_ACERCA_DE-1987F0?style=for-the-badge" alt="acerca"/></a>
<a href="#funcionalidades"><img src="https://img.shields.io/badge/▸_FUNCIONALIDADES-000000?style=for-the-badge" alt="func"/></a>
<a href="#arquitectura"><img src="https://img.shields.io/badge/▸_ARQUITECTURA-1987F0?style=for-the-badge" alt="arquitectura"/></a>
<a href="#tecnologías"><img src="https://img.shields.io/badge/▸_TECNOLOGÍAS-000000?style=for-the-badge" alt="tech"/></a>
<a href="#configuración"><img src="https://img.shields.io/badge/▸_CONFIGURACIÓN-1987F0?style=for-the-badge" alt="config"/></a>
<a href="#build-móvil"><img src="https://img.shields.io/badge/▸_BUILD_MÓVIL-000000?style=for-the-badge" alt="mobile"/></a>

</div>

<br/>

> ⚠️ **Código cerrado.** Este repositorio es público solo para consulta/evaluación — ver [Licencia](#licencia). No se permite ningún uso, copia o distribución sin autorización.

<div align="center">
  <img src="assets/screenshot.png" width="100%" alt="gamematch screenshot"/>
</div>

<!-- ══════════════════════════ ACERCA DE ══════════════════════════ -->
## Acerca de

**gamematch** es una app estilo "dating app" mobile-first para gamers. En lugar de revisar listas interminables de amigos, deslizas (swipe) entre otros jugadores, das like a quienes quieres jugar y, cuando el interés es mutuo, se forma un **match** y pueden empezar a chatear. Los perfiles se construyen alrededor de lo que la gente realmente juega — juegos favoritos, el juego actual, ubicación e intereses — para que la gente que conozcas sea gente con la que puedas armar equipo.

Es una aplicación full-stack real: frontend en React + TypeScript respaldado por **Supabase** (Postgres + Auth + Realtime), con toda la lógica de match garantizada en el servidor mediante funciones SQL y Row Level Security. El mismo build web también se empaqueta para **iOS y Android** vía Capacitor.

<!-- ══════════════════════════ FUNCIONALIDADES ══════════════════════════ -->
## Funcionalidades

| Función | Qué hace |
|---|---|
| **Autenticación por email** | Registro e inicio de sesión vía Supabase Auth; la sesión persiste y se renueva automáticamente |
| **Perfil auto-provisionado** | Se crea una fila de perfil automáticamente al registrarse (trigger en la base), con username único derivado del email |
| **Perfil editable** | Apodo, bio, edad, ubicación, avatar (emoji), juego actual, juegos favoritos e intereses |
| **Swipe / matchmaking** | Deck de tarjetas con candidatos aún no evaluados. Like, pass o super-like; un like mutuo crea un match |
| **Filtro de juego en el deck** | Filtra el deck por los juegos más comunes en el pool de candidatos |
| **Matches y chat** | Cada match abre una conversación; los mensajes se guardan por match, con el último mensaje en la lista |
| **Pantalla premium** | Página de planes/upgrade con los beneficios premium |
| **Rutas protegidas** | Perfil, swipe y chat requieren autenticación |
| **Seguro por diseño** | Row Level Security en todas las tablas — swipes, matches y acceso a mensajes se garantizan en Postgres, no solo en la UI |
| **Multiplataforma** | Funciona en el navegador y como app nativa iOS/Android vía Capacitor |

<!-- ══════════════════════════ ARQUITECTURA ══════════════════════════ -->
## Arquitectura

```mermaid
flowchart LR
  subgraph Client["App React + Vite (web / iOS / Android)"]
    UI["Páginas: Welcome · Profile · Swipe · Chat · Premium"]
    Auth["useAuth (AuthProvider)"]
    API["lib/api.ts"]
  end

  subgraph Supabase["Supabase"]
    SAuth["Auth"]
    DB[("Postgres + RLS")]
    RPC["Funciones SQL:<br/>record_swipe · get_candidates · get_my_matches"]
    RT["Realtime (mensajes)"]
  end

  UI --> Auth --> SAuth
  UI --> API
  API --> RPC --> DB
  API --> DB
  RT --> UI
```

Cómo ocurre un match: un swipe se envía a la función `record_swipe`, que registra el like/pass y, si la otra persona ya te había dado like, crea una fila en `matches` y devuelve `{ matched: true }`. Los candidatos vienen de `get_candidates` (todos excepto tú y a quienes ya evaluaste), y `get_my_matches` devuelve cada match con el perfil de la otra persona y el último mensaje.

<!-- ══════════════════════════ TECNOLOGÍAS ══════════════════════════ -->
## Tecnologías

| Capa | Tecnología |
|---|---|
| Lenguaje | TypeScript |
| UI | React 18, Tailwind CSS + `tailwindcss-animate`, shadcn/ui (Radix UI) |
| Build | Vite 5 (`@vitejs/plugin-react-swc`) |
| Routing | React Router |
| Datos | TanStack Query |
| Formularios | React Hook Form + Zod |
| Backend | Supabase (Postgres, Auth, Realtime) |
| Móvil | Capacitor (iOS / Android) |

<!-- ══════════════════════════ CONFIGURACIÓN ══════════════════════════ -->
## Configuración

**1. Requisitos:** Node.js 18+, npm, un proyecto [Supabase](https://supabase.com/) gratuito.

**2. Instalar:**
```bash
git clone https://github.com/geoggrigori/gamematch.git
cd gamematch
npm install
```

**3. Base de datos:** en el **SQL Editor** de Supabase, ejecuta `supabase/schema.sql` — crea las tablas `profiles`, `swipes`, `matches`, `messages`, las funciones de matching, las políticas de RLS, el trigger de auto-perfil y activa Realtime en `messages`.

**4. Variables de entorno:**
```bash
cp .env.example .env.local
```
```dotenv
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU-CLAVE-ANON-PUBLICA
```

**5. Ejecutar:**
```bash
npm run dev   # http://localhost:8080
```

<!-- ══════════════════════════ BUILD MÓVIL ══════════════════════════ -->
## Build Móvil

El build web se empaqueta como app nativa vía Capacitor (app id `app.gamematch.mobile`):

```bash
npm run build
npx cap add android   # una vez
npx cap add ios       # una vez, solo macOS
npx cap sync
npx cap run android
npx cap run ios       # solo macOS
```

<!-- ══════════════════════════ LICENCIA ══════════════════════════ -->
## Licencia

**Todos los derechos reservados.** Este código es público solo para visualización/evaluación (portafolio) — **no es open source**. No se otorga ningún permiso de uso, copia, modificación o distribución. Ver [`LICENSE`](LICENSE) para el texto completo.

<div align="center">
  <img src="https://file.loading.io/color/feature/thumb/Blues-8.png?" width="100%" height="10px" alt="divider"/>
</div>

<p align="center"><sub>Desarrollado por <strong><a href="https://github.com/geoggrigori">Grigori</a></strong> · 2026</sub></p>
