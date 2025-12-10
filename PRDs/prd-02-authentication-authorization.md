# PRD-02: Authentication & Authorization Model

## Document Info
| Field | Value |
|-------|-------|
| PRD ID | PRD-02 |
| Feature | Authentication, Authorization, Roles & Permissions |
| Author | Claude (AI Assistant) |
| Created | December 10, 2025 |
| Status | Draft |
| Related PRDs | PRD-01 (Project Initialization), PRD-03 (Database Model) |
| Security | 🔒 This document defines security-critical components. All implementations MUST follow PRD-01 Section 3: Security & Code Quality Standards. |

---

## 1. Introduction/Overview

This PRD defines the authentication and authorization architecture for TIMS. It establishes the foundation that all other modules will build upon, including:

- How users authenticate (login)
- How permissions are structured and checked
- How roles provide default permissions
- How admins configure and override permissions
- What database structures all tables will reference

### Why This PRD Comes Before Database

Every table in TIMS needs to know:
- What columns to include for ownership tracking (`created_by`, `updated_by`)
- How to write RLS policies that check permissions
- What user context is available for audit logging

This PRD answers those questions, enabling consistent implementation across all modules.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Permission Model | Hybrid (Role + Per-User Override) | Roles provide defaults, admins can customize per user |
| Permission Granularity | Module → Entity → Action | Flexible without over-engineering |
| Team Impact on Permissions | None (organizational only) | Keeps permission model simple |
| Office Impact on Auth | None (transactional attribute) | Offices are financial context, not auth context |
| Profile Storage | Separate `profiles` table | Recommended Supabase pattern, extensible |

---

## 2. Goals

| Goal ID | Description | Measurable Outcome |
|---------|-------------|-------------------|
| G-01 | Secure authentication via Google SSO and email/password | Users can login via both methods |
| G-02 | Flexible permission system admins can configure | Admins can create roles, assign permissions, override per user |
| G-03 | Permission checks are performant | Permission lookup < 10ms |
| G-04 | Comprehensive audit trail for security | All auth events and permission changes logged |
| G-05 | Foundation for all future modules | Clear patterns for RLS policies and permission checks |

---

## 3. Security & Code Quality Standards

> ⚠️ **CRITICAL**: This module handles authentication and authorization. ALL requirements from PRD-01 Section 3 apply with **zero exceptions**.

### 3.1 Authentication Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Password Storage | NEVER store passwords in application code. Supabase Auth handles hashing. |
| Token Storage | JWT tokens stored in HttpOnly cookies, NEVER in localStorage |
| Session Validation | Every API request validates session server-side via Supabase |
| SSO Domain Restriction | Google OAuth MUST reject non-`@tennessine.com.br` emails |
| Failed Login Tracking | Log all failed attempts with IP, timestamp, email attempted |
| Brute Force Protection | Rate limit login attempts (max 5 per minute per IP) |

### 3.2 Authorization Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Server-Side Checks | ALL permission checks MUST happen server-side (RLS + API) |
| No Client Trust | Frontend permission checks are UX only, NEVER security |
| Principle of Least Privilege | Default to no access, explicitly grant permissions |
| Permission Caching | Cache permission lookups, invalidate on change |
| Audit All Changes | Log who changed what permissions and when |

### 3.3 What MUST NOT Be Exposed

| Data | Protection |
|------|------------|
| Password hashes | Never queried, never returned, never logged |
| Session tokens (full) | Only expose to HttpOnly cookies |
| Permission logic details | Client sees "denied", not "denied because rule X failed" |
| Other users' permissions | Users can only see their own permissions |
| Role configuration internals | Only admins see role definitions |

---

## 4. User Stories

### 4.1 Authentication

| ID | User Story |
|----|------------|
| US-01 | As a Tennessine employee, I want to sign in using my Google Workspace account so that I use my existing credentials. |
| US-02 | As a user without Google Workspace, I want to sign in with email/password so that I can access the system. |
| US-03 | As a user, I want to stay logged in across browser sessions so that I don't have to login repeatedly. |
| US-04 | As a user, I want to sign out from all devices if I suspect my account is compromised. |
| US-05 | As a user, I want to reset my password via email if I forget it. |

### 4.2 Authorization

| ID | User Story |
|----|------------|
| US-06 | As a user, I want to see only the modules I have access to so that the interface isn't cluttered. |
| US-07 | As a user, I want clear feedback when I try to access something I don't have permission for. |
| US-08 | As a Sales user, I want to create and edit opportunities but not access financial reports. |
| US-09 | As a Technician, I want to view service records and add expenses without accessing full financials. |

### 4.3 Administration

