# PRD-01: TIMS Project Initialization

## Document Info
| Field | Value |
|-------|-------|
| PRD ID | PRD-01 |
| Feature | Project Initialization, Tech Stack & Frontend Aesthetics |
| Author | Claude (AI Assistant) |
| Created | December 10, 2025 |
| Status | Draft |
| Related PRDs | PRD-02 (Database), PRD-03 (CRM), PRD-04 (Visualization Page) |

---

## 1. Introduction/Overview

This PRD defines the foundational setup for TIMS (Tennessine Integrative Management Software), a comprehensive ERP system for Tennessine's international equipment distribution business. This document covers project initialization, technology stack configuration, frontend architecture, and design system implementation.

### Purpose

Establish a solid, scalable foundation that:
- Implements the core technology stack
- Sets up authentication (Google SSO + email/password)
- Establishes the visual design system based on minimalist Korean ERP aesthetics
- Creates architectural patterns that future modules will follow
- Prevents scope creep by clearly marking what should and should not be built

### Background

Tennessine operates through two legal entities (TIA in Brazil, TIC in United States) and needs a unified system to manage the entire workflow from lead generation through delivery and payment. TIMS will replace fragmented tools with a cohesive platform.

---

## 2. Goals

| Goal ID | Description | Measurable Outcome |
|---------|-------------|-------------------|
| G-01 | Establish a production-ready project structure | Project runs locally with no errors |
| G-02 | Implement authentication system | Users can sign in via Google or email/password |
| G-03 | Create reusable UI component library | Core components match design system spec |
| G-04 | Set up i18n infrastructure | Language switching works (EN only for MVP) |
| G-05 | Establish error handling patterns | Global error boundary catches and displays errors gracefully |
| G-06 | Scaffold future module structure | Folders exist with clear placeholder markers |

---

## 3. Security & Code Quality Standards

> ⚠️ **CRITICAL**: This section defines non-negotiable requirements for all TIMS development. Violations of these standards are blocking issues that must be resolved before any code is merged.

### 3.1 Code Quality Requirements

#### 3.1.1 Professional Code Standards

| Requirement | Description | Enforcement |
|-------------|-------------|-------------|
| **Meaningful Naming** | Variables, functions, and components MUST have descriptive names that convey purpose. No single-letter variables except in loops (`i`, `j`). No abbreviations unless universally understood. | Code review |
| **Type Safety** | ALL code MUST be fully typed. No `any` types except when absolutely unavoidable (must be documented with `// @ts-expect-error` and justification). | TypeScript strict mode |
| **Documentation** | All functions MUST have JSDoc comments describing purpose, parameters, and return values. Complex logic MUST have inline comments. | Code review |
| **Constants Over Magic Numbers** | No hardcoded values. All configuration values MUST be defined as named constants or environment variables. | Code review |
| **Single Responsibility** | Functions SHOULD do one thing. Files SHOULD NOT exceed 300 lines. Components SHOULD NOT exceed 200 lines. | Code review |
| **Error Handling** | ALL async operations MUST have proper error handling. Errors MUST be logged and user-friendly messages displayed. | Code review |

#### 3.1.2 Prohibited Practices ("Vibe Coding" Anti-Patterns)

The following practices are **STRICTLY FORBIDDEN**:

```typescript
// ❌ FORBIDDEN: Hardcoded credentials or sensitive data
const API_KEY = "sk-1234567890abcdef"  // NEVER DO THIS
const DB_PASSWORD = "password123"       // NEVER DO THIS

// ❌ FORBIDDEN: Inline sensitive URLs
fetch("https://api.internal.tennessine.com/secret-endpoint")  // NEVER DO THIS

// ❌ FORBIDDEN: any types without justification
const data: any = response.json()  // NEVER DO THIS

// ❌ FORBIDDEN: Magic numbers/strings
if (user.role === 3) { ... }  // What is 3? NEVER DO THIS
if (status === "xyz123") { ... }  // What is xyz123? NEVER DO THIS

// ❌ FORBIDDEN: console.log in production code
console.log("user data:", userData)  // Use proper logging service

// ❌ FORBIDDEN: Commented-out code
// const oldFunction = () => { ... }  // Delete it, use git history

// ❌ FORBIDDEN: Generic variable names
const data = await fetch(...)  // What data? Be specific
const temp = calculate(...)    // What is temp? Be specific
const result = process(...)    // What result? Be specific

// ❌ FORBIDDEN: Trusting client-side data
const userId = request.body.userId  // Then using it directly in DB query
```

#### 3.1.3 Required Practices

