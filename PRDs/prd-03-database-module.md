# PRD-03: Database Module

## Document Info
| Field | Value |
|-------|-------|
| PRD ID | PRD-03 |
| Feature | Database Module — Core Entity Management |
| Author | Claude (AI Assistant) |
| Created | December 10, 2025 |
| Status | Draft |
| Related PRDs | PRD-01 (Project Initialization), PRD-02 (Authentication & Authorization) |

---

## 1. Introduction/Overview

The Database Module is the central repository for managing TIMS's core business entities. It provides users with the ability to create, view, edit, and organize the foundational data that all other modules depend on.

### Core Entities

| Entity | Description |
|--------|-------------|
| **Contacts** | Individuals who interact with Tennessine — clients, manufacturer representatives, partners |
| **Companies** | Client organizations that purchase equipment |
| **Manufacturers** | Equipment suppliers with contracts, exclusivity agreements, and banking information |
| **Products** | Equipment items distributed by Tennessine, always linked to a manufacturer |

### Why This Module Matters

Every other module in TIMS references these entities:
- **CRM Module** uses Contacts and Companies for opportunities
- **Order Management** references Products and Manufacturers
- **Services Module** links to Products for warranty tracking
- **Finances Module** uses Manufacturer banking info for payments

The Database Module ensures data quality and consistency across the entire system.

---

## 2. Goals

| Goal ID | Description | Measurable Outcome |
|---------|-------------|-------------------|
| G-01 | Centralized entity management | All four core entities manageable from one module |
| G-02 | Efficient data entry with nested forms | Users can create related records without leaving context |
| G-03 | Quick data discovery | Global search returns results in < 500ms |
| G-04 | Comprehensive entity views | Three-column detail pages show all relevant information |
| G-05 | Bulk data operations | Users can perform actions on multiple records efficiently |
| G-06 | Complete audit trail | All changes tracked and visible in entity timeline |

---

## 3. User Stories

### 3.1 General Navigation

| ID | User Story |
|----|------------|
| US-01 | As a user, I want to access Contacts, Companies, Manufacturers, and Products from the Database module so that I can manage core business data in one place. |
| US-02 | As a user, I want to use a global search bar to find any entity across the system so that I can quickly locate records without knowing which entity type they belong to. |

### 3.2 Contacts

| ID | User Story |
|----|------------|
| US-03 | As a user, I want to create a new contact with name, email, phone, and optional company association so that I can track individuals I interact with. |
| US-04 | As a user, I want to mark a contact as an "Individual Client" so that I can add an address directly to the contact instead of requiring a company. |
| US-05 | As a user, I want to see all opportunities, orders, and activities related to a contact on their detail page so that I have full context. |
| US-06 | As a user, I want to create a new company while creating a contact (nested form) so that I don't have to leave the contact creation flow. |

### 3.3 Companies

| ID | User Story |
|----|------------|
| US-07 | As a user, I want to create a new company with name, tax ID, phone, address, and website so that I can track client organizations. |
| US-08 | As a user, I want to see all contacts associated with a company on the company detail page so that I know who works there. |
| US-09 | As a user, I want to add existing contacts to a company or create new contacts inline so that I can build the contact list efficiently. |
| US-10 | As a user, I want to see all opportunities linked to a company so that I understand our business relationship. |

### 3.4 Manufacturers

| ID | User Story |
|----|------------|
| US-11 | As a user, I want to create a manufacturer with company details plus contract validity, contract file, and exclusivity agreement information. |
| US-12 | As a user, I want to add banking information to a manufacturer (multiple accounts with different currencies) so that finance can process payments. |
| US-13 | As a user, I want to see all products from a manufacturer on their detail page so that I know what equipment they supply. |
| US-14 | As a user, I want to see all contacts (manufacturer representatives) associated with a manufacturer. |
| US-15 | As a user, I want to receive an alert when a manufacturer contract is approaching expiration so that we can renew on time. |

### 3.5 Products

