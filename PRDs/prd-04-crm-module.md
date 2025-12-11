# PRD-04: CRM Module

## Document Info
| Field | Value |
|-------|-------|
| PRD ID | PRD-04 |
| Feature | CRM Module — Opportunities Pipeline & Quotations |
| Author | Claude (AI Assistant) |
| Created | December 10, 2025 |
| Status | Draft |
| Related PRDs | PRD-01 (Project Initialization), PRD-02 (Auth), PRD-03 (Database Module) |

---

## 1. Introduction/Overview

The CRM Module is the core sales management system within TIMS. It manages the complete opportunity lifecycle from initial lead through closed deal, including quotation creation, pricing, and stage progression.

### Core Capabilities

| Capability | Description |
|------------|-------------|
| **Opportunity Pipeline** | Visual Kanban board and list view for managing sales opportunities |
| **Cumulative Stage Model** | Each stage has required fields that must be completed before advancing |
| **Quotation Management** | Create, version, and manage quotations with line-item pricing |
| **Multi-Currency Support** | Track net (manufacturer) and sales (client) prices in different currencies |
| **Dual Quotation Types** | Support for Direct Importation and Nationalized Sale quotations |

### Pipeline Stages

```
Lead Backlog → Qualification → Quotation → Closing → Won
                                                    ↘ Lost (from any stage)
```

---

## 2. Goals

| Goal ID | Description | Measurable Outcome |
|---------|-------------|-------------------|
| G-01 | Centralized opportunity management | All opportunities visible in Kanban and list views |
| G-02 | Enforced sales process | Stage advancement requires completing mandatory fields |
| G-03 | Accurate quotation tracking | Multiple quotation types and versions per opportunity |
| G-04 | Clear financial visibility | Net and sales values visible throughout pipeline |
| G-05 | Flexible administration | Admins can configure stages, fields, and validation rules |
| G-06 | Efficient workflow | Users can advance opportunities without leaving context |

---

## 3. User Stories

### 3.1 Pipeline Views

| ID | User Story |
|----|------------|
| US-01 | As a sales user, I want to view all opportunities in a Kanban board so that I can see the pipeline at a glance. |
| US-02 | As a sales user, I want to view opportunities in a table/list format so that I can sort, filter, and analyze data. |
| US-03 | As a sales user, I want to switch between Kanban and List views so that I can use the view best suited to my task. |
| US-04 | As a sales user, I want to filter opportunities by stage, owner, date range, and value so that I can focus on relevant deals. |

### 3.2 Opportunity Management

| ID | User Story |
|----|------------|
| US-05 | As a sales user, I want to create a new opportunity from the Kanban or List view so that I can start tracking a new lead. |
| US-06 | As a sales user, I want to drag an opportunity card to the next stage so that I can advance the deal. |
| US-07 | As a sales user, I want to see which fields are missing when I try to advance a stage so that I can complete them. |
| US-08 | As a sales user, I want to fill missing required fields in a modal (from Kanban) so that I don't have to open the detail page. |
| US-09 | As a sales user, I want to see days since opportunity creation so that I can identify stale deals. |
| US-10 | As a sales user, I want to reassign an opportunity to another user so that workload can be redistributed. |
| US-11 | As a sales user, I want to mark an opportunity as Lost with a reason so that we can track why deals fail. |

### 3.3 Opportunity Detail Page

| ID | User Story |
|----|------------|
| US-12 | As a sales user, I want to view a full-page opportunity detail so that I can see all information in one place. |
| US-13 | As a sales user, I want to see stage fields in an accordion layout so that I know what's required for each stage. |
| US-14 | As a sales user, I want to fill fields for future stages without advancing so that I can prepare ahead. |
| US-15 | As a sales user, I want to see a timeline of all changes and activities so that I have full history. |
| US-16 | As a sales user, I want to see related entities (contact, company, products, manufacturer) in a fixed panel so that I have context while scrolling. |

### 3.4 Products & Quotations

| ID | User Story |
|----|------------|
| US-17 | As a sales user, I want to add products to an opportunity (before quotation) so that I can track what equipment the client is interested in. |
| US-18 | As a sales user, I want to create a quotation that imports the opportunity's product list so that I don't re-enter products. |
| US-19 | As a sales user, I want to create both Direct Importation and Nationalized Sale quotations for the same opportunity. |
| US-20 | As a sales user, I want to revise a quotation (create a new version) so that I can update pricing without losing history. |
| US-21 | As a sales user, I want to see the latest quotation of each type with access to revision history. |
| US-22 | As a sales user, I want to mark a quotation as "Sent" with a date so that I can track client communication. |
| US-23 | As a sales user, I want to mark a quotation as "Accepted" so that the opportunity can advance to Closing. |

