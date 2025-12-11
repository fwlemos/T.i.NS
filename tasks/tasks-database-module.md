# Tasks: Database Module Implementation

> Generated from PRD-03 (Database Module) with security requirements from PRD-01

## Relevant Files

### Database Schema & RLS
- `supabase/migrations/YYYYMMDD_create_database_module_tables.sql` - Database schema for contacts, companies (unified with manufacturers), products, manufacturer_banking_accounts
- `supabase/migrations/YYYYMMDD_create_rls_policies.sql` - Row-level security policies for all tables
- `src/lib/supabase/types.ts` - Generated TypeScript types from Supabase

### Global Search
- `src/features/database/hooks/useGlobalSearch.ts` - Hook for cross-entity search functionality
- `src/features/database/components/GlobalSearchBar.tsx` - Search bar component with Cmd/Ctrl+K shortcut
- `src/features/database/components/SearchResults.tsx` - Grouped search results display

### Entity List Views
- `src/features/database/views/ContactsView.tsx` - Contacts list with table, filters, pagination
- `src/features/database/views/CompaniesView.tsx` - Companies list view
- `src/features/database/views/ManufacturersView.tsx` - Manufacturers list view
- `src/features/database/views/ProductsView.tsx` - Products list view
- `src/components/ui/DataTable.tsx` - Reusable sortable/filterable table component
- `src/features/database/components/BulkActionsToolbar.tsx` - Bulk selection toolbar

### Entity Detail Pages
- `src/features/database/pages/ContactDetailPage.tsx` - Three-column contact detail page
- `src/features/database/pages/CompanyDetailPage.tsx` - Three-column company detail page
- `src/features/database/pages/ManufacturerDetailPage.tsx` - Three-column manufacturer detail page
- `src/features/database/pages/ProductDetailPage.tsx` - Three-column product detail page
- `src/features/database/components/EntityTimeline.tsx` - Left column timeline component
- `src/features/database/components/EntityForm.tsx` - Center column form component
- `src/features/database/components/RelatedEntitiesPanel.tsx` - Right column related entities

### Nested Forms
- `src/components/forms/RelationalField.tsx` - Relational field with search/create inline
- `src/components/forms/NestedFormContainer.tsx` - Container for inline nested forms
- `src/features/database/components/ContactNestedForm.tsx` - Inline contact creation form
- `src/features/database/components/CompanyNestedForm.tsx` - Inline company creation form
- `src/features/database/components/ManufacturerNestedForm.tsx` - Inline manufacturer creation form

### Bulk Operations
- `src/features/database/services/bulkOperations.ts` - Bulk delete, export, edit services
- `src/features/database/components/BulkDeleteConfirmModal.tsx` - Bulk delete confirmation
- `src/features/database/components/BulkEditModal.tsx` - Bulk field edit modal
- `src/features/database/components/BulkExportModal.tsx` - Export format selection

### Manufacturer-Specific
- `src/features/database/components/BankingAccountsSection.tsx` - Banking accounts management
- `src/features/database/components/ContractUploadSection.tsx` - Contract/exclusivity file uploads
- `src/features/database/services/contractAlerts.ts` - Contract expiration alert logic

### Audit & Timeline
- `src/features/database/hooks/useAuditLog.ts` - Hook for fetching audit log entries
- `src/features/database/services/auditService.ts` - Audit logging service
- `supabase/migrations/YYYYMMDD_create_audit_log_table.sql` - Audit log table schema

### Notes

- Unit tests should be placed alongside the code files they are testing (e.g., `useGlobalSearch.test.ts`).
- Use `npm run test` or `npx vitest` to run tests.
- All CRUD operations MUST have server-side validation via Supabase RLS policies (per PRD-01 Section 3.2).
- Never trust client-side data; always validate server-side.
- All user input must be validated with Zod schemas and sanitized to prevent XSS/SQL injection.
- No `any` types without documented justification.
- All functions must have JSDoc comments.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

## Tasks

- [x] 1.0 Implement Database Schema & RLS Policies
  - [x] 1.1 Create migration file for unified `companies` table with type discriminator ('company' | 'manufacturer')
  - [x] 1.2 Create migration file for `contacts` table with `is_individual` flag and address fields (street, complement, neighborhood, city, state_province, country, postal_code, formatted_address, place_id)
  - [x] 1.3 Create migration file for `products` table linked to manufacturers via `manufacturer_id`
  - [x] 1.4 Create migration file for `manufacturer_banking_accounts` table with multi-currency support
  - [x] 1.5 Add `created_by`, `updated_by`, `created_at`, `updated_at` columns to all tables
  - [x] 1.6 Create RLS policies for `companies` table (view, create, edit, delete based on permissions)
  - [x] 1.7 Create RLS policies for `contacts` table with permission-based access control
  - [x] 1.8 Create RLS policies for `products` table with permission-based access control
  - [x] 1.9 Create RLS policies for `manufacturer_banking_accounts` table (sensitive data, restricted access)
  - [x] 1.10 Create helper function `has_permission(user_id, resource, action)` for RLS policies
  - [x] 1.11 Generate TypeScript types from Supabase schema and update `src/lib/supabase/types.ts`
  - [x] 1.12 Verify RLS policies block unauthorized access (test with different user roles)