```typescript
// ✅ REQUIRED: Environment variables for all configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// ✅ REQUIRED: Named constants with clear purpose
const USER_ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
  VIEWER: 'viewer',
} as const

const MAX_FILE_UPLOAD_SIZE_MB = 10
const SESSION_TIMEOUT_MINUTES = 30

// ✅ REQUIRED: Descriptive function names with JSDoc
/**
 * Fetches opportunities for a specific company with pagination.
 * @param companyId - The UUID of the company to fetch opportunities for
 * @param page - The page number (1-indexed)
 * @param pageSize - Number of items per page (default: 20)
 * @returns Paginated list of opportunities with total count
 * @throws {AuthenticationError} If user is not authenticated
 * @throws {AuthorizationError} If user lacks permission to view company
 */
async function fetchCompanyOpportunities(
  companyId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<Opportunity>> {
  // Implementation
}

// ✅ REQUIRED: Proper error handling
try {
  const opportunities = await fetchCompanyOpportunities(companyId)
  return opportunities
} catch (error) {
  if (error instanceof AuthenticationError) {
    redirectToLogin()
    return
  }
  logger.error('Failed to fetch opportunities', { companyId, error })
  showToast({ type: 'error', message: t('errors.fetchFailed') })
  throw error
}

// ✅ REQUIRED: Type-safe API responses
interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  meta?: {
    page: number
    pageSize: number
    totalCount: number
  }
}
```

### 3.2 Security Requirements

#### 3.2.1 Data Protection Principles

| Principle | Requirement |
|-----------|-------------|
| **Defense in Depth** | Security MUST be implemented at multiple layers (frontend validation, API validation, database RLS) |
| **Least Privilege** | Users and services MUST only have access to data they need |
| **Zero Trust** | NEVER trust client-side data. ALL data MUST be validated server-side |
| **Secure by Default** | New features MUST be secure by default, not secured as an afterthought |

#### 3.2.2 What MUST NOT Be Exposed in Browser DevTools

The following information MUST NEVER be visible in browser developer tools (Network tab, Console, Local Storage, Session Storage, or Application tab):

| Category | Examples | Protection Method |
|----------|----------|-------------------|
| **Authentication Secrets** | API keys, JWT secrets, service role keys | Server-side only, never sent to client |
| **Database Credentials** | Connection strings, passwords, host addresses | Server-side only via Supabase RLS |
| **Internal Business Logic** | Pricing algorithms, commission calculations | Computed server-side, only results sent |
| **Sensitive User Data** | Passwords (even hashed), full SSN, full credit cards | Never stored in frontend state |
| **Internal System Data** | Database schema details, internal IDs in error messages | Sanitize all error responses |
| **Environment Configuration** | Server paths, internal URLs, feature flags for security | Server-side configuration only |

#### 3.2.3 API Security Requirements

```typescript
// ❌ WRONG: Exposing sensitive data in API response
// Response visible in Network tab:
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "password_hash": "abc123...",  // NEVER EXPOSE
    "internal_role_id": 5,          // NEVER EXPOSE internal IDs
    "created_by_query": "SELECT * FROM users WHERE..."  // NEVER EXPOSE
  }
}

// ✅ CORRECT: Sanitized API response
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "role": "sales",
    "permissions": ["read:opportunities", "write:contacts"]
  }
}
```

#### 3.2.4 Server-Side Validation Requirements

**ALL CRUD operations MUST have server-side validation:**

```typescript
// Example: Supabase Edge Function or RLS Policy

// ❌ WRONG: Trusting client-provided user ID
const { userId, data } = request.body
await supabase.from('contacts').update(data).eq('created_by', userId)
// Attacker can modify userId in request to access other users' data!

// ✅ CORRECT: Use authenticated user from session
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new AuthenticationError('Not authenticated')

// User ID comes from verified JWT, not request body
await supabase.from('contacts').update(data).eq('created_by', user.id)
```

**Validation Checklist for ALL Endpoints:**

| Check | Description |
|-------|-------------|
| ✅ Authentication | Verify user is logged in via valid session/JWT |
| ✅ Authorization | Verify user has permission for this action on this resource |
| ✅ Input Validation | Validate all input against Zod schema |
| ✅ Input Sanitization | Sanitize strings to prevent XSS |
| ✅ Rate Limiting | Prevent brute force and DoS attacks |
| ✅ Audit Logging | Log who did what and when |

#### 3.2.5 Supabase Row Level Security (RLS) Requirements

**RLS MUST be enabled on ALL tables. No exceptions.**

```sql
-- ❌ WRONG: No RLS (anyone with anon key can read everything)
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT
);

-- ✅ CORRECT: RLS enabled with proper policies
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Users can only see contacts they created or have permission to view
CREATE POLICY "Users can view own contacts" ON contacts
  FOR SELECT
  USING (
    auth.uid() = created_by
    OR has_permission(auth.uid(), 'contacts', 'read')
  );

-- Users can only update their own contacts
CREATE POLICY "Users can update own contacts" ON contacts
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
```