| ID | User Story |
|----|------------|
| US-16 | As a user, I want to create a product with name, part number, manufacturer, description, and default warranty period. |
| US-17 | As a user, I want to filter the products list by manufacturer so that I can see only products from a specific supplier. |
| US-18 | As a user, I want to create a new manufacturer while creating a product (nested form) so that I can add new suppliers on the fly. |
| US-19 | As a user, I want to see which opportunities and orders include a specific product so that I understand its sales history. |

### 3.6 Bulk Operations

| ID | User Story |
|----|------------|
| US-20 | As a user, I want to select multiple records and delete them in bulk so that I can clean up data efficiently. |
| US-21 | As a user, I want to select multiple records and export them to CSV/Excel so that I can analyze data externally. |
| US-22 | As a user, I want to bulk edit a specific field across multiple records so that I can make mass updates. |
| US-23 | As a user, I want to bulk import records from a CSV file so that I can migrate data from other systems. |
| US-24 | As a user, I want to bulk assign/reassign records (e.g., change responsible user) so that I can redistribute workload. |

### 3.7 Timeline & Activity

| ID | User Story |
|----|------------|
| US-25 | As a user, I want to see a timeline of all changes made to an entity (audit log) so that I know its history. |
| US-26 | As a user, I want to see related activities (tasks, notes) in the entity timeline so that I have full context. |
| US-27 | As a user, I want to see when the entity was last edited and by whom so that I know how current the data is. |

---

## 4. Functional Requirements

### 4.1 Module Navigation

| Req ID | Requirement |
|--------|-------------|
| FR-01 | The Database module must be accessible from the main navigation sidebar. |
| FR-02 | The Database module must have four distinct navigation items: Contacts, Companies, Manufacturers, Products. |
| FR-03 | Each entity type must have its own list view and detail view. |
| FR-04 | The module must display a badge/count of total active records per entity type (optional, can be toggled). |

### 4.2 Global Search

| Req ID | Requirement |
|--------|-------------|
| FR-05 | The system must provide a global search bar accessible from anywhere in the Database module. |
| FR-06 | Global search must query across all four entity types simultaneously. |
| FR-07 | Search results must be grouped by entity type with clear visual separation. |
| FR-08 | Each search result must display: entity type icon, primary identifier (name), and one secondary field (e.g., email for contacts, manufacturer for products). |
| FR-09 | Clicking a search result must navigate to that entity's detail page. |
| FR-10 | Search must support partial matching (e.g., "Ant" matches "Anthropic"). |
| FR-11 | Search must return results within 500ms for datasets up to 10,000 records. |
| FR-12 | Search must have a keyboard shortcut (Cmd/Ctrl + K) for quick access. |

### 4.3 Entity List View

| Req ID | Requirement |
|--------|-------------|
| FR-13 | Each entity list must display records in a table format with sortable columns. |
| FR-14 | Table columns must be entity-specific (defined in Section 5). |
| FR-15 | Each table must support ascending and descending sort on any column. |
| FR-16 | Each table must have a search input that filters the current list. |
| FR-17 | Each table must support column-specific filters (e.g., filter Products by Manufacturer). |
| FR-18 | Each table must support pagination with configurable page size (10, 25, 50, 100). |
| FR-19 | Clicking a row must navigate to the entity detail page. |
| FR-20 | Each row must have a checkbox for bulk selection. |
| FR-21 | A "Select All" checkbox must select all visible rows (current page). |
| FR-22 | A "Select All Matching" option must select all records matching current filters (across pages). |
| FR-23 | Selected count must be displayed when records are selected. |
| FR-24 | Each list must have a "+ New [Entity]" button to create a new record. |

### 4.4 Entity Detail Page — Three-Column Layout

| Req ID | Requirement |
|--------|-------------|
| FR-25 | Each entity detail page must use a three-column layout. |
| FR-26 | **Left Column (Timeline)**: Must display chronological activity feed (audit log + related activities). Width: ~280px, scrollable. |
| FR-27 | **Center Column (Form)**: Must display all entity fields in an editable form. Width: flexible (remaining space). |
| FR-28 | **Right Column (Related Entities)**: Must display related records with quick-view cards. Width: ~300px, fixed position when scrolling center. |
| FR-29 | The center column form must auto-save changes OR have explicit Save/Cancel buttons (configurable behavior). |
| FR-30 | The page must have a header showing entity name and key identifiers. |
| FR-31 | The page must have action buttons: Edit (if not inline edit), Delete, and entity-specific actions. |