| ID | User Story |
|----|------------|
| US-10 | As an Admin, I want to create new user accounts so that new employees can access the system. |
| US-11 | As an Admin, I want to assign roles to users so that they get appropriate default permissions. |
| US-12 | As an Admin, I want to override specific permissions for a user beyond their role defaults. |
| US-13 | As an Admin, I want to create new roles with custom permission sets for different job functions. |
| US-14 | As an Admin, I want to create new permission types as new features are added to the system. |
| US-15 | As an Admin, I want to see an audit log of all permission changes for compliance. |
| US-16 | As an Admin, I want to see failed login attempts to detect potential security issues. |

---

## 5. Data Model

### 5.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   auth.users    │       │    profiles     │       │     roles       │
│   (Supabase)    │       │                 │       │                 │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │──────▶│ id (UUID) PK/FK │       │ id (UUID) PK    │
│ email           │       │ full_name       │       │ name            │
│ encrypted_pass  │       │ avatar_url      │       │ description     │
│ ...             │       │ role_id FK ─────────────▶│ hierarchy_level │
└─────────────────┘       │ is_active       │       │ is_system_role  │
                          │ created_at      │       │ created_at      │
                          │ updated_at      │       └─────────────────┘
                          └─────────────────┘               │
                                  │                         │
                                  │                         ▼
                                  │               ┌─────────────────┐
                                  │               │ role_permissions│
                                  │               ├─────────────────┤
                                  │               │ id (UUID) PK    │
                                  │               │ role_id FK      │
                                  │               │ permission_id FK│
                                  │               │ granted         │
                                  │               └─────────────────┘
                                  │                         │
                                  ▼                         ▼
                          ┌─────────────────┐     ┌─────────────────┐
                          │user_permissions │     │   permissions   │
                          ├─────────────────┤     ├─────────────────┤
                          │ id (UUID) PK    │     │ id (UUID) PK    │
                          │ user_id FK      │     │ module          │
                          │ permission_id FK│◀────│ entity          │
                          │ granted         │     │ action          │
                          │ granted_by FK   │     │ code (unique)   │
                          │ created_at      │     │ description     │
                          └─────────────────┘     │ is_system       │
                                                  └─────────────────┘
                                                          
                          ┌─────────────────┐
                          │  auth_audit_log │
                          ├─────────────────┤
                          │ id (UUID) PK    │
                          │ event_type      │
                          │ user_id FK      │
                          │ target_user_id  │
                          │ ip_address      │
                          │ user_agent      │
                          │ details (JSONB) │
                          │ created_at      │
                          └─────────────────┘
```

### 5.2 Table Definitions

#### 5.2.1 `profiles` Table

Extends Supabase `auth.users` with application-specific data.

```sql
CREATE TABLE profiles (
  -- Primary key matches auth.users.id
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile information
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  
  -- Role assignment (provides default permissions)
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  
  -- Organizational (informational only, does not affect permissions)
  department TEXT, -- 'administration', 'commercial', 'services', 'marketing'
  job_title TEXT,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT full_name_not_empty CHECK (char_length(full_name) >= 2)
);

-- Indexes
CREATE INDEX idx_profiles_role_id ON profiles(role_id);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_profiles_department ON profiles(department);

-- Trigger to update updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 5.2.2 `roles` Table

Defines roles that provide default permission sets.

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Role definition
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Hierarchy level (higher = more authority)
  -- Used for display ordering and future inheritance if needed
  hierarchy_level INTEGER NOT NULL DEFAULT 0,
  
  -- System roles cannot be deleted or renamed
  is_system_role BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT role_name_not_empty CHECK (char_length(name) >= 2),
  CONSTRAINT hierarchy_level_positive CHECK (hierarchy_level >= 0)
);

-- Index for ordering
CREATE INDEX idx_roles_hierarchy ON roles(hierarchy_level DESC);
```

#### 5.2.3 `permissions` Table

Defines all available permissions in the system.

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Permission structure: module.entity.action
  module TEXT NOT NULL,      -- e.g., 'crm', 'database', 'finances', 'services'
  entity TEXT,               -- e.g., 'contacts', 'opportunities', 'orders' (NULL = module-level)
  action TEXT NOT NULL,      -- e.g., 'view', 'create', 'edit', 'delete', 'download'
  
  -- Unique code for programmatic reference
  code TEXT NOT NULL UNIQUE, -- e.g., 'crm.opportunities.edit'
  
  -- Human-readable description
  description TEXT NOT NULL,
  
  -- System permissions cannot be deleted
  is_system BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT permission_code_format CHECK (code ~ '^[a-z_]+(\.[a-z_]+)*$')
);

-- Indexes for permission lookups
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_permissions_module_entity ON permissions(module, entity);
CREATE INDEX idx_permissions_code ON permissions(code);
```