### 3.5 Peripherals

| ID | User Story |
|----|------------|
| US-24 | As a sales user, I want to indicate that peripherals are needed for this deal so that I can track accessory requirements. |
| US-25 | As a sales user, I want to add peripheral items (name and description) so that the order team knows what to procure. |

### 3.6 Administration

| ID | User Story |
|----|------------|
| US-26 | As an admin, I want to add, edit, reorder, or remove pipeline stages so that the process matches our workflow. |
| US-27 | As an admin, I want to configure which fields are required at each stage so that I can enforce our sales process. |
| US-28 | As an admin, I want to add custom fields to opportunities so that we can track additional information. |
| US-29 | As an admin, I want to manage the list of Lost Reasons so that we have consistent categorization. |
| US-30 | As an admin, I want to manage Sale Types so that we can add new sales models as the business evolves. |

---

## 4. Functional Requirements

### 4.1 Kanban View

| Req ID | Requirement |
|--------|-------------|
| FR-01 | The Kanban view must display one column per active pipeline stage. |
| FR-02 | Each column must show the stage name and count of opportunities. |
| FR-03 | Columns must be horizontally scrollable when they exceed viewport width. |
| FR-04 | **Won and Lost columns** must be collapsed by default (expandable on click). |
| FR-05 | Opportunity cards must be draggable between columns. |
| FR-06 | Cards can only be dragged to the **immediate next stage** (sequential advancement). |
| FR-07 | Cards can be dragged **backward** to any previous stage without restriction. |
| FR-08 | When dragging to next stage, if required fields are missing, a modal must appear with only those fields. |
| FR-09 | Completing the modal fields and saving must advance the opportunity to the new stage. |
| FR-10 | Clicking a card must navigate to the Opportunity Detail Page. |
| FR-11 | The Kanban must have a "+ New Opportunity" button. |

### 4.2 Kanban Card Content

| Req ID | Requirement |
|--------|-------------|
| FR-12 | Each card must display: Opportunity title. |
| FR-13 | Each card must display: Company name (or "Individual: [Contact Name]" if no company). |
| FR-14 | Each card must display: Total net value / Total sales value (with currencies). |
| FR-15 | Each card must display: Days in current stage. |
| FR-16 | Each card must display: Assigned user avatar. |
| FR-17 | Each card must display: Next scheduled activity date (if any). |
| FR-18 | Each card must display: Product/Service of interest (primary product name or count). |
| FR-19 | Cards must show visual indicator if opportunity is stale (configurable threshold, default 14 days). |

### 4.3 List View

| Req ID | Requirement |
|--------|-------------|
| FR-20 | The List view must display opportunities in a sortable table. |
| FR-21 | Default columns: Title, Company, Contact, Stage, Net Value, Sales Value, Days Open, Owner, Last Activity. |
| FR-22 | Users must be able to show/hide columns. |
| FR-23 | Users must be able to sort by any visible column. |
| FR-24 | Users must be able to filter by: Stage, Owner, Date Range (created, last activity), Value Range. |
| FR-25 | Users must be able to search by opportunity title, company name, or contact name. |
| FR-26 | Clicking a row must navigate to the Opportunity Detail Page. |
| FR-27 | The List view must have a "+ New Opportunity" button. |
| FR-28 | The List view must support bulk selection and actions (as defined in PRD-03). |

### 4.4 Opportunity Creation

| Req ID | Requirement |
|--------|-------------|
| FR-29 | Clicking "+ New Opportunity" must open a creation modal/form. |
| FR-30 | Creation form must include: Title (required), Contact (searchable with inline create), Company (auto-filled from contact if applicable), Products (multi-select, searchable), Lead Origin (dropdown), Office (TIA/TIC dropdown). |
| FR-31 | New opportunities must be created in the **Lead Backlog** stage. |
| FR-32 | The creator must be set as the opportunity owner by default. |
| FR-33 | Upon creation, user must be navigated to the new Opportunity Detail Page. |

### 4.5 Opportunity Detail Page — Layout