#### 3.2.6 Environment Variables Security

```bash
# .env.example - Safe to commit (no real values)
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME=TIMS

# .env.local - NEVER commit (in .gitignore)
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side only (NEVER prefixed with VITE_)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.abc123.supabase.co:5432/postgres
```

**Rules:**
- Variables prefixed with `VITE_` are exposed to the browser - use ONLY for public, non-sensitive values
- Service role keys, database passwords, and secrets MUST NEVER have `VITE_` prefix
- `.env.local` and `.env.production` MUST be in `.gitignore`
- Production secrets MUST be managed via secure secret management (Supabase Dashboard, not code)

#### 3.2.7 Frontend Security Checklist

| Requirement | Implementation |
|-------------|----------------|
| **No sensitive data in state** | Never store passwords, tokens, or secrets in React state or Zustand |
| **Sanitize user input display** | Use React's built-in escaping, never use `dangerouslySetInnerHTML` |
| **Secure forms** | All forms use server actions, no sensitive data in hidden fields |
| **No eval() or new Function()** | Never execute dynamic code |
| **Content Security Policy** | Implement CSP headers to prevent XSS |
| **Secure cookies** | HttpOnly, Secure, SameSite flags on all auth cookies |

### 3.3 Code Review Security Checklist

Before approving ANY pull request, verify:

- [ ] No hardcoded credentials, API keys, or secrets
- [ ] No `any` types without documented justification
- [ ] All API calls have proper error handling
- [ ] All user input is validated with Zod schemas
- [ ] No sensitive data logged to console
- [ ] No sensitive data in URL parameters
- [ ] RLS policies exist for any new tables
- [ ] Server-side validation exists for all CRUD operations
- [ ] No client-side only security checks (must be duplicated server-side)
- [ ] Environment variables properly prefixed (or not) based on sensitivity
- [ ] Audit logging implemented for sensitive operations

---

## 4. User Stories

### 4.1 Authentication

| ID | User Story |
|----|------------|
| US-01 | As a Tennessine employee, I want to sign in using my Google Workspace account (tennessine.com.br) so that I don't need to manage another password. |
| US-02 | As an external user (if permitted), I want to sign in using email and password so that I can access the system without a Tennessine Google account. |
| US-03 | As a user, I want to see a loading state while authentication is processing so that I know the system is working. |
| US-04 | As a user, I want to see a clear error message if my login fails so that I can take corrective action. |

### 4.2 Navigation & Layout

| ID | User Story |
|----|------------|
| US-05 | As a user, I want a collapsible sidebar navigation so that I can maximize screen space when needed. |
| US-06 | As a user, I want the interface to remember my sidebar preference so that I don't have to collapse it every time. |
| US-07 | As a user, I want to toggle between light and dark themes so that I can work comfortably in any lighting condition. |
| US-08 | As a user, I want the system to remember my theme preference so that it persists across sessions. |

### 4.3 Error Handling

| ID | User Story |
|----|------------|
| US-09 | As a user, I want to see friendly error messages when something goes wrong so that I'm not confused by technical jargon. |
| US-10 | As a user, I want toast notifications for transient messages (success, warnings) so that I don't lose my place in the application. |

---

## 5. Functional Requirements

### 5.1 Project Structure

> **Implementation Guide:** Items marked with ✅ should be fully implemented. Items marked with 🔲 should have folder/file structure created with placeholder comments only. Items marked with 🚫 should NOT be created.

#### 5.1.1 Folder Structure