### 4.5 Timeline (Left Column)

| Req ID | Requirement |
|--------|-------------|
| FR-32 | Timeline must show all field-level changes (audit log) with old and new values. |
| FR-33 | Timeline must show when the entity was created and by whom. |
| FR-34 | Timeline must show when the entity was last edited and by whom (summary entry). |
| FR-35 | Timeline must show related activities: tasks assigned to this entity, notes added, emails logged. |
| FR-36 | Each timeline entry must show: timestamp, user who made the change, and change description. |
| FR-37 | Timeline entries must be expandable to show full details (for changes with multiple fields). |
| FR-38 | Timeline must support filtering by type (All, Changes, Activities). |
| FR-39 | Timeline must be sorted newest-first by default, with option to reverse. |

### 4.6 Related Entities Panel (Right Column)

| Req ID | Requirement |
|--------|-------------|
| FR-40 | Related entities panel must show compact cards for each related record. |
| FR-41 | Each card must display: entity type icon, name, and one key detail. |
| FR-42 | Clicking a related entity card must navigate to that entity's detail page. |
| FR-43 | Panel must group related entities by type with collapsible sections. |
| FR-44 | Each section must have a "+ Add" button to link or create related records. |
| FR-45 | Panel must remain fixed/sticky when scrolling the center form. |

### 4.7 Nested Relational Forms

| Req ID | Requirement |
|--------|-------------|
| FR-46 | When creating/editing an entity, related entity fields must allow inline creation of new related records. |
| FR-47 | Nested forms must support up to **two levels deep** (e.g., Product → Manufacturer → Contact). |
| FR-48 | Nested form must expand inline below the field that triggered it. |
| FR-49 | Nested form must have its own Save/Cancel buttons. |
| FR-50 | Saving a nested form must create the related record AND link it to the parent. |
| FR-51 | Canceling a nested form must collapse it without creating any records. |
| FR-52 | User must be able to search/select existing records OR trigger nested creation. |
| FR-53 | Multi-select related fields (e.g., Company → Contacts) must display selected records as a vertical list with individual remove icons. |
| FR-54 | Multi-select fields must have a persistent "+ Add" trigger below the list. |

### 4.8 Bulk Operations

| Req ID | Requirement |
|--------|-------------|
| FR-55 | When records are selected, a bulk actions toolbar must appear. |
| FR-56 | Bulk actions toolbar must display: selected count, available actions, and "Clear Selection" button. |
| FR-57 | **Bulk Delete**: Must prompt for confirmation showing count of records to delete. |
| FR-58 | **Bulk Export**: Must export selected records to CSV or Excel format. |
| FR-59 | **Bulk Export**: Must include all visible columns plus optionally all fields. |
| FR-60 | **Bulk Edit**: Must open a modal allowing user to select which field to edit and provide new value. |
| FR-61 | **Bulk Edit**: Must show preview of affected records before applying. |
| FR-62 | **Bulk Assign**: For entities with owner/responsible fields, must allow reassigning to different user. |
| FR-63 | **Bulk Import**: Must accept CSV file upload with field mapping interface. |
| FR-64 | **Bulk Import**: Must validate data and show errors before committing. |
| FR-65 | **Bulk Import**: Must support duplicate detection based on configurable key fields (e.g., email for contacts). |
| FR-66 | All bulk operations must be logged in the audit system. |

---

## 5. Entity Specifications

### 5.1 Contacts

#### 5.1.1 Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `name` | Text | Yes | Full name of the contact |
| `email` | Email | Yes | Primary email address |
| `phone` | Text | No | Phone number |
| `is_individual` | Boolean | No | If true, contact is a direct client (not associated with company) |
| `company_id` | FK → Companies | No | Associated company (required if not individual) |
| `address` | Address Object | No | Required if `is_individual` is true |
| `job_title` | Text | No | Role/position at company |
| `notes` | Text | No | Free-form notes |
| `created_at` | Timestamp | Auto | Record creation time |
| `updated_at` | Timestamp | Auto | Last modification time |
| `created_by` | FK → Users | Auto | User who created the record |
| `updated_by` | FK → Users | Auto | User who last modified the record |