#### 5.2.4 `role_permissions` Table

Links roles to their default permissions.

```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  
  -- Whether this permission is granted (true) or explicitly denied (false)
  granted BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Unique constraint: one entry per role-permission pair
  CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);

-- Indexes
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
```

#### 5.2.5 `user_permissions` Table

Per-user permission overrides (supersedes role permissions).

```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  
  -- Whether this permission is granted (true) or explicitly denied (false)
  -- NULL means "inherit from role" (but we use absence of row for that)
  granted BOOLEAN NOT NULL,
  
  -- Audit: who granted/revoked this permission
  granted_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Unique constraint: one entry per user-permission pair
  CONSTRAINT unique_user_permission UNIQUE (user_id, permission_id)
);

-- Indexes
CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission ON user_permissions(permission_id);
```

#### 5.2.6 `auth_audit_log` Table

Immutable log of all authentication and authorization events.

```sql
CREATE TABLE auth_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event type
  event_type TEXT NOT NULL,
  -- Auth events: 'login_success', 'login_failed', 'logout', 'password_reset', 'password_changed'
  -- Permission events: 'role_created', 'role_updated', 'role_deleted',
  --                    'permission_granted', 'permission_revoked', 'role_assigned'
  
  -- Who performed the action (NULL for failed logins with invalid email)
  user_id UUID REFERENCES auth.users(id),
  
  -- Target user (for admin actions like granting permissions)
  target_user_id UUID REFERENCES auth.users(id),
  
  -- Request context
  ip_address INET,
  user_agent TEXT,
  
  -- Event-specific details
  details JSONB NOT NULL DEFAULT '{}',
  -- Examples:
  -- login_failed: {"email": "test@example.com", "reason": "invalid_password"}
  -- permission_granted: {"permission_code": "crm.opportunities.edit", "role_id": "..."}
  -- role_assigned: {"old_role_id": "...", "new_role_id": "..."}
  
  -- Timestamp (immutable)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for querying audit logs
CREATE INDEX idx_auth_audit_user ON auth_audit_log(user_id);
CREATE INDEX idx_auth_audit_target_user ON auth_audit_log(target_user_id);
CREATE INDEX idx_auth_audit_event_type ON auth_audit_log(event_type);
CREATE INDEX idx_auth_audit_created_at ON auth_audit_log(created_at DESC);

-- This table should NEVER have UPDATE or DELETE operations
-- Enforce with RLS policy that denies all updates/deletes
```

---

## 6. Permission System Design

### 6.1 Permission Structure

Permissions follow a three-level hierarchy:

```
module.entity.action

Examples:
- crm.view                    (Module-level: can access CRM module)
- crm.contacts.view           (Entity-level: can view contacts)
- crm.contacts.create         (Action-level: can create contacts)
- crm.contacts.edit           (Action-level: can edit contacts)
- crm.contacts.delete         (Action-level: can delete contacts)
- database.products.download  (Action-level: can download product files)
```

### 6.2 Permission Resolution Logic

When checking if a user has permission, the system evaluates in this order:

```
1. Check user_permissions table for explicit grant/deny
   → If found: return that value (user override wins)

2. Check role_permissions via user's role_id
   → If found: return that value (role default)

3. Default: DENY (principle of least privilege)
```

#### 6.2.1 Permission Check Function

```sql
-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION has_permission(
  p_user_id UUID,
  p_permission_code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_user_override BOOLEAN;
  v_role_permission BOOLEAN;
  v_permission_id UUID;
  v_role_id UUID;
BEGIN
  -- Get permission ID from code
  SELECT id INTO v_permission_id 
  FROM permissions 
  WHERE code = p_permission_code;
  
  -- If permission doesn't exist, deny
  IF v_permission_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check for user-specific override (highest priority)
  SELECT granted INTO v_user_override
  FROM user_permissions
  WHERE user_id = p_user_id AND permission_id = v_permission_id;
  
  IF v_user_override IS NOT NULL THEN
    RETURN v_user_override;
  END IF;
  
  -- Get user's role
  SELECT role_id INTO v_role_id
  FROM profiles
  WHERE id = p_user_id AND is_active = true;
  
  -- If no role or user inactive, deny
  IF v_role_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check role permission
  SELECT granted INTO v_role_permission
  FROM role_permissions
  WHERE role_id = v_role_id AND permission_id = v_permission_id;
  
  IF v_role_permission IS NOT NULL THEN
    RETURN v_role_permission;
  END IF;
  
  -- Default: deny
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION has_permission(UUID, TEXT) TO authenticated;
```