```
tims/
├── src/
│   ├── app/                      # ✅ App entry, providers, routing
│   │   ├── App.tsx
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx      # ✅ Authentication context
│   │   │   ├── ThemeProvider.tsx     # ✅ Light/dark theme
│   │   │   ├── ToastProvider.tsx     # ✅ Toast notifications
│   │   │   └── I18nProvider.tsx      # ✅ Internationalization
│   │   └── routes/
│   │       ├── index.tsx             # ✅ Route definitions
│   │       ├── ProtectedRoute.tsx    # ✅ Auth guard
│   │       └── PublicRoute.tsx       # ✅ Non-auth routes
│   │
│   ├── components/               # ✅ Shared UI components
│   │   ├── ui/                       # ✅ Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── index.ts
│   │   ├── layout/                   # ✅ Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── feedback/                 # ✅ User feedback components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorState.tsx
│   │   └── forms/                    # ✅ Form components
│   │       ├── FormField.tsx
│   │       ├── FormSection.tsx
│   │       ├── FormActions.tsx
│   │       └── useFormValidation.ts  # ✅ Zod + React 19 forms hook
│   │
│   ├── features/                 # Feature modules
│   │   ├── auth/                     # ✅ Authentication feature
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── GoogleSignInButton.tsx
│   │   │   │   └── AuthLayout.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── database/                 # 🔲 Scaffold only
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   └── README.md             # Placeholder with "See PRD-02"
│   │   │
│   │   ├── crm/                      # 🔲 Scaffold only
│   │   │   ├── components/
│   │   │   │   └── .gitkeep
│   │   │   ├── hooks/
│   │   │   │   └── .gitkeep
│   │   │   ├── services/
│   │   │   │   └── .gitkeep
│   │   │   └── README.md             # Placeholder with "See PRD-03"
│   │   │
│   │   ├── orders/                   # 🔲 Scaffold only (future)
│   │   ├── services/                 # 🔲 Scaffold only (future)
│   │   ├── finances/                 # 🔲 Scaffold only (future)
│   │   └── settings/                 # 🔲 Scaffold only (future)
│   │
│   ├── lib/                      # ✅ Utilities and configurations
│   │   ├── supabase/
│   │   │   ├── client.ts             # ✅ Supabase client init
│   │   │   └── types.ts              # 🔲 Generated types placeholder
│   │   ├── i18n/
│   │   │   ├── config.ts             # ✅ i18next configuration
│   │   │   └── locales/
│   │   │       └── en/
│   │   │           ├── common.json   # ✅ Common translations
│   │   │           └── auth.json     # ✅ Auth translations
│   │   └── utils/
│   │       ├── cn.ts                 # ✅ Tailwind class merger
│   │       ├── formatters.ts         # ✅ Date, currency formatters
│   │       └── validators.ts         # ✅ Common validation functions
│   │
│   ├── hooks/                    # ✅ Shared hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── useDebounce.ts
│   │
│   ├── types/                    # ✅ Global TypeScript types
│   │   ├── index.ts
│   │   └── api.ts
│   │
│   └── styles/                   # ✅ Global styles
│       ├── globals.css
│       └── themes.css
│
├── public/
│   └── locales/                  # 🔲 For runtime locale loading (future)
│
├── tasks/                        # PRD documents
│   └── *.md
│
├── .env.example                  # ✅ Environment template
├── .env.local                    # 🚫 Not committed (in .gitignore)
├── tailwind.config.js            # ✅ Tailwind configuration
├── tsconfig.json                 # ✅ TypeScript configuration
├── package.json                  # ✅ Dependencies
└── README.md                     # ✅ Project documentation
```

#### 5.1.2 Scaffolded Module README Template

Each scaffolded module folder should contain a README.md with:

```markdown
# [Module Name]

> ⚠️ **This module is scaffolded but not yet implemented.**

## Status
- [ ] PRD Created
- [ ] Database schema defined
- [ ] Implementation started
- [ ] Testing complete
- [ ] Production ready

## Related PRD
See `tasks/prd-XX-[module-name].md`

## Connection Points
<!-- Document how this module will connect to others -->
```

---

### 5.2 Technology Stack

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Language | TypeScript | 5.9.x | Strict mode enabled |
| Frontend Framework | React | 19.x | With React Router v7 |
| Build Tool | Vite | 7.x | With @vitejs/plugin-react |
| Styling | Tailwind CSS | 4.x | CSS-first configuration |
| Backend/Auth/DB | Supabase | 2.80+ | Auth, Postgres, RLS |
| State Management | Zustand | 5.x | For global UI state |
| Server State | TanStack Query | 5.x | For API data fetching |
| Forms | React 19 Native | - | useActionState, useFormStatus |
| Validation | Zod | 4.x | Schema validation |
| i18n | react-i18next | 16.x | Internationalization |
| i18n Core | i18next | 24.x | i18n framework |
| Icons | Lucide React | 0.556+ | Outline icons only |
| Date Handling | date-fns | 4.x | Lightweight date utilities |

#### 5.2.1 Package.json Dependencies (Minimum Required)

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.x",
    "@supabase/supabase-js": "^2.80.0",
    "@tanstack/react-query": "^5.90.0",
    "zustand": "^5.0.0",
    "zod": "^4.0.0",
    "react-i18next": "^16.2.0",
    "i18next": "^24.0.0",
    "lucide-react": "^0.556.0",
    "date-fns": "^4.1.0",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "vite": "^7.2.0",
    "@vitejs/plugin-react": "^4.x"
  }
}

