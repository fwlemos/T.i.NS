# Tasks: Authentication & Authorization Model (PRD-02)

## Relevant Files

- `src/lib/supabase/types.ts` - Database definitions.
- `src/features/auth/hooks/usePermissions.ts` - Frontend permission hooks.
- `src/components/auth/PermissionGate.tsx` - Permission gate component.
- `scripts/setup-super-admin.ts` - Setup script.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- [ ] 1.1 Read file → [x] 1.1 Read file (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 No branch needed
- [x] 1.0 Implement Database Schema (Tables & Relationships)
  - [x] 1.1 Create `profiles` table (extends `auth.users`) with indexes and triggers
  - [x] 1.2 Create `roles` table with hierarchy level
  - [x] 1.3 Create `permissions` table (module.entity.action structure)
  - [x] 1.4 Create `role_permissions` join table
  - [x] 1.5 Create `user_permissions` override table
  - [x] 1.6 Create `auth_audit_log` table (immutable)

- [x] 2.0 Implement Permission Logic (Database Functions & RPCs)
  - [x] 2.1 Implement `has_permission` security definer function
  - [x] 2.2 Implement convenience functions: `current_user_has_permission`, `is_admin`, `is_active_user`
  - [x] 2.3 Implement `has_permission_hierarchical` for module/entity level checks
  - [x] 2.4 Implement `log_auth_event` for audit logging
  - [x] 2.5 Implement `get_current_user_permissions` RPC for frontend hydration

- [x] 3.0 Seed Initial Data (Roles & Permissions)
  - [x] 3.1 Insert System Roles (admin, manager, user)
  - [x] 3.2 Insert System Permissions (CRM, Database, Settings modules)
  - [x] 3.3 Insert Default Role Permissions (Grant logic for admin/manager/user)
  - [x] 3.4 Create `scripts/setup-super-admin.ts` for secure admin creation

- [x] 4.0 Implement RLS Policies
  - [x] 4.1 Enable RLS on all tables (`profiles`, `roles`, `permissions`, `role_permissions`, `user_permissions`, `auth_audit_log`)
  - [x] 4.2 Define policies for `profiles` (View own/admin, Update own/admin)
  - [x] 4.3 Define policies for `roles` & `permissions` (Read authenticated, Write admin)
  - [x] 4.4 Define policies for `role_permissions` & `user_permissions` (Read authenticated, Write admin)
  - [x] 4.5 Define policies for `auth_audit_log` (Read admin only, No update/delete)

- [x] 5.0 Frontend Integration (Hooks & Components)
  - [x] 5.1 Update `src/lib/supabase/types.ts` with new schema
  - [x] 5.2 Implement `usePermissions` hook (using `get_current_user_permissions` RPC)
  - [x] 5.3 Implement `PermissionGate` component
  - [x] 5.4 Update `authService.ts` to include `signInWithGoogle` (re-verify configuration)
  - [x] 5.5 Create `src/lib/supabase/auth.ts` helper functions (optional, or merge into authService)

- [x] 6.0 Admin Interface Implementation
  - [x] 6.1 Create `src/features/admin/components/UserList.tsx`
  - [x] 6.2 Create `src/features/admin/components/RoleList.tsx`
  - [x] 6.3 Create `src/features/admin/components/AuditLogViewer.tsx`
  - [x] 6.4 Create `src/app/routes/AdminPage.tsx` consolidating these views

- [ ] 7.0 Verification & Testing
  - [x] 7.1 Run `npm run build` to verify type safety
  - [x] 7.2 Manual Walkthrough: Verify Google Login
  - [x] 7.3 Manual Walkthrough: Verify Admin Access vs. User Access (via RLS)
  - [x] 7.4 Verify Audit Log entries creation