#### 5.1.2 Address Object (for Individual Contacts)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `street` | Text | Yes | Street name and number |
| `complement` | Text | No | Apartment, suite, unit, etc. |
| `neighborhood` | Text | No | Neighborhood/district |
| `city` | Text | Yes | City name |
| `state_province` | Text | Yes | State or province |
| `country` | Text | Yes | Country |
| `postal_code` | Text | Yes | ZIP/postal code |
| `formatted_address` | Text | Auto | Full formatted address from Google Places |
| `place_id` | Text | No | Google Places ID for reference |

#### 5.1.3 List View Columns

| Column | Sortable | Filterable |
|--------|----------|------------|
| Name | Yes | Text search |
| Email | Yes | Text search |
| Phone | Yes | Text search |
| Company | Yes | Dropdown (companies list) |
| Individual | Yes | Boolean |
| Created | Yes | Date range |

#### 5.1.4 Related Entities (Detail Page)

- Company (if associated)
- Opportunities (where contact is primary contact)
- Orders (related through opportunities)
- Activities (tasks, notes assigned to this contact)

#### 5.1.5 Nested Form Triggers

- **Company field**: Can create new Company inline (1 level)
- When creating Company inline, can also add Contacts to it (2 levels)

---

### 5.2 Companies

#### 5.2.1 Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `name` | Text | Yes | Company name |
| `tax_id` | Text | No | Tax identification number (CNPJ/EIN) |
| `phone` | Text | No | Main phone number |
| `website` | URL | No | Company website |
| `address` | Address Object | No | Company headquarters address |
| `notes` | Text | No | Free-form notes |
| `created_at` | Timestamp | Auto | Record creation time |
| `updated_at` | Timestamp | Auto | Last modification time |
| `created_by` | FK → Users | Auto | User who created the record |
| `updated_by` | FK → Users | Auto | User who last modified the record |

#### 5.2.2 List View Columns

| Column | Sortable | Filterable |
|--------|----------|------------|
| Name | Yes | Text search |
| Tax ID | Yes | Text search |
| Phone | Yes | Text search |
| City | Yes | Text search |
| Country | Yes | Dropdown |
| Contacts Count | Yes | Numeric range |
| Created | Yes | Date range |

#### 5.2.3 Related Entities (Detail Page)

- Contacts (employees/representatives at this company)
- Opportunities (linked to this company)
- Orders (related through opportunities)
- Activities (tasks, notes related to this company)

#### 5.2.4 Nested Form Triggers

- **Contacts multi-select**: Can create new Contact inline (1 level)

---

### 5.3 Manufacturers

#### 5.3.1 Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `name` | Text | Yes | Manufacturer name |
| `tax_id` | Text | No | Tax identification number |
| `phone` | Text | No | Main phone number |
| `website` | URL | No | Manufacturer website |
| `address` | Address Object | No | Manufacturer headquarters address |
| `contract_validity` | Date | No | Contract expiration date |
| `contract_file_id` | FK → Documents | No | Uploaded contract document |
| `has_exclusivity` | Boolean | No | Whether exclusivity agreement exists |
| `exclusivity_file_id` | FK → Documents | No | Uploaded exclusivity agreement |
| `notes` | Text | No | Free-form notes |
| `created_at` | Timestamp | Auto | Record creation time |
| `updated_at` | Timestamp | Auto | Last modification time |
| `created_by` | FK → Users | Auto | User who created the record |
| `updated_by` | FK → Users | Auto | User who last modified the record |

#### 5.3.2 Banking Information (Separate Related Entity)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `manufacturer_id` | FK → Manufacturers | Yes | Parent manufacturer |
| `currency` | Enum | Yes | Account currency (USD, EUR, GBP, etc.) |
| `bank_name` | Text | Yes | Name of the bank |
| `account_number` | Text | Yes | Account number |
| `routing_number` | Text | No | Routing/ABA number (US) |
| `swift_code` | Text | No | SWIFT/BIC code (international) |
| `iban` | Text | No | IBAN (international) |
| `intermediary_bank` | Text | No | Intermediary bank details |
| `notes` | Text | No | Payment instructions or notes |
| `is_primary` | Boolean | No | Primary account for this currency |