| Req ID | Requirement |
|--------|-------------|
| FR-34 | The detail page must use a **three-column layout**. |
| FR-35 | **Left Column (Timeline)**: Chronological feed of changes and activities. Width ~280px, scrollable. |
| FR-36 | **Center Column (Form)**: Stage fields in accordion layout. Width flexible. |
| FR-37 | **Right Column (Related Entities)**: Contact, Company, Products, Manufacturer cards. Width ~300px, fixed/sticky. |
| FR-38 | The header must show: Opportunity title, current stage badge, days open, owner avatar. |
| FR-39 | The header must have action buttons: "Advance Stage", "Mark as Lost", "More Actions (...)". |

### 4.6 Opportunity Detail Page — Stage Accordion

| Req ID | Requirement |
|--------|-------------|
| FR-40 | Stage fields must be displayed in a **vertical accordion layout**. |
| FR-41 | The **current stage** must appear first and be **expanded by default**. |
| FR-42 | **Upcoming stages** must appear next, in order, collapsed. |
| FR-43 | **Completed stages** must appear last, in reverse order, collapsed. |
| FR-44 | Users must be able to expand any stage accordion to view/edit its fields. |
| FR-45 | Filling fields in future stages must **NOT** automatically advance the opportunity. |
| FR-46 | Each stage section must show a completion indicator (e.g., "3/5 fields completed"). |
| FR-47 | Required fields must be visually marked (e.g., asterisk, different label color). |

### 4.7 Opportunity Detail Page — Advancement

| Req ID | Requirement |
|--------|-------------|
| FR-48 | Clicking "Advance Stage" must validate all required fields for the current stage. |
| FR-49 | If validation fails, an error message must list the missing required fields. |
| FR-50 | If validation passes, the opportunity must move to the next stage. |
| FR-51 | The accordion must reorder to reflect the new current stage. |

### 4.8 Stage Requirements (Default Configuration)

| Stage Transition | Required Fields |
|------------------|-----------------|
| **Lead Backlog → Qualification** | Title, Contact, Product(s), Lead Origin, Office |
| **Qualification → Quotation** | All previous + Usage Description, Client Address (company or individual) |
| **Quotation → Closing** | All previous + At least one Accepted Quotation, Estimated Close Date, Client Payment Terms, Estimated Delivery (weeks), Incoterm, Type of Sale |
| **Closing → Won** | All previous + Client Purchase Order (file OR justification text), Manufacturer Payment Terms, Client Delivery Deadline, Manufacturer Delivery Deadline |
| **Any Stage → Lost** | Lost Reason (required) |

> **Note**: These are default requirements. Admins can modify via Stage Administration (Section 4.17).

### 4.9 Opportunity Fields — By Stage

#### Lead Backlog Stage

| Field | Type | Required |
|-------|------|----------|
| Title | Text | Yes |
| Contact | FK → Contacts | Yes |
| Company | FK → Companies | Auto (from Contact) |
| Products | Multi-select → Products | Yes (at least one) |
| Lead Origin | Dropdown | Yes |
| Office | Dropdown (TIA/TIC) | Yes |
| Owner | FK → Users | Yes (default: creator) |
| Notes | Text | No |

#### Qualification Stage

| Field | Type | Required |
|-------|------|----------|
| Usage Description | Text (multiline) | Yes |
| Client Address | Address Object | Yes (company or contact address) |

#### Quotation Stage

| Field | Type | Required |
|-------|------|----------|
| Quotations | Related Entity (see 4.11) | Yes (one accepted) |
| Estimated Close Date | Date | Yes |
| Client Payment Terms | FK → Payment Terms | Yes |
| Estimated Delivery (weeks) | Integer | Yes |
| Incoterm | FK → Incoterms | Yes |
| Type of Sale | Dropdown | Yes |
| Needs Peripherals | Boolean | No |
| Peripherals | Nested List (see 4.14) | Conditional |

#### Closing Stage

| Field | Type | Required |
|-------|------|----------|
| Client Purchase Order | File Upload | Yes (OR justification) |
| Purchase Order Justification | Text | Yes (OR file) |
| Manufacturer Payment Terms | FK → Payment Terms | Yes |
| Client Delivery Deadline | Date | Yes |
| Manufacturer Delivery Deadline | Date | Yes |

### 4.10 Opportunity Products (Pre-Quotation)

| Req ID | Requirement |
|--------|-------------|
| FR-52 | Before quotation stage, opportunity must have a **products list**. |
| FR-53 | Each opportunity product must store: product_id, quantity (default 1). |
| FR-54 | No pricing is stored at this level (pricing comes with quotation). |
| FR-55 | Users must be able to add, remove, and update quantities of products. |
| FR-56 | When creating a quotation, the system must **import** the opportunity products list. |