// Note: Node.js 20.19+ or 22.12+ required (Vite 7 requirement)
```

---

### 5.3 Authentication

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| AUTH-01 | The system SHALL support Google OAuth sign-in | Must Have |
| AUTH-02 | Google OAuth SHALL restrict sign-in to `@tennessine.com.br` domain | Must Have |
| AUTH-03 | The system SHALL support email/password sign-in as a secondary method | Must Have |
| AUTH-04 | Email/password sign-up SHALL require email verification | Must Have |
| AUTH-05 | The system SHALL persist authentication state across browser sessions | Must Have |
| AUTH-06 | The system SHALL redirect unauthenticated users to the login page | Must Have |
| AUTH-07 | The system SHALL redirect authenticated users away from login page | Must Have |
| AUTH-08 | The login page SHALL display loading state during authentication | Must Have |
| AUTH-09 | The login page SHALL display clear error messages for failed attempts | Must Have |
| AUTH-10 | The system SHALL provide a sign-out function accessible from the header | Must Have |
| AUTH-11 | Authentication errors SHALL be logged (not exposing sensitive data) | Should Have |

#### 5.3.1 Login Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                     [TIMS Logo]                             │
│                                                             │
│              Welcome to TIMS                                │
│              Sign in to continue                            │
│                                                             │
│         ┌─────────────────────────────────┐                 │
│         │   🔵 Continue with Google       │                 │
│         └─────────────────────────────────┘                 │
│                                                             │
│                    ─── or ───                               │
│                                                             │
│         Email                                               │
│         ┌─────────────────────────────────┐                 │
│         │ email@example.com               │                 │
│         └─────────────────────────────────┘                 │
│                                                             │
│         Password                                            │
│         ┌─────────────────────────────────┐                 │
│         │ ••••••••••                      │                 │
│         └─────────────────────────────────┘                 │
│                                                             │
│         ┌─────────────────────────────────┐                 │
│         │        Sign In                  │                 │
│         └─────────────────────────────────┘                 │
│                                                             │
│              Forgot password?                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5.4 Layout & Navigation

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| NAV-01 | The application SHALL have a collapsible sidebar navigation | Must Have |
| NAV-02 | Sidebar expanded width SHALL be 240px | Must Have |
| NAV-03 | Sidebar collapsed width SHALL be 64px (icons only) | Must Have |
| NAV-04 | Sidebar state SHALL persist in localStorage | Must Have |
| NAV-05 | The main content area SHALL have dramatically rounded corners (16-24px) | Must Have |
| NAV-06 | The layout SHALL have a subtle shadow between sidebar and content | Should Have |
| NAV-07 | Navigation items SHALL show active state with background highlight | Must Have |
| NAV-08 | Navigation SHALL include tooltips when sidebar is collapsed | Must Have |
| NAV-09 | Header SHALL display user avatar and name | Must Have |
| NAV-10 | Header SHALL include a theme toggle (light/dark) | Must Have |
| NAV-11 | Header SHALL include a sign-out option in user menu | Must Have |

#### 5.4.1 Main Layout Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────────────────────────────┐ │
│ │          │ │ Header                              [🔍] [🌙] [👤] │ │
│ │ Sidebar  │ ├─────────────────────────────────────────────────────┤ │
│ │          │ │                                                     │ │
│ │ [≡]      │ │                                                     │ │
│ │          │ │            Main Content Area                        │ │
│ │ Dashboard│ │         (Rounded corners: 16-24px)                  │ │
│ │ Database │ │                                                     │ │
│ │ CRM      │ │                                                     │ │
│ │ Orders   │ │                                                     │ │
│ │ Services │ │                                                     │ │
│ │ Finances │ │                                                     │ │
│ │          │ │                                                     │ │
│ │ ──────── │ │                                                     │ │
│ │ Settings │ │                                                     │ │
│ └──────────┘ └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

#### 5.4.2 Sidebar Navigation Items (MVP)

| Icon | Label | Route | Status |
|------|-------|-------|--------|
| LayoutDashboard | Dashboard | `/` | 🔲 Scaffold |
| Database | Database | `/database` | 🔲 See PRD-02 |
| Kanban | CRM | `/crm` | 🔲 See PRD-03 |
| Package | Orders | `/orders` | 🔲 Future |
| Wrench | Services | `/services` | 🔲 Future |
| DollarSign | Finances | `/finances` | 🔲 Future |
| Settings | Settings | `/settings` | 🔲 Future |

---

### 5.5 Theme System

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| THEME-01 | The system SHALL support light and dark themes | Must Have |
| THEME-02 | Theme preference SHALL persist in localStorage | Must Have |
| THEME-03 | Theme SHALL default to system preference on first visit | Should Have |
| THEME-04 | Theme toggle SHALL be accessible from the header | Must Have |
| THEME-05 | Theme transition SHALL be smooth (150-200ms) | Should Have |

#### 5.5.1 Color Tokens

See **Appendix A: Design System Specification** for full color palette.

---

### 5.6 Internationalization (i18n)

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| I18N-01 | The system SHALL use react-i18next for internationalization | Must Have |
| I18N-02 | All user-facing strings SHALL be externalized to translation files | Must Have |
| I18N-03 | English (en) SHALL be the only implemented language for MVP | Must Have |
| I18N-04 | Translation files SHALL be organized by feature namespace | Must Have |
| I18N-05 | The i18n infrastructure SHALL support future language additions | Must Have |
| I18N-06 | Date and number formatting SHALL respect locale settings | Should Have |

#### 5.6.1 Translation File Structure

```
src/lib/i18n/locales/
└── en/
    ├── common.json      # Shared strings (buttons, labels, errors)
    ├── auth.json        # Authentication strings
    ├── navigation.json  # Nav items, menu labels
    ├── database.json    # Database module (placeholder)
    ├── crm.json         # CRM module (placeholder)
    └── validation.json  # Form validation messages