#### 5.3.3 List View Columns

| Column | Sortable | Filterable |
|--------|----------|------------|
| Name | Yes | Text search |
| Phone | Yes | Text search |
| Contract Validity | Yes | Date range |
| Has Exclusivity | Yes | Boolean |
| Products Count | Yes | Numeric range |
| Created | Yes | Date range |

#### 5.3.4 Related Entities (Detail Page)

- Contacts (manufacturer representatives)
- Products (equipment from this manufacturer)
- Banking Accounts (payment information)
- Orders (placed with this manufacturer)
- Activities (tasks, notes)

#### 5.3.5 Nested Form Triggers

- **Contacts multi-select**: Can create new Contact inline (1 level)
- **Products multi-select**: Can create new Product inline (1 level)

#### 5.3.6 Contract Expiration Alert

| Req ID | Requirement |
|--------|-------------|
| FR-67 | System must create an automated alert/task when `contract_validity` is within 60 days of expiration. |
| FR-68 | Alert must be assigned to users with `database.manufacturers.edit` permission. |
| FR-69 | Alert frequency and lead time should be admin-configurable. |

---

### 5.4 Products

#### 5.4.1 Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `name` | Text | Yes | Product name |
| `part_number` | Text | No | Manufacturer part number / SKU |
| `manufacturer_id` | FK → Manufacturers | Yes | Manufacturing company |
| `description` | Text | No | Product description |
| `default_warranty_years` | Integer | No | Default warranty period in years |
| `notes` | Text | No | Free-form notes |
| `created_at` | Timestamp | Auto | Record creation time |
| `updated_at` | Timestamp | Auto | Last modification time |
| `created_by` | FK → Users | Auto | User who created the record |
| `updated_by` | FK → Users | Auto | User who last modified the record |

#### 5.4.2 List View Columns

| Column | Sortable | Filterable |
|--------|----------|------------|
| Name | Yes | Text search |
| Part Number | Yes | Text search |
| Manufacturer | Yes | Dropdown (manufacturers list) |
| Warranty (Years) | Yes | Numeric range |
| Created | Yes | Date range |

#### 5.4.3 Related Entities (Detail Page)

- Manufacturer (parent)
- Opportunities (where this product is included)
- Orders (where this product was ordered)
- Services (installation, maintenance records for this product)

#### 5.4.4 Nested Form Triggers

- **Manufacturer field**: Can create new Manufacturer inline (1 level)
- When creating Manufacturer inline, can also add Contacts (2 levels)

---

## 6. Non-Goals (Out of Scope)

| Item | Reason |
|------|--------|
| Lookup table management (Incoterms, Payment Terms, etc.) | Will be in Settings/Admin module |
| Custom Fields configuration | Will be in dedicated Custom Fields module |
| Import/Export functionality | Deferred to future iteration per user request |
| Kanban/Card view for entities | Simple table view sufficient for MVP |
| Inline table editing | Edit through detail page for data integrity |
| AI-assisted search | Standard search sufficient for MVP |

---

## 7. Design Considerations