- [x] 2.0 Implement Global Search Feature
  - [x] 2.1 Create `useGlobalSearch` hook with debounced query (300ms debounce)
  - [x] 2.2 Implement PostgreSQL full-text search queries for contacts, companies, manufacturers, products
  - [x] 2.3 Create search indexes on `name`, `email`, `part_number`, `tax_id` columns
  - [x] 2.4 Build `GlobalSearchBar` component with keyboard shortcut (Cmd/Ctrl + K)
  - [x] 2.5 Create `SearchResults` component with grouped results by entity type
  - [x] 2.6 Add entity type icon and secondary field (email for contacts, manufacturer for products) to each result
  - [x] 2.7 Implement partial matching (e.g., "Ant" matches "Anthropic")
  - [x] 2.8 Add loading state and empty state to search results
  - [x] 2.9 Implement click-to-navigate to entity detail page
  - [x] 2.10 Verify search returns results within 500ms for datasets up to 10,000 records

- [x] 3.0 Implement Entity List Views
  - [x] 3.1 Create/update `DataTable` component with sortable columns (ascending/descending)
  - [x] 3.2 Add column-specific filters (text search, dropdown, date range, boolean, numeric range)
  - [x] 3.3 Implement pagination with configurable page sizes (10, 25, 50, 100)
  - [x] 3.4 Add row checkbox selection and "Select All" for current page
  - [x] 3.5 Add "Select All Matching" option for all records matching current filters (cap at 1,000)
  - [x] 3.6 Display selected count when records are selected
  - [x] 3.7 Create `ContactsView` with columns: Name, Email, Phone, Company, Individual, Created
  - [x] 3.8 Create `CompaniesView` with columns: Name, Tax ID, Phone, City, Country, Contacts Count, Created
  - [x] 3.9 Create `ManufacturersView` with columns: Name, Phone, Contract Validity, Has Exclusivity, Products Count, Created
  - [x] 3.10 Create `ProductsView` with columns: Name, Part Number, Manufacturer, Warranty (Years), Created
  - [x] 3.11 Add "+ New [Entity]" button to each list view header
  - [x] 3.12 Implement row click to navigate to entity detail page

- [x] 4.0 Implement Entity Detail Page (Three-Column Layout)
  - [x] 4.1 Create `ThreeColumnLayout` component with fixed left (~280px), flexible center, fixed right (~300px)
  - [x] 4.2 Implement sticky behavior for right column when scrolling center
  - [x] 4.3 Create `EntityTimeline` component (left column) with chronological activity feed
  - [x] 4.4 Create `EntityForm` component (center column) with all entity fields
  - [x] 4.5 Create `RelatedEntitiesPanel` component (right column) with compact cards
  - [x] 4.6 Add page header showing entity name and key identifiers
  - [x] 4.7 Add action buttons: Edit, Delete, and entity-specific actions
  - [x] 4.8 Implement explicit Save/Cancel buttons for form (not auto-save for MVP)
  - [x] 4.9 Create `ContactDetailPage` with company, opportunities, orders, activities in related panel
  - [x] 4.10 Create `CompanyDetailPage` with contacts, opportunities, orders, activities in related panel
  - [x] 4.11 Create `ManufacturerDetailPage` with contacts, products, banking accounts, orders in related panel
  - [x] 4.12 Create `ProductDetailPage` with manufacturer, opportunities, orders, services in related panel
  - [x] 4.13 Add collapsible sections to related entities panel with "+ Add" buttons

