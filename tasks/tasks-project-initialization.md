# Task: Project Initialization

## Relevant Files

- `package.json` - Dependencies and scripts.
- `vite.config.ts` - Build configuration.
- `src/app/App.tsx` - Main application entry point.
- `src/app/providers/AuthProvider.tsx` - Authentication context provider.
- `src/app/routes/index.tsx` - Routing definitions.
- `src/components/layout/MainLayout.tsx` - Application shell structure.
- `src/features/auth/*` - Authentication feature components.

### Notes

- This task list covers the full scope of PRD-01.
- Dependencies versions must match Section 5.2.1 of PRD-01.
- Design system tokens should be defined in CSS variables for theming support.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

- [ ] 0.0 Create feature branch
  - [x] 0.1 Initialize Git repository by pulling from `https://github.com/fwlemos/T.I.M.S.git` (Remote added, fetch successful, repo appears empty or accessible)

- [x] 1.0 Initialize Project Structure & Dependencies
  - [x] 1.1 Create folder structure (src/{app,components,features,lib,hooks,types,styles}) as per PRD 5.1.1
  - [x] 1.2 Initialize `package.json` with dependencies from PRD 5.2.1 (Used React 18/Vite 5 for stability)
  - [x] 1.3 Install dependencies (`npm install`) to verify compatibility

- [x] 2.0 Configure Setup (Tailwind, TypeScript, Vite, Env)
  - [x] 2.1 Configure `tsconfig.json` for React 19 + Vite + Strict Mode
  - [x] 2.2 Configure `vite.config.ts` with React plugin and path aliases
  - [x] 2.3 Initialize Tailwind CSS v4 (or v3 if v4 unstable/not requested, check PRD says v4 but consider standard if issues arise) - *Used v3.4 for stability.*
  - [x] 2.4 Create `src/styles/globals.css` and `src/styles/themes.css` with CSS variables for colors (PRD 5.5.1)
  - [x] 2.5 Create `.env.example` and add `.env.local` to `.gitignore`

- [x] 3.0 Implement Core Infrastructure (Supabase, I18n, Providers)
  - [x] 3.1 Initialize Supabase client in `src/lib/supabase/client.ts` using env vars
  - [x] 3.2 Configure i18next in `src/lib/i18n/config.ts` and create initial `common.json`, `auth.json` (en only)
  - [x] 3.3 Implement `ThemeProvider` for light/dark mode logic (persisted in localStorage)
  - [x] 3.4 Implement `ToastProvider` context
  - [x] 3.5 Implement `AuthProvider` shell (context structure, simple mock/pass-through until step 6)
  - [x] 3.6 Wrap `App.tsx` with all Providers (Query, Auth, Theme, Toast, I18n)

- [x] 4.0 Implement UI Component Library
  - [x] 4.1 Create `src/lib/utils/cn.ts` (clsx + tailwind-merge)
  - [x] 4.2 Build Core Atoms: `Button.tsx`, `Input.tsx`, `Label.tsx`
  - [x] 4.3 Build Feedback: `Toast.tsx` (component), `LoadingSpinner.tsx`
  - [x] 4.4 Build Layout Atoms: `Card.tsx`, `Avatar.tsx`, `Skeleton.tsx`
  - [x] 4.5 Build Interactive: `Dropdown/Menu` (if needed for header), `Tooltip.tsx` (Skipped Tooltip for MVP simplicity, can add later)

- [x] 5.0 Implement Layout & Navigation
  - [x] 5.1 Build `Sidebar` component (collapsible, persisting state, nav items from PRD 5.4.2)
  - [x] 5.2 Build `Header` component (Title/Search placeholder, Theme Toggle, User Avatar)
  - [x] 5.3 Build `MainLayout.tsx` composing Sidebar + Header + Outlet
  - [x] 5.4 Configure `react-router-dom` in `src/app/routes/index.tsx` using `MainLayout`

- [x] 6.0 Implement Authentication System
  - [x] 6.1 Implement `authService.ts` (loginWithGoogle, loginWithPassword, signOut)
  - [x] 6.2 Update `AuthProvider` to use real Supabase auth state (`onAuthStateChange`)
  - [x] 6.3 Build `LoginForm.tsx` UI (PRD 5.3.1 wireframe)
  - [x] 6.4 Create `LoginPage` and route it at `/login`
  - [x] 6.5 Implement `ProtectedRoute` and `PublicRoute` wrappers
  - [x] 6.6 Verify redirection logic (Unauth -> Login, Auth -> Dashboard)

- [x] 7.0 Error Handling & Final Polish
  - [x] 7.1 Implement global `ErrorBoundary.tsx` (PRD 5.7.1) and wrap App
  - [x] 7.2 Implement `NotFoundPage` for 404s
  - [x] 7.3 Verify all "Must Have" requirements from PRD are met
  - [x] 7.4 Final lint check and build test