### 7.1 List View Mockup

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Database  ›  Contacts                                      [+ New Contact] │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔍 Search contacts...                    [Filters ▾]  [Columns ▾]          │
├─────────────────────────────────────────────────────────────────────────────┤
│  ☐  │ Name           │ Email              │ Company        │ Created       │
│─────┼────────────────┼────────────────────┼────────────────┼───────────────│
│  ☐  │ John Smith     │ john@acme.com      │ Acme Corp      │ Dec 5, 2025   │
│  ☐  │ Maria Santos   │ maria@lab.br       │ BioLab Brasil  │ Dec 3, 2025   │
│  ☐  │ David Chen     │ david@mfg.com      │ (Individual)   │ Dec 1, 2025   │
│  ☐  │ ...            │ ...                │ ...            │ ...           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Showing 1-25 of 142 contacts                    [◀ Prev]  [1] 2 3  [Next ▶]│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Detail Page Three-Column Layout Mockup

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Contacts          John Smith                    [Edit] [Delete] [•••]   │
├─────────────────┬────────────────────────────────────────┬─────────────────────────┤
│   TIMELINE      │              DETAILS                   │    RELATED ENTITIES     │
│                 │                                        │                         │
│ ┌─────────────┐ │  ┌────────────────────────────────┐   │  ┌─ Company ──────────┐ │
│ │ Dec 10, 10am│ │  │ Name *                         │   │  │ 🏢 Acme Corp       │ │
│ │ You edited  │ │  │ [John Smith                  ] │   │  │    New York, USA   │ │
│ │ • email     │ │  │                                │   │  └────────────────────┘ │
│ │ • phone     │ │  │ Email *                        │   │                         │
│ └─────────────┘ │  │ [john@acme.com               ] │   │  ┌─ Opportunities ───┐  │
│                 │  │                                │   │  │ 📊 Lab Equipment   │  │
│ ┌─────────────┐ │  │ Phone                          │   │  │    Quotation stage │  │
│ │ Dec 8, 3pm  │ │  │ [+1 555 123 4567             ] │   │  │                    │  │
│ │ Task created│ │  │                                │   │  │ 📊 Microscope Deal │  │
│ │ "Follow up" │ │  │ Company                        │   │  │    Closing stage   │  │
│ └─────────────┘ │  │ [Acme Corp               ] [+] │   │  │                    │  │
│                 │  │                                │   │  │ + View all (5)     │  │
│ ┌─────────────┐ │  │ Job Title                      │   │  └────────────────────┘ │
│ │ Dec 5, 2pm  │ │  │ [Procurement Manager         ] │   │                         │
│ │ Created by  │ │  │                                │   │  ┌─ Activities ──────┐  │
│ │ Maria S.    │ │  │ Notes                          │   │  │ ✓ Call completed   │  │
│ └─────────────┘ │  │ [                             ]│   │  │ ○ Send proposal    │  │
│                 │  │ [                             ]│   │  │ + Add activity     │  │
│ [Show all...]   │  └────────────────────────────────┘   │  └────────────────────┘ │
│                 │                                        │                         │
│                 │              [Save]  [Cancel]          │                         │
├─────────────────┴────────────────────────────────────────┴─────────────────────────┤
│  ~280px fixed  │           Flexible width                │    ~300px fixed         │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Nested Form Mockup

```
┌────────────────────────────────────────────────┐
│ Company                                        │
│ [Search companies...              ] [+ New]    │
│                                                │
│ ┌─ Create New Company ───────────────────────┐ │
│ │                                            │ │
│ │  Name *                                    │ │
│ │  [                                      ]  │ │
│ │                                            │ │
│ │  Tax ID                                    │ │
│ │  [                                      ]  │ │
│ │                                            │ │
│ │  Phone                                     │ │
│ │  [                                      ]  │ │
│ │                                            │ │
│ │  Contacts                                  │ │
│ │  [Search contacts...            ] [+ New]  │ │  ← Level 2 nesting available
│ │                                            │ │
│ │           [Cancel]  [Create Company]       │ │
│ └────────────────────────────────────────────┘ │
│                                                │
└────────────────────────────────────────────────┘
```

### 7.4 Bulk Actions Toolbar Mockup

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✓ 12 selected                                                              │
│                                                                             │
│  [🗑 Delete]  [📤 Export]  [✏️ Edit Field]  [👤 Reassign]    [✕ Clear]     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Technical Considerations

### 8.1 Database Schema Notes

This section provides guidance for database table design. Full schema will be in the Database Schema PRD.

#### 8.1.1 Unified Companies Approach

Per previous architectural decisions, Companies and Manufacturers will use a **single `companies` table with type discriminator**:

```sql
-- Simplified concept (full schema in Database Schema PRD)
companies (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('company', 'manufacturer')),
  name TEXT NOT NULL,
  -- Common fields...
  -- Manufacturer-specific fields (nullable for type='company')
  contract_validity DATE,
  contract_file_id UUID,
  has_exclusivity BOOLEAN,
  exclusivity_file_id UUID
)
```