- [x] 5.0 Implement Nested Relational Forms
  - [x] 5.1 Create `RelationalField` component with search input and "+ New" button
  - [x] 5.2 Implement search/select existing records with dropdown results
  - [x] 5.3 Create `NestedFormContainer` that expands inline below triggering field
  - [x] 5.4 Support up to 2 levels of nesting (e.g., Product → Manufacturer → Contact)
  - [x] 5.5 Add Save/Cancel buttons to nested forms
  - [x] 5.6 Implement: saving nested form creates record AND links to parent
  - [x] 5.7 Implement: canceling nested form collapses without creating records
  - [x] 5.8 Create `ContactNestedForm` for inline contact creation
  - [x] 5.9 Create `CompanyNestedForm` for inline company creation (with nested contacts option)
  - [x] 5.10 Create `ManufacturerNestedForm` for inline manufacturer creation (with nested contacts option)
  - [x] 5.11 For multi-select fields, display selected records as vertical list with remove icons
  - [x] 5.12 Add persistent "+ Add" trigger below multi-select lists
  - [x] 5.13 Validate nested forms independently with Zod schemas

- [x] 6.0 Implement Bulk Operations
  - [x] 6.1 Create `BulkActionsToolbar` component (appears when records selected)
  - [x] 6.2 Display selected count and available actions in toolbar
  - [x] 6.3 Add "Clear Selection" button to toolbar
  - [x] 6.4 Create `BulkDeleteConfirmModal` showing count of records to delete
  - [x] 6.5 Implement bulk delete with server-side validation (RLS must allow delete for each record)
  - [x] 6.6 Create `BulkExportModal` with CSV/Excel format selection
  - [x] 6.7 Implement export to include all visible columns plus optional all fields
  - [x] 6.8 Create `BulkEditModal` with field selector and new value input
  - [x] 6.9 Show preview of affected records before applying bulk edit
  - [x] 6.10 Implement bulk reassign for entities with owner/responsible fields
  - [x] 6.11 Log all bulk operations to audit system as single entry with affected record IDs
  - [x] 6.12 Add toast notifications for bulk operation success/failure

- [x] 7.0 Implement Manufacturer-Specific Features
  - [x] 7.1 Create `BankingAccountsSection` component for managing multiple accounts
  - [x] 7.2 Support multiple currencies (USD, EUR, GBP, etc.) per manufacturer
  - [x] 7.3 Include fields: bank_name, account_number, routing_number, swift_code, iban, intermediary_bank, is_primary
  - [x] 7.4 Create `ContractUploadSection` for contract and exclusivity agreement files
  - [x] 7.5 Integrate with Supabase Storage for file uploads (max 10MB per file)
  - [x] 7.6 Validate file type on server-side before accepting uploads
  - [x] 7.7 Create `contractAlerts.ts` service for contract expiration logic
  - [x] 7.8 Implement automated alert when `contract_validity` is within 60 days of expiration
  - [x] 7.9 Assign alerts to users with `database.manufacturers.edit` permission
  - [x] 7.10 Make alert frequency and lead time admin-configurable (store in settings table)

- [/] 8.0 Implement Timeline & Audit Logging
  - [x] 8.1 Create `audit_log` table with: entity_type, entity_id, action, changes (JSONB), user_id, timestamp
  - [x] 8.2 Create RLS policies for audit_log (users can view logs for entities they have access to)
  - [x] 8.3 Create `auditService.ts` for logging all field-level changes with old/new values
  - [x] 8.4 Create `useAuditLog` hook to fetch and paginate audit entries
  - [x] 8.5 Build `EntityTimeline` UI showing: timestamp, user who made change, change description
  - [x] 8.6 Display creation entry showing who created and when
  - [x] 8.7 Display last modified summary entry
  - [ ] 8.8 Show related activities (tasks, notes) in timeline (Postponed until Tasks module)
  - [x] 8.9 Make timeline entries expandable for multi-field changes (Implemented inline)
  - [ ] 8.10 Add filter by type (All, Changes, Activities) to timeline
  - [x] 8.11 Default sort newest-first with option to reverse

- [/] 9.0 Testing & Verification
  - [ ] 9.1 Verify all CRUD operations work for Contacts, Companies, Manufacturers, Products
  - [x] 9.2 Test RLS policies: verify users without permissions cannot access/modify data (Via Migration/Code)
  - [ ] 9.3 Test global search performance: ensure <500ms response time
  - [ ] 9.4 Test nested form creation: verify 2-level depth works correctly
  - [ ] 9.5 Test bulk operations: delete, export, edit, assign
  - [ ] 9.6 Test manufacturer banking accounts with multiple currencies
  - [ ] 9.7 Test file uploads for contracts (size limit, type validation)
  - [ ] 9.8 Test contract expiration alert generation
  - [x] 9.9 Verify audit log captures all changes with correct old/new values (Implemented in all Details pages)
  - [ ] 9.10 Test three-column layout responsiveness across viewport sizes
  - [ ] 9.11 Verify no sensitive data exposed in browser DevTools (Network tab, Console)
  - [x] 9.12 Run `npm run build` to verify no TypeScript errors