### 4.11 Quotations

| Req ID | Requirement |
|--------|-------------|
| FR-57 | Each opportunity can have **multiple quotations**. |
| FR-58 | Each quotation must have a **type**: "Direct Importation" or "Nationalized Sale". |
| FR-59 | Each quotation type can have **multiple versions** (revisions). |
| FR-60 | The system must display the **latest version** of each quotation type. |
| FR-61 | Previous versions must be accessible via a "Revision History" link. |
| FR-62 | Each quotation must have: quote_number (system-generated), version_number, type, status, currency, valid_until date. |
| FR-63 | Quotation statuses: Draft, Sent, Accepted, Rejected. |
| FR-64 | Only **one quotation** across all types can have status = "Accepted" at a time. |
| FR-65 | Marking a quotation as "Accepted" must prompt to reject other accepted quotations (if any). |

### 4.12 Quotation Line Items

| Req ID | Requirement |
|--------|-------------|
| FR-66 | Each quotation must have a **line items** table. |
| FR-67 | When creating a quotation, line items must be pre-populated from opportunity products. |
| FR-68 | Each line item must store: |
| | - Product (FK) |
| | - Quantity |
| | - Net Price (manufacturer cost) |
| | - Net Currency |
| | - Sales Price (to client) |
| | - Sales Currency |
| | - Unit Discount (percentage OR fixed amount) |
| | - Warranty Years (can override product default) |
| | - Estimated Delivery (weeks) |
| | - Includes Installation (boolean) |
| | - Includes Training (boolean) |
| | - Notes |
| FR-69 | The system must calculate line totals: `line_total = (sales_price - discount_amount) * quantity`. |
| FR-70 | The system must calculate quotation totals by summing line totals (grouped by currency). |
| FR-71 | Net totals and sales totals must be displayed separately. |

### 4.13 Quotation Workflow

| Req ID | Requirement |
|--------|-------------|
| FR-72 | Users must be able to create a new quotation from the opportunity detail page. |
| FR-73 | Creating a new quotation must prompt user to select type (Direct Importation or Nationalized Sale). |
| FR-74 | If a quotation of that type already exists, creating a new one must increment version number. |
| FR-75 | Users must be able to mark a quotation as "Sent" (records sent_at timestamp). |
| FR-76 | Users must be able to mark a quotation as "Accepted" or "Rejected". |
| FR-77 | Users must be able to duplicate a quotation (creates new version with same data). |

### 4.14 Peripherals Section

| Req ID | Requirement |
|--------|-------------|
| FR-78 | The Quotation stage must have a "Needs Peripherals" checkbox. |
| FR-79 | When checked, a **Peripherals** section must appear. |
| FR-80 | The Peripherals section must allow adding multiple items. |
| FR-81 | Each peripheral item must have: Name (text), Description (text). |
| FR-82 | Peripherals do not have pricing (tracked for procurement awareness only). |
| FR-83 | Peripherals must be editable until opportunity is Won. |

### 4.15 Type of Sale

| Req ID | Requirement |
|--------|-------------|
| FR-84 | Type of Sale must be a dropdown field. |
| FR-85 | Default options: "Direct Importation", "Nationalized Sale", "Commissioned Sale". |
| FR-86 | Type of Sale must be admin-configurable (add, edit, deactivate options). |
| FR-87 | Type of Sale is required at the Quotation → Closing transition. |

### 4.16 Lost Opportunity

| Req ID | Requirement |
|--------|-------------|
| FR-88 | Users must be able to mark an opportunity as "Lost" from any stage. |
| FR-89 | Marking as Lost must require selecting a **Lost Reason** from a dropdown. |
| FR-90 | Lost Reasons must be admin-configurable. |
| FR-91 | Default Lost Reasons: "Price", "Competition", "No Budget", "Timeline", "Scope Change", "No Response", "Other". |
| FR-92 | Lost opportunities must move to the "Lost" column in Kanban. |
| FR-93 | Lost opportunities must be filterable/viewable but clearly distinguished from active. |

### 4.17 Stage Administration