```

#### 5.6.2 Translation Key Convention

```
{namespace}.{section}.{key}

Examples:
- common.actions.save
- common.actions.cancel
- auth.login.title
- auth.errors.invalidCredentials
- validation.required
- validation.email.invalid
```

---

### 5.7 Error Handling & Loading States

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| ERR-01 | The application SHALL have a global ErrorBoundary at the root level | Must Have |
| ERR-02 | ErrorBoundary SHALL display a user-friendly error page | Must Have |
| ERR-03 | ErrorBoundary SHALL log errors for debugging (console in dev) | Must Have |
| ERR-04 | The system SHALL provide a Toast notification component | Must Have |
| ERR-05 | Toast notifications SHALL support success, error, warning, and info variants | Must Have |
| ERR-06 | Toast notifications SHALL auto-dismiss after configurable duration | Must Have |
| ERR-07 | Toast notifications SHALL be stackable (multiple at once) | Should Have |
| ERR-08 | The system SHALL provide skeleton loading components | Must Have |
| ERR-09 | Loading states SHALL use skeleton placeholders, not spinners (for content) | Should Have |
| ERR-10 | Spinners SHALL be used only for actions (button loading, form submission) | Should Have |
| ERR-11 | Empty states SHALL display helpful messages with optional action | Must Have |

#### 5.7.1 Error Boundary Behavior

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ⚠️ Something went wrong                  │
│                                                             │
│        We encountered an unexpected error.                  │
│        Please try refreshing the page.                      │
│                                                             │
│                 ┌──────────────────┐                        │
│                 │  Refresh Page    │                        │
│                 └──────────────────┘                        │
│                                                             │
│           If the problem persists, contact support.         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 5.7.2 Toast Notification Variants

| Variant | Color | Icon | Auto-dismiss |
|---------|-------|------|--------------|
| Success | Green | CheckCircle | 3 seconds |
| Error | Red | XCircle | 5 seconds (or manual) |
| Warning | Amber | AlertTriangle | 4 seconds |
| Info | Blue | Info | 3 seconds |

---

### 5.8 Routing Structure

| Route | Component | Auth Required | Status |
|-------|-----------|---------------|--------|
| `/login` | LoginPage | No | ✅ Implement |
| `/` | DashboardPage | Yes | 🔲 Placeholder |
| `/database` | DatabaseModule | Yes | 🔲 See PRD-02 |
| `/database/:type` | EntityListPage | Yes | 🔲 See PRD-02 |
| `/database/:type/:id` | EntityDetailPage | Yes | 🔲 See PRD-04 |
| `/crm` | CRMModule | Yes | 🔲 See PRD-03 |
| `/crm/opportunities/:id` | OpportunityPage | Yes | 🔲 See PRD-04 |
| `/orders` | OrdersModule | Yes | 🔲 Future |
| `/services` | ServicesModule | Yes | 🔲 Future |
| `/finances` | FinancesModule | Yes | 🔲 Future |
| `/settings` | SettingsModule | Yes | 🔲 Future |
| `*` | NotFoundPage | No | ✅ Implement |

---

## 6. Non-Goals (Out of Scope)

The following are explicitly **NOT** part of this PRD:

| ID | Item | Reason |
|----|------|--------|
| NG-01 | Database table creation | Covered in PRD-02 |
| NG-02 | Row Level Security policies | Covered in PRD-02 |
| NG-03 | Multi-office (TIA/TIC) context implementation | Covered in PRD-02 |
| NG-04 | CRM Kanban/List views | Covered in PRD-03 |
| NG-05 | Entity visualization pages | Covered in PRD-04 |
| NG-06 | User roles and permissions system | Future PRD |
| NG-07 | Audit logging implementation | Covered in PRD-02 |
| NG-08 | Custom fields system | Future PRD |
| NG-09 | Portuguese (PT-BR) translations | Future enhancement |
| NG-10 | Mobile-specific optimizations | Future enhancement |
| NG-11 | Offline support / PWA | Future enhancement |
| NG-12 | Real-time subscriptions | Future enhancement |

---

## 7. Design Considerations

### 7.1 Design System Reference

The UI follows a **minimalist monochromatic aesthetic** inspired by modern Korean ERP systems (DEMURE style). Key characteristics:

- **Monochromatic palette**: Black text on white backgrounds
- **Color only for status**: Green for positive, red for negative, amber for warnings
- **Generous whitespace**: Let data breathe
- **Soft geometry**: 16-24px border radius on main content area
- **Clean typography**: Inter font family
- **Outline icons only**: Lucide icons

See **Appendix A: Design System Specification** for complete details.

### 7.2 Responsive Breakpoints

| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Mobile | < 640px | Sidebar hidden, hamburger menu |
| Tablet | 640px - 1024px | Sidebar collapsed by default |
| Desktop | > 1024px | Sidebar expanded by default |

### 7.3 Component Design Principles

1. **Consistency**: All components follow the same visual language
2. **Accessibility**: WCAG 2.1 AA compliance target
3. **Performance**: Minimal re-renders, efficient state management
4. **Composability**: Components are modular and reusable

---

## 8. Technical Considerations

### 8.1 Supabase Configuration

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 8.2 Tailwind CSS v4 Configuration

Tailwind v4 uses CSS-first configuration instead of JavaScript config files:

```css
/* src/styles/globals.css */
@import "tailwindcss";