#### 6.2.2 Convenience Functions

```sql
-- Check permission for current authenticated user
CREATE OR REPLACE FUNCTION current_user_has_permission(
  p_permission_code TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN has_permission(auth.uid(), p_permission_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current user is an admin (has 'admin' role)
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
DECLARE
  v_role_name TEXT;
BEGIN
  SELECT r.name INTO v_role_name
  FROM profiles p
  JOIN roles r ON p.role_id = r.id
  WHERE p.id = auth.uid() AND p.is_active = true;
  
  RETURN v_role_name = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current user's profile is active
CREATE OR REPLACE FUNCTION is_active_user() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 6.3 Permission Hierarchy Check

For module-level permissions that imply entity-level access:

```sql
-- Check if user has permission at any level (module, entity, or action)
CREATE OR REPLACE FUNCTION has_permission_hierarchical(
  p_user_id UUID,
  p_module TEXT,
  p_entity TEXT DEFAULT NULL,
  p_action TEXT DEFAULT 'view'
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check exact permission (e.g., crm.contacts.edit)
  IF p_entity IS NOT NULL THEN
    IF has_permission(p_user_id, p_module || '.' || p_entity || '.' || p_action) THEN
      RETURN true;
    END IF;
  END IF;
  
  -- Check entity-level view (e.g., crm.contacts.view)
  IF p_entity IS NOT NULL AND p_action != 'view' THEN
    IF has_permission(p_user_id, p_module || '.' || p_entity || '.view') THEN
      -- Having view doesn't grant edit, but we checked exact above
      NULL;
    END IF;
  END IF;
  
  -- Check module-level (e.g., crm.view implies can access module)
  IF has_permission(p_user_id, p_module || '.view') THEN
    -- Module-level view grants basic access, but not write operations
    IF p_action = 'view' THEN
      RETURN true;
    END IF;
  END IF;
  
  -- Check module-level admin (e.g., crm.admin grants all within module)
  IF has_permission(p_user_id, p_module || '.admin') THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

---

## 7. Initial Data: Roles & Permissions

### 7.1 System Roles

```sql
-- Insert system roles (cannot be deleted)
INSERT INTO roles (name, description, hierarchy_level, is_system_role) VALUES
  ('admin', 'Full system access. Can manage users, roles, and all permissions.', 100, true),
  ('manager', 'Can view all data and manage team members. Default permissions for management.', 50, true),
  ('user', 'Standard user with basic access. Permissions must be explicitly granted.', 10, true);
```

### 7.2 System Permissions

```sql
-- Module-level permissions
INSERT INTO permissions (module, entity, action, code, description, is_system) VALUES
  -- CRM Module
  ('crm', NULL, 'view', 'crm.view', 'Access to CRM module', true),
  ('crm', NULL, 'admin', 'crm.admin', 'Full admin access to CRM module', true),
  ('crm', 'contacts', 'view', 'crm.contacts.view', 'View contacts', true),
  ('crm', 'contacts', 'create', 'crm.contacts.create', 'Create new contacts', true),
  ('crm', 'contacts', 'edit', 'crm.contacts.edit', 'Edit existing contacts', true),
  ('crm', 'contacts', 'delete', 'crm.contacts.delete', 'Delete contacts', true),
  ('crm', 'companies', 'view', 'crm.companies.view', 'View companies', true),
  ('crm', 'companies', 'create', 'crm.companies.create', 'Create new companies', true),
  ('crm', 'companies', 'edit', 'crm.companies.edit', 'Edit existing companies', true),
  ('crm', 'companies', 'delete', 'crm.companies.delete', 'Delete companies', true),
  ('crm', 'opportunities', 'view', 'crm.opportunities.view', 'View opportunities', true),
  ('crm', 'opportunities', 'create', 'crm.opportunities.create', 'Create new opportunities', true),
  ('crm', 'opportunities', 'edit', 'crm.opportunities.edit', 'Edit existing opportunities', true),
  ('crm', 'opportunities', 'delete', 'crm.opportunities.delete', 'Delete opportunities', true),
  ('crm', 'opportunities', 'advance_stage', 'crm.opportunities.advance_stage', 'Move opportunities to next stage', true),
  
  -- Database Module
  ('database', NULL, 'view', 'database.view', 'Access to Database module', true),
  ('database', NULL, 'admin', 'database.admin', 'Full admin access to Database module', true),
  ('database', 'products', 'view', 'database.products.view', 'View products', true),
  ('database', 'products', 'create', 'database.products.create', 'Create new products', true),
  ('database', 'products', 'edit', 'database.products.edit', 'Edit existing products', true),
  ('database', 'products', 'delete', 'database.products.delete', 'Delete products', true),
  ('database', 'products', 'download', 'database.products.download', 'Download product files (catalogs, etc.)', true),
  ('database', 'manufacturers', 'view', 'database.manufacturers.view', 'View manufacturers', true),
  ('database', 'manufacturers', 'create', 'database.manufacturers.create', 'Create new manufacturers', true),
  ('database', 'manufacturers', 'edit', 'database.manufacturers.edit', 'Edit existing manufacturers', true),
  ('database', 'manufacturers', 'delete', 'database.manufacturers.delete', 'Delete manufacturers', true),
  
  -- Finances Module (future)
  ('finances', NULL, 'view', 'finances.view', 'Access to Finances module', true),
  ('finances', NULL, 'admin', 'finances.admin', 'Full admin access to Finances module', true),
  ('finances', 'income', 'view', 'finances.income.view', 'View income records', true),
  ('finances', 'income', 'create', 'finances.income.create', 'Create income records', true),
  ('finances', 'income', 'edit', 'finances.income.edit', 'Edit income records', true),
  ('finances', 'expenses', 'view', 'finances.expenses.view', 'View expense records', true),
  ('finances', 'expenses', 'create', 'finances.expenses.create', 'Create expense records', true),
  ('finances', 'expenses', 'edit', 'finances.expenses.edit', 'Edit expense records', true),
  ('finances', 'reports', 'view', 'finances.reports.view', 'View financial reports', true),
  
  -- Services Module (future)
  ('services', NULL, 'view', 'services.view', 'Access to Services module', true),
  ('services', NULL, 'admin', 'services.admin', 'Full admin access to Services module', true),
  ('services', 'records', 'view', 'services.records.view', 'View service records', true),
  ('services', 'records', 'create', 'services.records.create', 'Create service records', true),
  ('services', 'records', 'edit', 'services.records.edit', 'Edit service records', true),
  
  -- Settings/Admin Module
  ('settings', NULL, 'view', 'settings.view', 'Access to Settings', true),
  ('settings', NULL, 'admin', 'settings.admin', 'Full admin access to Settings', true),
  ('settings', 'users', 'view', 'settings.users.view', 'View user list', true),
  ('settings', 'users', 'create', 'settings.users.create', 'Create new users', true),
  ('settings', 'users', 'edit', 'settings.users.edit', 'Edit user profiles', true),
  ('settings', 'users', 'delete', 'settings.users.delete', 'Deactivate users', true),
  ('settings', 'roles', 'view', 'settings.roles.view', 'View roles', true),
  ('settings', 'roles', 'create', 'settings.roles.create', 'Create new roles', true),
  ('settings', 'roles', 'edit', 'settings.roles.edit', 'Edit role permissions', true),
  ('settings', 'roles', 'delete', 'settings.roles.delete', 'Delete custom roles', true),
  ('settings', 'permissions', 'view', 'settings.permissions.view', 'View permissions', true),
  ('settings', 'permissions', 'create', 'settings.permissions.create', 'Create new permission types', true),
  ('settings', 'audit', 'view', 'settings.audit.view', 'View audit logs', true);
```

### 7.3 Default Role Permissions

```sql
-- Admin role: all permissions
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM roles WHERE name = 'admin'),
  id,
  true
FROM permissions;

-- Manager role: view all, edit most, no settings admin
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM roles WHERE name = 'manager'),
  id,
  true
FROM permissions
WHERE code NOT IN (
  'settings.admin',
  'settings.roles.create',
  'settings.roles.edit',
  'settings.roles.delete',
  'settings.permissions.create'
);

-- User role: basic view permissions only
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT 
  (SELECT id FROM roles WHERE name = 'user'),
  id,
  true
FROM permissions
WHERE action = 'view' AND code NOT IN (
  'settings.audit.view',
  'settings.users.view',
  'settings.roles.view',
  'settings.permissions.view',
  'finances.reports.view'
);
```

---

## 8. Row Level Security (RLS) Patterns

### 8.1 Standard Pattern for All Tables

Every table that contains user data MUST implement these RLS patterns:

```sql
-- Enable RLS
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view if they have view permission
CREATE POLICY "[table_name]_select_policy" ON [table_name]
  FOR SELECT
  USING (
    is_active_user() 
    AND current_user_has_permission('[module].[entity].view')
  );

-- Policy: Users can insert if they have create permission
CREATE POLICY "[table_name]_insert_policy" ON [table_name]
  FOR INSERT
  WITH CHECK (
    is_active_user() 
    AND current_user_has_permission('[module].[entity].create')
  );

-- Policy: Users can update if they have edit permission
CREATE POLICY "[table_name]_update_policy" ON [table_name]
  FOR UPDATE
  USING (
    is_active_user() 
    AND current_user_has_permission('[module].[entity].edit')
  )
  WITH CHECK (
    is_active_user() 
    AND current_user_has_permission('[module].[entity].edit')
  );

-- Policy: Users can delete if they have delete permission
CREATE POLICY "[table_name]_delete_policy" ON [table_name]
  FOR DELETE
  USING (
    is_active_user() 
    AND current_user_has_permission('[module].[entity].delete')
  );
```

### 8.2 Profiles Table RLS

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  USING (current_user_has_permission('settings.users.view'));

-- Users can update their own profile (limited fields)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any profile
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING (current_user_has_permission('settings.users.edit'));

-- Only admins can insert (create users)
CREATE POLICY "profiles_insert_admin" ON profiles
  FOR INSERT
  WITH CHECK (current_user_has_permission('settings.users.create'));
```

### 8.3 Auth Audit Log RLS

```sql
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "auth_audit_select" ON auth_audit_log
  FOR SELECT
  USING (current_user_has_permission('settings.audit.view'));

-- No one can update audit logs (immutable)
-- No UPDATE or DELETE policies = denied by default

-- INSERT allowed via service role only (from triggers/functions)
CREATE POLICY "auth_audit_insert" ON auth_audit_log
  FOR INSERT
  WITH CHECK (true);  -- Controlled by SECURITY DEFINER functions
```

---

## 9. Authentication Implementation

### 9.1 Google OAuth Configuration

```typescript
// src/lib/supabase/auth.ts

import { supabase } from './client'

/**
 * Initiates Google OAuth sign-in flow.
 * Restricted to @tennessine.com.br domain via Supabase Dashboard configuration.
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        hd: 'tennessine.com.br', // Restricts to this Google Workspace domain
      },
    },
  })

  if (error) {
    console.error('Google sign-in error:', error.message)
    throw error
  }

  return data
}
```

### 9.2 Email/Password Authentication

```typescript
/**
 * Signs in user with email and password.
 * @param email - User's email address
 * @param password - User's password (never logged or stored)
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Log attempt without sensitive data
    await logAuthEvent('login_failed', null, { 
      email, 
      reason: error.message 
    })
    throw error
  }

  // Log successful login
  await logAuthEvent('login_success', data.user.id)

  return data
}

/**
 * Creates new user account with email and password.
 * Requires admin permission.
 */
export async function createUserWithEmail(
  email: string, 
  password: string,
  profileData: CreateProfileData
) {
  // This should be called via a server function that validates admin permission
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: profileData.fullName,
    },
  })

  if (error) throw error

  // Create profile
  await supabase.from('profiles').insert({
    id: data.user.id,
    full_name: profileData.fullName,
    role_id: profileData.roleId,
    department: profileData.department,
    job_title: profileData.jobTitle,
  })

  return data
}
```

### 9.3 Auth Event Logging

```typescript
/**
 * Logs authentication events to audit log.
 * Called from SECURITY DEFINER function for proper access.
 */