| Req ID | Requirement |
|--------|-------------|
| FR-94 | Admins must be able to access Stage Configuration in Settings. |
| FR-95 | Admins must be able to **add** new stages (specifying name, position, color). |
| FR-96 | Admins must be able to **edit** existing stage names and colors. |
| FR-97 | Admins must be able to **reorder** stages via drag-and-drop. |
| FR-98 | Admins must be able to **deactivate** stages (hidden from Kanban, existing opportunities remain). |
| FR-99 | System stages (Lead Backlog, Won, Lost) cannot be deleted but can be renamed. |
| FR-100 | For each stage, admins must be able to configure which **system fields** are required. |
| FR-101 | For each stage, admins must be able to configure which **custom fields** are required. |
| FR-102 | Admins must be able to add custom fields to opportunities (text, number, date, dropdown, checkbox). |
| FR-103 | Changes to stage configuration must take effect immediately for new stage transitions. |
| FR-104 | Existing opportunities in a stage are not affected by new required field additions. |

### 4.18 Lead Origin

| Req ID | Requirement |
|--------|-------------|
| FR-105 | Lead Origin must be a dropdown field. |
| FR-106 | Default options: "Website", "Referral", "Trade Show", "Cold Call", "Manufacturer", "Partner", "Other". |
| FR-107 | Lead Origin must be admin-configurable. |

### 4.19 Timeline (Left Column)

| Req ID | Requirement |
|--------|-------------|
| FR-108 | Timeline must show all field-level changes with old/new values. |
| FR-109 | Timeline must show stage transitions with timestamp and user. |
| FR-110 | Timeline must show when quotations were created, sent, accepted, or rejected. |
| FR-111 | Timeline must show activities: tasks, calls, emails, meetings linked to this opportunity. |
| FR-112 | Timeline must show when products were added or removed. |
| FR-113 | Timeline must be sorted newest-first by default. |
| FR-114 | Timeline entries must be expandable for detailed view. |

### 4.20 Related Entities Panel (Right Column)

| Req ID | Requirement |
|--------|-------------|
| FR-115 | Panel must show the primary **Contact** with name, email, phone. |
| FR-116 | Panel must show the **Company** (if applicable) with name and key detail. |
| FR-117 | Panel must show **Products** list with names and manufacturers. |
| FR-118 | Panel must show **Manufacturers** involved (derived from products). |
| FR-119 | Each related entity must be clickable to navigate to its detail page. |
| FR-120 | Panel must have quick actions: Change Contact, Add Product, Remove Product. |
| FR-121 | Panel must remain fixed/sticky when scrolling the center form. |

### 4.21 Files & Documents

| Req ID | Requirement |
|--------|-------------|
| FR-122 | Opportunity must have a **Files** section for attachments. |
| FR-123 | Users must be able to upload files (documents, images, PDFs). |
| FR-124 | Files must be categorized: General, Purchase Order, Quotation, Contract, Other. |
| FR-125 | Files must show: filename, upload date, uploaded by user. |
| FR-126 | The Client Purchase Order file (Closing stage) must also appear in the Files section. |

---

## 5. Non-Goals (Out of Scope)

| Item | Reason |
|------|--------|
| PDF quotation generation | Deferred to future iteration |
| Email integration (send quotation via email) | Future module |
| Revenue forecasting/reporting | Separate Reports module |
| Pipeline analytics dashboard | Separate Analytics module |
| Automated stage advancement | Manual advancement only for MVP |
| Commission calculation | Finances module scope |

---

## 6. Design Considerations

