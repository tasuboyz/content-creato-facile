# 🌳 Albero del Progetto - content-creato-facile

## Struttura Generale

```
content-creato-facile/
├── 📄 Configurazioni di Root
│   ├── package.json               (dipendenze del progetto)
│   ├── package-lock.json
│   ├── bun.lockb / bun.lock       (lock file per Bun)
│   ├── tsconfig.json              (configurazione TypeScript)
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts             (bundler/dev server)
│   ├── vitest.config.ts           (test runner)
│   ├── tailwind.config.ts          (styling utility)
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── components.json
│   ├── playwright.config.ts        (E2E testing)
│   ├── playwright-fixture.ts
│   ├── .env                        (variabili d'ambiente)
│   ├── .gitignore
│   └── README.md
│
├── 📁 public/
│   └── robots.txt
│
├── 📁 src/                         (codice principale dell'applicazione)
│   ├── 📄 main.tsx                 (entry point React)
│   ├── 📄 App.tsx                  (componente root)
│   ├── 📄 App.css
│   ├── 📄 index.css                (stili globali)
│   ├── 📄 vite-env.d.ts            (type definitions Vite)
│   │
│   ├── 📁 components/              (componenti React)
│   │   ├── AppLayout.tsx           (layout principale)
│   │   ├── NavLink.tsx             (link di navigazione)
│   │   ├── PostCard.tsx            (card per visualizzare post)
│   │   ├── StatoBadge.tsx          (badge per stato)
│   │   │
│   │   └── 📁 ui/                  (componenti UI riutilizzabili)
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input.tsx
│   │       ├── input-otp.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx          (toast notifications)
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle.tsx
│   │       ├── toggle-group.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts        (hook per toast)
│   │
│   ├── 📁 pages/                   (pagine dell'applicazione)
│   │   ├── Index.tsx               (home page)
│   │   ├── AuthPage.tsx            (autenticazione)
│   │   ├── DashboardPage.tsx       (dashboard)
│   │   ├── GeneraPage.tsx          (generazione contenuti)
│   │   ├── CalendarioPage.tsx      (calendario)
│   │   ├── UploadPage.tsx          (carica contenuti)
│   │   ├── PostDetailPage.tsx      (dettagli post)
│   │   ├── ImpostazioniPage.tsx    (impostazioni)
│   │   └── NotFound.tsx            (404 page)
│   │
│   ├── 📁 hooks/                   (custom React hooks)
│   │   ├── useAuth.tsx             (gestione autenticazione)
│   │   ├── usePosts.tsx            (gestione post)
│   │   ├── useSettings.tsx         (gestione impostazioni)
│   │   ├── use-mobile.tsx          (rilevamento dispositivo mobile)
│   │   └── use-toast.ts            (hook per toast notifications)
│   │
│   ├── 📁 types/                   (definizioni TypeScript)
│   │   └── post.ts                 (tipo per post)
│   │
│   ├── 📁 integrations/            (integrazioni esterne)
│   │   └── 📁 supabase/
│   │       ├── client.ts           (client Supabase)
│   │       └── types.ts            (tipi Supabase)
│   │
│   ├── 📁 lib/                     (funzioni utility)
│   │   └── utils.ts                (utility functions)
│   │
│   └── 📁 test/                    (test suite)
│       ├── setup.ts                (configurazione test)
│       └── example.test.ts         (test di esempio)
│
├── 📁 supabase/                    (configurazione backend Supabase)
│   ├── config.toml                 (configurazione Supabase)
│   └── 📁 migrations/
│       └── 20260320164810_94aca3cc-a284-4e2d-a6ab-4d59316b5189.sql
│
├── 📁 .github/                     (configurazioni GitHub)
│   └── ...
│
└── 📁 node_modules/               (dipendenze installate)
```

## 📊 Statistiche Progetto

- **Pagine**: 8 (`AuthPage`, `DashboardPage`, `GeneraPage`, `CalendarioPage`, `UploadPage`, `PostDetailPage`, `ImpostazioniPage`, `Index`, `NotFound`)
- **Componenti Custom**: 4 (`AppLayout`, `NavLink`, `PostCard`, `StatoBadge`)
- **Componenti UI**: 45+ (dal package shadcn/ui integrato)
- **Custom Hooks**: 5 (`useAuth`, `usePosts`, `useSettings`, `use-mobile`, `use-toast`)
- **Tipo di Progetto**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL)
- **Testing**: Vitest + Playwright

## 🔧 Stack Tecnologico

- **Frontend**: React, TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Shadcn/ui
- **Backend/DB**: Supabase (PostgreSQL)
- **Testing**: Vitest, Playwright
- **Linting**: ESLint
- **Package Manager**: Bun
- **Notifications**: Sonner (toast notifications)

## 📝 Funzionalità Principali

- **Autenticazione**: Sistema di login/sign-up
- **Dashboard**: Visualizzazione e gestione post
- **Generazione Contenuti**: Pagina dedicata per generare nuovi contenuti
- **Calendario**: Visualizzazione in calendario
- **Upload**: Carica di nuovi media/post
- **Dettagli Post**: Visualizzazione dettagliata di singoli post
- **Impostazioni**: Configurazioni utente

---

*Generato il: 21 Marzo 2026*