**UI Implication**: Despite shared table, UI shows "Companies" and "Manufacturers" as separate navigation items with:
- Companies list: `WHERE type = 'company'`
- Manufacturers list: `WHERE type = 'manufacturer'`

#### 8.1.2 Address Storage

Addresses will be stored as structured JSONB or separate `addresses` table (TBD in schema PRD). Use Google Places API for resolution.

#### 8.1.3 File Storage

Document uploads (contracts, agreements) will use Supabase Storage with references stored in the database.

### 8.2 Permission Integration

All Database Module operations must respect permissions from PRD-02:

| Operation | Required Permission |
|-----------|-------------------|
| View Contacts list | `database.contacts.view` |
| Create Contact | `database.contacts.create` |
| Edit Contact | `database.contacts.edit` |
| Delete Contact | `database.contacts.delete` |
| View Companies list | `database.companies.view` |
| ... | ... (same pattern for all entities) |

### 8.3 Audit Logging Integration

All changes must be logged to the audit system:
- Field-level changes with old/new values
- Bulk operations logged as single audit entry with affected record IDs
- Related entity changes (e.g., adding contact to company) logged on both entities

### 8.4 Search Implementation

Global search should use:
- PostgreSQL full-text search for scalability
- Indexed columns: `name`, `email`, `part_number`, `tax_id`
- Consider search index refresh strategy for real-time updates

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Entity CRUD operations | 100% functional | All create, read, update, delete work |
| Global search response time | < 500ms | Measure P95 latency |
| Nested form depth | 2 levels | Can create grandchild records |
| Bulk operations | 4 types working | Delete, Export, Edit, Assign functional |
| Timeline accuracy | 100% | All changes appear in timeline |
| Three-column layout | Renders correctly | All viewport sizes handled |

---

## 10. Open Questions

| ID | Question | Impact | Proposed Answer |
|----|----------|--------|-----------------|
| OQ-01 | Should global search include deleted/archived records? | Low | No, search active records only |
| OQ-02 | Maximum records for "Select All Matching" bulk operation? | Medium | Cap at 1,000 with warning |
| OQ-03 | Should detail page form auto-save or require explicit save? | Medium | Explicit save for data integrity |
| OQ-04 | Should timeline show related entity changes (e.g., when Company's Contact was edited)? | Low | No for MVP, add later if needed |
| OQ-05 | File size limit for contract/agreement uploads? | Low | 10MB per file |

---

## Appendix A: Entity Relationship Summary

```
                    ┌─────────────┐
                    │   Contact   │
                    └──────┬──────┘
                           │ N:1
                           ▼
┌─────────────┐      ┌─────────────┐
│   Product   │      │   Company   │
└──────┬──────┘      └─────────────┘
       │ N:1               │
       │                   │ (type='manufacturer')
       ▼                   ▼
┌──────────────────────────────────┐
│          Manufacturer            │
│   (companies WHERE type='mfg')   │
├──────────────────────────────────┤
│ • contract_validity              │
│ • contract_file                  │
│ • has_exclusivity                │
│ • exclusivity_file               │
│ • banking_accounts (1:N)         │
└──────────────────────────────────┘
```

---

## Appendix B: Permission Codes Reference

```
database.view                    - Access Database module
database.admin                   - Full admin access

database.contacts.view           - View contacts
database.contacts.create         - Create contacts
database.contacts.edit           - Edit contacts
database.contacts.delete         - Delete contacts

database.companies.view          - View companies
database.companies.create        - Create companies
database.companies.edit          - Edit companies
database.companies.delete        - Delete companies

database.manufacturers.view      - View manufacturers
database.manufacturers.create    - Create manufacturers
database.manufacturers.edit      - Edit manufacturers
database.manufacturers.delete    - Delete manufacturers

database.products.view           - View products
database.products.create         - Create products
database.products.edit           - Edit products
database.products.delete         - Delete products
database.products.download       - Download product files
```

---

*End of PRD-03*