### 6.1 Kanban View Mockup

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  CRM  ›  Opportunities                    [Kanban ◉] [List ○]    [+ New Opportunity]   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🔍 Search...                              [Filters ▾]  [Owner: All ▾]  [Office: All ▾]│
├───────────────┬───────────────┬───────────────┬───────────────┬──────────┬─────────────┤
│ LEAD BACKLOG  │ QUALIFICATION │   QUOTATION   │    CLOSING    │   WON    │    LOST     │
│      (12)     │      (8)      │      (5)      │      (3)      │  [+47]   │    [+23]    │
├───────────────┼───────────────┼───────────────┼───────────────┼──────────┼─────────────┤
│ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │          │             │
│ │ Lab Equip │ │ │ Microscope│ │ │ Analyzer  │ │ │ Centrifuge│ │ Collapsed│  Collapsed  │
│ │ BioLab    │ │ │ UniResrch │ │ │ PharmaCo  │ │ │ LabCorp   │ │   Click  │    Click    │
│ │ R$50k/80k │ │ │ $12k/$18k │ │ │ $45k/$72k │ │ │ €30k/€48k │ │    to    │     to      │
│ │ 🔴 15 days│ │ │ 3 days    │ │ │ 7 days    │ │ │ 2 days    │ │  expand  │   expand    │
│ │ 👤 Maria  │ │ │ 👤 João   │ │ │ 👤 Maria  │ │ │ 👤 Carlos │ │          │             │
│ │ 📅 Dec 12 │ │ │           │ │ │ 📅 Dec 15 │ │ │ 📅 Dec 11 │ │          │             │
│ └───────────┘ │ └───────────┘ │ └───────────┘ │ └───────────┘ │          │             │
│ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │               │          │             │
│ │ Spect...  │ │ │ Flow Cyt..│ │ │ PCR Mach..│ │               │          │             │
│ │ ChemTech  │ │ │ Hosp Reg..│ │ │ BioStart  │ │               │          │             │
│ │ $8k/$12k  │ │ │ R$200k/...│ │ │ $25k/$38k │ │               │          │             │
│ └───────────┘ │ └───────────┘ │ └───────────┘ │               │          │             │
│     ...       │     ...       │               │               │          │             │
└───────────────┴───────────────┴───────────────┴───────────────┴──────────┴─────────────┘
```

### 6.2 Stage Advancement Modal (Kanban)

When dragging a card to next stage with missing fields:

```
┌─────────────────────────────────────────────────────┐
│  Advance to Quotation                          [✕]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Complete the following required fields:            │
│                                                     │
│  Usage Description *                                │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Client Address *                                   │
│  [Search address...                          ] [+]  │
│                                                     │
│                    [Cancel]  [Advance to Quotation] │
└─────────────────────────────────────────────────────┘
```

### 6.3 Opportunity Detail Page Mockup

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Pipeline        Lab Equipment Deal                    [Advance] [Lost] [•••] │
│                            Quotation Stage  •  15 days open  •  👤 Maria Santos          │
├──────────────────┬───────────────────────────────────────────────┬───────────────────────┤
│    TIMELINE      │                    FORM                       │   RELATED ENTITIES    │
│                  │                                               │                       │
│ ┌──────────────┐ │  ▼ QUOTATION (Current)           3/6 fields  │  ┌─ Contact ─────────┐│
│ │ Today, 10:15 │ │  ┌─────────────────────────────────────────┐  │  │ 👤 John Smith     ││
│ │ Quote v2 sent│ │  │ Quotations                              │  │  │ john@biolab.com   ││
│ │ by Maria     │ │  │ ┌─ Direct Import v2 ────────────────┐  │  │  │ +1 555-1234       ││
│ └──────────────┘ │  │ │ $45,200 / $72,500  •  Sent Dec 10 │  │  │  └───────────────────┘│
│                  │  │ │ [View] [Revise] [Mark Accepted]   │  │  │                       │
│ ┌──────────────┐ │  │ └───────────────────────────────────┘  │  │  ┌─ Company ─────────┐│
│ │ Dec 8, 14:30 │ │  │                                        │  │  │ 🏢 BioLab Inc     ││
│ │ Stage changed│ │  │ ┌─ Nationalized v1 ─────────────────┐  │  │  │ New York, USA     ││
│ │ Qual → Quote │ │  │ │ R$180k / R$290k  •  Draft         │  │  │  └───────────────────┘│
│ └──────────────┘ │  │ │ [View] [Revise] [Send]            │  │  │                       │
│                  │  │ └───────────────────────────────────┘  │  │  ┌─ Products (3) ────┐│
│ ┌──────────────┐ │  │                                        │  │  │ 📦 Analyzer X500  ││
│ │ Dec 7, 09:00 │ │  │ [+ Create Quotation]                   │  │  │    Manufacturer A ││
│ │ Usage desc   │ │  └─────────────────────────────────────────┘  │  │                   ││
│ │ added        │ │                                               │  │ 📦 Centrifuge Pro ││
│ └──────────────┘ │  Estimated Close Date *                       │  │    Manufacturer B ││
│                  │  [December 20, 2025            ] 📅           │  │                   ││
│ ┌──────────────┐ │                                               │  │ 📦 Accessories Kit││
│ │ Dec 5, 11:20 │ │  Client Payment Terms *                       │  │    Manufacturer A ││
│ │ Opportunity  │ │  [Net 30                            ▾]        │  │                   ││
│ │ created      │ │                                               │  │ [+ Add Product]   ││
│ └──────────────┘ │  Estimated Delivery (weeks) *                 │  └───────────────────┘│
│                  │  [8                                  ]        │                       │
│ [Show all...]    │                                               │  ┌─ Activities ─────┐│
│                  │  ▶ QUALIFICATION (Completed)         5/5 ✓   │  │ ○ Send quote      ││
│                  │                                               │  │   Due: Dec 12     ││
│                  │  ▶ LEAD BACKLOG (Completed)          5/5 ✓   │  │                   ││
│                  │                                               │  │ ✓ Intro call      ││
│                  │  ▶ CLOSING (Upcoming)                0/5     │  │   Dec 5           ││
│                  │                                               │  │ [+ Add activity]  ││
│                  │                                               │  └───────────────────┘│
├──────────────────┴───────────────────────────────────────────────┴───────────────────────┤
│   ~280px         │              Flexible                         │       ~300px          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Quotation Detail View

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Quotation: Direct Importation v2                                    [Edit] [Close] │
│  Quote #: QT-2025-00047  •  Status: Sent  •  Sent: Dec 10, 2025  •  Valid Until: Jan 10│
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  LINE ITEMS                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────┐ │
│  │ Product         │ Qty │ Net Price │ Sales Price │ Discount │ Delivery │ Total  │ │
│  ├─────────────────┼─────┼───────────┼─────────────┼──────────┼──────────┼────────┤ │
│  │ Analyzer X500   │  1  │ $30,000   │ $48,000     │ 5%       │ 8 weeks  │$45,600 │ │
│  │ ☑ Installation  │     │ USD       │ USD         │          │          │        │ │
│  │ ☑ Training      │     │           │             │          │          │        │ │
│  ├─────────────────┼─────┼───────────┼─────────────┼──────────┼──────────┼────────┤ │
│  │ Centrifuge Pro  │  2  │ $7,500    │ $12,000     │ -        │ 6 weeks  │$24,000 │ │
│  │ ☐ Installation  │     │ USD       │ USD         │          │          │        │ │
│  │ ☐ Training      │     │           │             │          │          │        │ │
│  ├─────────────────┼─────┼───────────┼─────────────┼──────────┼──────────┼────────┤ │
│  │ Accessories Kit │  1  │ $200      │ $500        │ -        │ 4 weeks  │ $500   │ │
│  └─────────────────┴─────┴───────────┴─────────────┴──────────┴──────────┴────────┘ │
│                                                                                     │
│  TOTALS                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────┐ │
│  │ Net Total:    $45,200 USD                                                     │ │
│  │ Sales Total:  $70,100 USD (before discount)                                   │ │
│  │ Discount:     -$2,280 USD                                                     │ │
│  │ Grand Total:  $72,500 USD                                                     │ │
│  └───────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  REVISION HISTORY                                                                   │
│  • v1 - Dec 5, 2025 - Draft - Created by Maria                                     │
│  • v2 - Dec 10, 2025 - Sent - Updated pricing, added discount                      │
│                                                                                     │
│                              [Mark as Accepted]  [Mark as Rejected]                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.5 Peripherals Section

```
┌─────────────────────────────────────────────────────────────────┐
│ ☑ Needs Peripherals                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PERIPHERALS                                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Name              │ Description                             ││
│  ├───────────────────┼─────────────────────────────────────────┤│
│  │ Desktop Computer  │ Windows 11 Pro, 16GB RAM, for analyzer  ││
│  │ UPS               │ 1500VA for power protection             ││
│  │ Power Adapter     │ 220V to 110V converter                  ││
│  └───────────────────┴─────────────────────────────────────────┘│
│                                                                 │
│  [+ Add Peripheral]                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Technical Considerations