/* Custom theme configuration */
@theme {
  /* Colors - TIMS Design System */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-tertiary: #f3f4f6;
  
  --color-text-primary: #111111;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  
  --color-border-light: #e5e7eb;
  --color-border-medium: #d1d5db;
  
  --color-accent-positive: #10b981;
  --color-accent-negative: #ef4444;
  --color-accent-warning: #f59e0b;
  --color-accent-info: #3b82f6;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  
  /* Shadows - minimal Korean ERP aesthetic */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.05);
}

/* Dark theme overrides */
@theme dark {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #1a1a1a;
  --color-bg-tertiary: #262626;
  
  --color-text-primary: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  
  --color-border-light: #27272a;
  --color-border-medium: #3f3f46;
}
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

Key Tailwind v4 changes:
- **CSS-first configuration** using `@theme` directive
- **No tailwind.config.js** needed for basic customization
- **Automatic content detection** - no need to specify content paths
- **Built-in @import handling** - no PostCSS plugins required
- **Native CSS cascade layers** for better specificity control

### 8.3 Environment Variables

```bash
# .env.example
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=TIMS
VITE_APP_VERSION=0.1.0
```

### 8.4 State Management Strategy

| State Type | Solution | Use Case |
|------------|----------|----------|
| Server State | TanStack Query | API data, caching, background sync |
| Global UI State | Zustand | Theme, sidebar state, toasts |
| Local UI State | React useState | Form state, component-specific |
| Form State | React 19 Actions | useActionState, useFormStatus for form submission |
| URL State | React Router | Filters, pagination, active tabs |

### 8.5 React 19 Form Handling

React 19 introduces native form handling capabilities that replace the need for external form libraries:

```tsx
// Example: Login form using React 19's useActionState
import { useActionState, useFormStatus } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} isLoading={pending}>
      {pending ? 'Signing in...' : 'Sign In'}
    </Button>
  )
}

async function loginAction(prevState: LoginState, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Validate with Zod
  const result = loginSchema.safeParse({ email, password })
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }
  
  // Perform authentication
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })
  
  if (error) {
    return { error: { form: [error.message] } }
  }
  
  return { success: true }
}

function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { error: null })
  
  return (
    <form action={formAction}>
      <FormField
        name="email"
        type="email"
        label="Email"
        error={state.error?.email?.[0]}
      />
      <FormField
        name="password"
        type="password"
        label="Password"
        error={state.error?.password?.[0]}
      />
      {state.error?.form && (
        <p className="text-red-500 text-sm">{state.error.form[0]}</p>
      )}
      <SubmitButton />
    </form>
  )
}
```

Key benefits:
- **No external dependencies** for form state management
- **Progressive enhancement** - forms work without JavaScript
- **Optimistic updates** via useOptimistic hook
- **Automatic pending states** via useFormStatus
- **Server actions ready** for future SSR integration

### 8.6 Security Implementation Notes

> **Note:** Comprehensive security requirements are defined in **Section 3: Security & Code Quality Standards**. This section provides implementation-specific notes.