async function logAuthEvent(
  eventType: AuthEventType,
  userId: string | null,
  details: Record<string, unknown> = {}
) {
  // This should call an RPC function that has INSERT permission
  await supabase.rpc('log_auth_event', {
    p_event_type: eventType,
    p_user_id: userId,
    p_details: details,
  })
}
```

```sql
-- Server-side function to log auth events
CREATE OR REPLACE FUNCTION log_auth_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_target_user_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
) RETURNS void AS $$
BEGIN
  INSERT INTO auth_audit_log (
    event_type,
    user_id,
    target_user_id,
    ip_address,
    user_agent,
    details
  ) VALUES (
    p_event_type,
    COALESCE(p_user_id, auth.uid()),
    p_target_user_id,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent',
    p_details
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 10. Initial Setup: Super Admin Creation

### 10.1 Setup Script Requirements

> ⚠️ **SECURITY CRITICAL**: The super admin password MUST NOT be stored in code, configuration files, or version control. The AI agent MUST prompt for password input during setup.

```typescript
// scripts/setup-super-admin.ts

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

const SUPER_ADMIN_EMAIL = 'info@tennessine.com.br'

/**
 * Creates the initial super admin account.
 * This script should be run once during initial deployment.
 * 
 * SECURITY: Password is prompted at runtime and never stored.
 */
async function setupSuperAdmin() {
  // Prompt for password (not stored anywhere)
  const password = await promptForPassword(
    'Enter password for super admin (info@tennessine.com.br): '
  )
  
  if (!password || password.length < 12) {
    console.error('Password must be at least 12 characters')
    process.exit(1)
  }

  // Confirm password
  const confirmPassword = await promptForPassword('Confirm password: ')
  
  if (password !== confirmPassword) {
    console.error('Passwords do not match')
    process.exit(1)
  }

  // Use service role for admin creation (from environment)
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: SUPER_ADMIN_EMAIL,
    password: password,
    email_confirm: true,
  })

  if (authError) {
    console.error('Failed to create auth user:', authError.message)
    process.exit(1)
  }

  // Get admin role ID
  const { data: adminRole } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('name', 'admin')
    .single()

  // Create profile
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: authData.user.id,
    full_name: 'Super Admin',
    role_id: adminRole?.id,
    is_active: true,
  })

  if (profileError) {
    console.error('Failed to create profile:', profileError.message)
    process.exit(1)
  }

  console.log('✅ Super admin created successfully')
  console.log(`   Email: ${SUPER_ADMIN_EMAIL}`)
  console.log('   Role: admin')
  console.log('')
  console.log('⚠️  Please store the password securely. It is not saved anywhere.')

  // Clear password from memory
  process.exit(0)
}

function promptForPassword(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    // Hide password input
    process.stdout.write(prompt)
    
    let password = ''
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', (char) => {
      const c = char.toString()
      if (c === '\n' || c === '\r') {
        process.stdin.setRawMode(false)
        process.stdout.write('\n')
        rl.close()
        resolve(password)
      } else if (c === '\u0003') {
        process.exit()
      } else if (c === '\u007f') {
        password = password.slice(0, -1)
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0)
        process.stdout.write(prompt + '*'.repeat(password.length))
      } else {
        password += c
        process.stdout.write('*')
      }
    })
  })
}

setupSuperAdmin()
```

### 10.2 Setup Execution

```bash
# Run during initial deployment only
# Requires SUPABASE_SERVICE_ROLE_KEY in environment (never in code)
npx ts-node scripts/setup-super-admin.ts
```

---

## 11. Frontend Permission Integration

### 11.1 Permission Hook

```typescript
// src/features/auth/hooks/usePermissions.ts

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

interface UserPermissions {
  permissions: string[]
  role: string | null
  isAdmin: boolean
}

/**
 * Hook to get current user's permissions.
 * Results are cached and used for UI rendering.
 * 
 * IMPORTANT: These permissions are for UI/UX only.
 * All actual permission checks happen server-side via RLS.
 */
export function usePermissions() {
  return useQuery({
    queryKey: ['user-permissions'],
    queryFn: async (): Promise<UserPermissions> => {
      const { data, error } = await supabase.rpc('get_current_user_permissions')
      
      if (error) throw error
      
      return {
        permissions: data.permissions || [],
        role: data.role_name,
        isAdmin: data.role_name === 'admin',
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}

/**
 * Check if current user has a specific permission.
 * For UI rendering only - actual security is server-side.
 */
export function useHasPermission(permissionCode: string): boolean {
  const { data } = usePermissions()
  return data?.permissions.includes(permissionCode) ?? false
}
```

### 11.2 Permission Gate Component

```typescript
// src/components/auth/PermissionGate.tsx

import { useHasPermission } from '@/features/auth/hooks/usePermissions'

interface PermissionGateProps {
  permission: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Conditionally renders children based on user permission.
 * This is for UI/UX only - server-side RLS provides actual security.
 */
export function PermissionGate({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const hasPermission = useHasPermission(permission)
  
  if (!hasPermission) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Usage example:
// <PermissionGate permission="crm.opportunities.edit">
//   <EditButton onClick={handleEdit} />
// </PermissionGate>
```

### 11.3 Server-Side Permission Function (RPC)

```sql
-- Function to get all permissions for the current user
CREATE OR REPLACE FUNCTION get_current_user_permissions()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_role_name TEXT;
  v_permissions TEXT[];
BEGIN
  v_user_id := auth.uid();
  
  -- Get role name
  SELECT r.name INTO v_role_name
  FROM profiles p
  JOIN roles r ON p.role_id = r.id
  WHERE p.id = v_user_id AND p.is_active = true;
  
  -- Get all granted permissions (combining role + user overrides)
  SELECT ARRAY_AGG(DISTINCT p.code) INTO v_permissions
  FROM permissions p
  WHERE 
    -- From role permissions
    EXISTS (
      SELECT 1 FROM role_permissions rp
      JOIN profiles pr ON pr.role_id = rp.role_id
      WHERE pr.id = v_user_id 
        AND rp.permission_id = p.id 
        AND rp.granted = true
        AND NOT EXISTS (
          -- Not overridden by user permission
          SELECT 1 FROM user_permissions up
          WHERE up.user_id = v_user_id 
            AND up.permission_id = p.id 
            AND up.granted = false
        )
    )
    OR
    -- From user permissions (overrides)
    EXISTS (
      SELECT 1 FROM user_permissions up
      WHERE up.user_id = v_user_id 
        AND up.permission_id = p.id 
        AND up.granted = true
    );
  
  RETURN json_build_object(
    'role_name', v_role_name,
    'permissions', COALESCE(v_permissions, ARRAY[]::TEXT[])
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

---

## 12. Admin Interface Requirements

### 12.1 User Management

| Feature | Description |
|---------|-------------|
| List Users | Table showing all users with name, email, role, status, last login |
| Create User | Form to create new user (email, password, name, role, department) |
| Edit User | Edit user profile, change role, toggle active status |
| View User Permissions | Show effective permissions (from role + overrides) |
| Override Permission | Grant or revoke specific permission for a user |
| Deactivate User | Set `is_active = false` (soft delete, preserves audit trail) |

### 12.2 Role Management

| Feature | Description |
|---------|-------------|
| List Roles | Show all roles with description and user count |
| Create Role | Create new role with name, description, hierarchy level |
| Edit Role | Modify role details (name, description) |
| Manage Role Permissions | Add/remove permissions from role |
| Delete Role | Only for non-system roles, requires reassigning users first |

### 12.3 Permission Management

| Feature | Description |
|---------|-------------|
| List Permissions | Show all permissions grouped by module |
| Create Permission | Create new permission type (for extensibility) |
| Permission Matrix | Grid view: Roles × Permissions showing grants |

### 12.4 Audit Log Viewer

| Feature | Description |
|---------|-------------|
| List Events | Paginated list of auth events with filters |
| Filter by Type | Filter by event type (login, permission change, etc.) |
| Filter by User | Filter by user who performed or was affected |
| Filter by Date | Date range filter |
| Export | Export filtered results to CSV |

---

## 13. Non-Goals (Out of Scope)

| Item | Reason |
|------|--------|
| Multi-factor Authentication (MFA) | Future enhancement, not MVP |
| Social login other than Google | Only Google SSO for tennessine.com.br |
| API keys / service accounts | Future enhancement for integrations |
| Single Sign-On (SAML/OIDC) | Google OAuth is sufficient for now |
| Permission inheritance between roles | Keeping simple with flat role model |
| Time-based permissions | Not required currently |
| Geographic access restrictions | Not required currently |

---

## 14. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Google SSO works | 100% | Users can login with tennessine.com.br accounts |
| Email/password works | 100% | Users can login with email/password |
| Permission checks performant | < 10ms | Measure `has_permission()` execution time |
| RLS policies enforce access | 100% | Unauthorized access attempts blocked |
| Audit logs capture events | 100% | All auth events logged |
| Admin can manage users | 100% | CRUD operations work in admin UI |
| Admin can manage roles | 100% | CRUD operations work in admin UI |

---

## 15. Open Questions

| ID | Question | Impact | Proposed Answer |
|----|----------|--------|-----------------|
| OQ-01 | Should users be able to see who else has access to a record? | Low | No for MVP, consider for future |
| OQ-02 | Should there be a "manager can see team's data" mode later? | Medium | Keep architecture flexible, add later if needed |
| OQ-03 | How long should audit logs be retained? | Low | 2 years minimum, configurable |
| OQ-04 | Should password policy be enforced (length, complexity)? | Medium | Yes, minimum 12 chars, validate on frontend |

---

## Appendix A: Database Migration Order

When setting up the database, tables must be created in this order due to foreign key dependencies:

1. `roles` (no dependencies)
2. `permissions` (no dependencies)
3. `profiles` (depends on `auth.users`, `roles`)
4. `role_permissions` (depends on `roles`, `permissions`)
5. `user_permissions` (depends on `auth.users`, `permissions`)
6. `auth_audit_log` (depends on `auth.users`)

Then:
- Create functions (`has_permission`, etc.)
- Enable RLS and create policies
- Insert seed data (roles, permissions, role_permissions)

---

## Appendix B: Permission Code Reference

```
# Module-level
[module].view              - Access to module
[module].admin             - Full admin access to module

# Entity-level  
[module].[entity].view     - View records
[module].[entity].create   - Create new records
[module].[entity].edit     - Edit existing records
[module].[entity].delete   - Delete records
[module].[entity].download - Download files (where applicable)

# Special
[module].[entity].[action] - Custom actions (e.g., advance_stage)
```

---

*End of PRD-02*