### 7.1 Database Schema Notes

#### Opportunities Table (Core Fields)

```
opportunities
├── id (UUID, PK)
├── title (TEXT, NOT NULL)
├── contact_id (FK → contacts)
├── company_id (FK → companies, nullable)
├── stage_id (FK → pipeline_stages)
├── owner_id (FK → users)
├── office (ENUM: 'TIA', 'TIC')
├── lead_origin_id (FK → lead_origins)
├── type_of_sale_id (FK → sale_types, nullable)
├── usage_description (TEXT, nullable)
├── estimated_close_date (DATE, nullable)
├── client_payment_terms_id (FK → payment_terms, nullable)
├── estimated_delivery_weeks (INTEGER, nullable)
├── incoterm_id (FK → incoterms, nullable)
├── needs_peripherals (BOOLEAN, default false)
├── purchase_order_file_id (FK → documents, nullable)
├── purchase_order_justification (TEXT, nullable)
├── manufacturer_payment_terms_id (FK → payment_terms, nullable)
├── client_delivery_deadline (DATE, nullable)
├── manufacturer_delivery_deadline (DATE, nullable)
├── lost_reason_id (FK → lost_reasons, nullable)
├── lost_at (TIMESTAMP, nullable)
├── won_at (TIMESTAMP, nullable)
├── created_at, updated_at, created_by, updated_by (standard)
```