| Requirement | Implementation |
|-------------|----------------|
| No hardcoded secrets | All secrets in environment variables (see Section 3.2.6) |
| XSS Prevention | React's built-in escaping, no `dangerouslySetInnerHTML` |
| CSRF Protection | Supabase handles via tokens |
| Input Validation | Zod schemas on all user input (see Section 3.2.4) |
| Secure Auth | Supabase Auth with RLS (see Section 3.2.5) |
| Server-side Validation | All CRUD operations validated server-side |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Project builds successfully | 0 errors | `npm run build` completes |
| TypeScript strict mode passes | 0 errors | `tsc --noEmit` passes |
| Authentication works | 100% | Manual testing of Google + email flows |
| Theme toggle works | 100% | Manual testing |
| Sidebar collapse works | 100% | Manual testing |
| i18n loads correctly | 100% | All strings display (no missing keys) |
| Error boundary catches errors | 100% | Manual testing with thrown error |
| Toast notifications display | 100% | Manual testing all variants |

---

## 10. Open Questions

| ID | Question | Impact | Proposed Answer |
|----|----------|--------|-----------------|
| OQ-01 | Should we implement password reset flow in MVP? | Medium | Yes, basic email reset |
| OQ-02 | Should non-tennessine.com.br emails be blocked entirely or allowed for specific roles? | High | Block for MVP, revisit for external users |
| OQ-03 | Should the dashboard show placeholder content or be completely empty? | Low | Show "Coming Soon" cards for each module |
| OQ-04 | Do we need session timeout/auto-logout? | Medium | Defer to security review |

---

## Appendix A: Design System Specification

### A.1 Color Palette

#### Light Theme

```css
/* Backgrounds */
--bg-primary: #FFFFFF;
--bg-secondary: #F8F9FA;
--bg-tertiary: #F3F4F6;

/* Text */
--text-primary: #111111;
--text-secondary: #6B7280;
--text-muted: #9CA3AF;

/* Borders */
--border-light: #E5E7EB;
--border-medium: #D1D5DB;

/* Accents (use sparingly) */
--accent-positive: #10B981;
--accent-negative: #EF4444;
--accent-warning: #F59E0B;
--accent-info: #3B82F6;
```

#### Dark Theme

```css
/* Backgrounds */
--bg-primary-dark: #0A0A0A;
--bg-secondary-dark: #1A1A1A;
--bg-tertiary-dark: #262626;

/* Text */
--text-primary-dark: #FAFAFA;
--text-secondary-dark: #A1A1AA;
--text-muted-dark: #71717A;

/* Borders */
--border-light-dark: #27272A;
--border-medium-dark: #3F3F46;
```

### A.2 Typography

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Scale */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px - KPI numbers */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### A.3 Spacing

```css
/* Base unit: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### A.4 Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - small elements */
--radius-md: 0.5rem;    /* 8px - buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - cards */
--radius-xl: 1rem;      /* 16px - modals */
--radius-2xl: 1.5rem;   /* 24px - main content area */
```

### A.5 Shadows

```css
/* Minimal shadows - Korean ERP aesthetic */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.05);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.05);
```

### A.6 Component Examples (Tailwind Classes)

```tsx
// Primary Button
className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium 
           hover:bg-gray-800 transition-colors disabled:opacity-50"

// Secondary Button
className="bg-white text-gray-900 border border-gray-200 px-5 py-2.5 
           rounded-lg font-medium hover:bg-gray-50 transition-colors"

// Input Field
className="w-full h-11 px-4 border border-gray-200 rounded-lg 
           focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 
           outline-none transition-all bg-white"

// Card
className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"

// Main Content Container
className="bg-white rounded-2xl shadow-sm min-h-screen"

// Sidebar Nav Item (Active)
className="flex items-center gap-3 px-4 py-2.5 rounded-lg 
           bg-gray-100 text-gray-900 font-medium"

// Sidebar Nav Item (Inactive)
className="flex items-center gap-3 px-4 py-2.5 rounded-lg 
           text-gray-600 hover:bg-gray-50 hover:text-gray-900 
           transition-colors"
```

### A.7 Icon Usage

- **Library**: Lucide React
- **Style**: Outline only (no filled icons)
- **Size**: 20px default, 16px for compact, 24px for emphasis
- **Stroke Width**: 1.5 (default) or 2 for emphasis

```tsx
import { Home, Database, Users, Settings } from 'lucide-react'

<Home className="w-5 h-5" strokeWidth={1.5} />
```

---

## Appendix B: File Templates

### B.1 Component Template

```tsx
// src/components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors rounded-lg',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gray-900 text-white hover:bg-gray-800': variant === 'primary',
            'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50': variant === 'secondary',
            'text-gray-600 hover:text-gray-900 hover:bg-gray-50': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-11 px-5 text-base': size === 'lg',
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

### B.2 Hook Template

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
```

### B.3 Provider Template

```tsx
// src/app/providers/ThemeProvider.tsx
import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('tims-theme', 'system')
  
  const resolvedTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

---

*End of PRD-01*