#### Related Tables

```
opportunity_products
├── id, opportunity_id, product_id, quantity

quotations
├── id, opportunity_id, type (ENUM), version_number
├── status (ENUM: draft, sent, accepted, rejected)
├── quote_number, currency, valid_until
├── sent_at, created_at, created_by

quotation_items
├── id, quotation_id, product_id, quantity
├── net_price, net_currency, sales_price, sales_currency
├── discount_percent, discount_amount, warranty_years
├── estimated_delivery_weeks
├── includes_installation, includes_training, notes

peripherals
├── id, opportunity_id, name, description

pipeline_stages
├── id, name, position, color, is_system, is_active

stage_field_requirements
├── id, stage_id, field_name, is_required, is_custom_field
```

### 7.2 Permission Integration

| Operation | Required Permission |
|-----------|-------------------|
| View opportunities | `crm.opportunities.view` |
| Create opportunity | `crm.opportunities.create` |
| Edit opportunity | `crm.opportunities.edit` |
| Delete opportunity | `crm.opportunities.delete` |
| Advance stage | `crm.opportunities.advance_stage` |
| Manage quotations | `crm.quotations.edit` |
| Configure stages (admin) | `crm.admin` |

### 7.3 Calculated Fields

| Field | Calculation |
|-------|-------------|
| Days Open | `current_date - created_at` |
| Days in Stage | `current_date - stage_changed_at` |
| Total Net Value | Sum of accepted quotation line item net values |
| Total Sales Value | Sum of accepted quotation line item sales values |
| Is Stale | `days_in_stage > stale_threshold` (configurable) |

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Opportunity CRUD | 100% functional | All operations work |
| Stage advancement validation | 100% accurate | Required fields enforced |
| Kanban drag-and-drop | Smooth UX | < 100ms response |
| Quotation versioning | Works correctly | Versions increment properly |
| Timeline accuracy | 100% | All changes logged |
| Admin stage configuration | Functional | Admins can modify stages |

---

## 9. Open Questions

| ID | Question | Impact | Proposed Answer |
|----|----------|--------|-----------------|
| OQ-01 | Should quotation line items support multiple currencies within same quote? | Medium | No — one currency per quotation, different currencies between quotation types |
| OQ-02 | Should there be a "Duplicate Opportunity" feature? | Low | Yes, add to "More Actions" menu |
| OQ-03 | Should won opportunities auto-create orders? | High | Covered in Order Management PRD |
| OQ-04 | Maximum file size for purchase order uploads? | Low | 10MB per file |
| OQ-05 | Should stale opportunity threshold be per-stage or global? | Low | Global for MVP, per-stage later |

---

## Appendix A: Quotation Type Matrix

| Quotation Type | Net Currency | Sales Currency | Typical Use Case |
|----------------|--------------|----------------|------------------|
| Direct Importation | USD/EUR | USD/EUR | Client imports directly, pays in foreign currency |
| Nationalized Sale | USD/EUR | BRL | TIA imports, nationalizes, sells in BRL |

Both types can coexist on the same opportunity when presenting options to the client.

---

## Appendix B: Stage Transition Diagram

```
                    ┌──────────────────────────────────────────────────────┐
                    │                                                      │
                    ▼                                                      │
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐ │
│ Lead Backlog │──▶│ Qualification│──▶│  Quotation   │──▶│   Closing    │─┼─▶ WON
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘ │
       │                  │                  │                  │         │
       │                  │                  │                  │         │
       └──────────────────┴──────────────────┴──────────────────┴─────────┴──▶ LOST
                                    (from any stage)
```

---

## Appendix C: Permission Codes Reference

```
crm.view                         - Access CRM module
crm.admin                        - Full admin access to CRM

crm.opportunities.view           - View opportunities
crm.opportunities.create         - Create opportunities
crm.opportunities.edit           - Edit opportunities
crm.opportunities.delete         - Delete opportunities
crm.opportunities.advance_stage  - Move opportunities between stages

crm.quotations.view              - View quotations
crm.quotations.create            - Create quotations
crm.quotations.edit              - Edit quotations
crm.quotations.delete            - Delete quotations
```

---

*End of PRD-04*
