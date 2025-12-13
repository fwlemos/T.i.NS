# PRD: Quotation Module

## 1. Introduction/Overview

The Quotation Module enables Tennessine sales representatives to create, manage, and generate professional commercial proposals (quotations) for clients. This module integrates with existing CRM entities (Contacts, Companies, Products, Manufacturers, Opportunities) to streamline the quotation process and produce PDF documents that match Tennessine's established commercial proposal format.

The module supports two distinct sale types reflecting Tennessine's dual-entity structure:
- **Direct Importation (TIC - USA)**: Quotations in USD or EUR
- **Nationalized (TIA - Brazil)**: Quotations in BRL

### Problem Statement

Currently, quotations are created manually outside of the ERP system, leading to:
- Inconsistent formatting across sales representatives
- Manual data entry errors when copying product information
- No centralized tracking of quotation history and versions
- Difficulty linking quotations to CRM opportunities
- Time-consuming process to generate professional proposals

### Goal

Provide an integrated quotation management system that automates proposal generation, maintains version history, and seamlessly connects with the CRM pipeline while producing professional PDF outputs matching Tennessine's brand standards.

---

## 2. Goals

1. **Streamline Quotation Creation**: Reduce time to create a quotation by auto-populating data from existing database entities (Contacts, Companies, Products, Manufacturers)
2. **Ensure Professional Output**: Generate PDF quotations that replicate the established Tennessine commercial proposal format
3. **Enable Version Control**: Allow users to create and track quotation versions for audit trails and client negotiations
4. **Integrate with CRM Pipeline**: Automatically update Opportunity status when quotations are accepted
5. **Support Multi-Currency Operations**: Handle BRL (TIA) and USD/EUR (TIC) quotations based on sale type
6. **Centralize Quotation Management**: Provide a single source of truth for all commercial proposals with status tracking

---

## 3. User Stories

### Quotation Creation
- **US-Q01**: As a sales representative, I want to create a new quotation by selecting an existing Contact so that client information is auto-populated.
- **US-Q02**: As a sales representative, I want to add Products from the database to my quotation so that technical descriptions and base pricing are auto-populated.
- **US-Q03**: As a sales representative, I want to edit auto-populated product descriptions within the quotation so that I can customize technical details for specific client needs.
- **US-Q04**: As a sales representative, I want to mark certain line items as "Included" so that they appear in the quotation without adding to the total price.
- **US-Q05**: As a sales representative, I want to apply discounts to individual line items or the total so that I can offer competitive pricing.
- **US-Q06**: As a sales representative, I want to link a quotation to an existing Opportunity so that the CRM pipeline reflects quotation activity.

### Quotation Management
- **US-Q07**: As a sales representative, I want to create a new version of an existing quotation so that I can track major revisions while preserving history.
- **US-Q08**: As a sales representative, I want to view all versions of a quotation so that I can reference previous proposals during negotiations.
- **US-Q09**: As a sales representative, I want to change the status of a quotation (Draft, Sent, Accepted, Rejected, Expired) so that I can track its lifecycle.
- **US-Q10**: As a sales representative, I want the system to automatically move the linked Opportunity to "Closing" stage when I mark a quotation as "Accepted".

### PDF Generation
- **US-Q11**: As a sales representative, I want to generate a PDF of my quotation so that I can send it to the client via email.
- **US-Q12**: As a sales representative, I want the PDF to include all commercial conditions, line items, technical descriptions, and terms & conditions in Tennessine's branded format.

### Terms & Conditions
- **US-Q13**: As a sales representative, I want to select from pre-defined Terms & Conditions templates so that appropriate legal text is included.
- **US-Q14**: As a sales representative, I want to edit specific sections of the Terms & Conditions for a particular quotation so that I can accommodate special client requirements.

---

## 4. Functional Requirements

### 4.1 Quotation Creation

| ID | Requirement |
|----|-------------|
| FR-Q01 | The system must allow users to create a new quotation by selecting a sale type: "Direct Importation" (TIC) or "Nationalized" (TIA) |
| FR-Q02 | Based on sale type, the system must set available currencies: USD/EUR for Direct Importation, BRL for Nationalized |
| FR-Q03 | The system must generate a unique quotation number following the format: `[UserInitials]TS_NNMM-YY` where NN = user's sequential quotation count for the month, MM = month (01-12), YY = year |
| FR-Q04 | The system must allow selection of a Contact from the database; if the Contact belongs to a Company, the Company information must be auto-populated |
| FR-Q05 | The system must allow adding a "Client Reference" field for optional client PO or reference numbers |
| FR-Q06 | The system must allow linking the quotation to an existing Opportunity |
| FR-Q07 | The system must allow users to enter validity period in days (default: 30) and auto-calculate the expiration date |

### 4.2 Commercial Conditions

| ID | Requirement |
|----|-------------|
| FR-Q08 | The system must capture the following commercial conditions: Validity Date (calculated), Currency, Payment Terms, Estimated Dispatch Time, Warranty Period, Manufacturer(s), Delivery Location/Incoterm |
| FR-Q09 | Payment Terms must be a selectable field with common options (e.g., "Adiantado/Advance", "30 days", "60 days", "Upon Delivery") plus custom text option |
| FR-Q10 | Warranty Period must be selectable (e.g., 12 months, 24 months, 36 months) plus custom option |
| FR-Q11 | Delivery Location/Incoterm must be selectable from standard Incoterms (CIF, FOB, EXW, etc.) |

### 4.3 Line Items

| ID | Requirement |
|----|-------------|
| FR-Q12 | The system must allow adding Products from the database as line items |
| FR-Q13 | When a Product is added, the system must auto-populate: Part Number (P/N), Product Name, Technical Description, Manufacturer |
| FR-Q14 | The system must allow editing the auto-populated Product Name and Technical Description within the quotation without affecting the source Product record |
| FR-Q15 | Each line item must have: Item Number (auto-sequential), Product/Description, Quantity, Unit Price, Total Price |
| FR-Q16 | The system must allow marking any line item as "Included" which displays "Incluso/Included" instead of a price and excludes it from the total calculation |
| FR-Q17 | The system must allow applying a discount to individual line items (percentage or fixed amount) |
| FR-Q18 | The system must allow applying a global discount to the quotation total (percentage or fixed amount) |
| FR-Q19 | The system must automatically calculate line item totals (Quantity × Unit Price - Discount) and the quotation grand total |
| FR-Q20 | The system must allow manual entry of line items not in the Product database (custom items) |
| FR-Q21 | The system must allow reordering line items via drag-and-drop |

### 4.4 Additional Information

| ID | Requirement |
|----|-------------|
| FR-Q22 | The system must provide an "Additional Information" section for free-text notes (e.g., "Includes: Installation, Training, Computer") |
| FR-Q23 | The system must auto-populate banking information based on the selected entity (TIA or TIC) |
| FR-Q24 | The system must auto-populate contact information for the sales representative creating the quotation |

### 4.5 Terms & Conditions

| ID | Requirement |
|----|-------------|
| FR-Q25 | The system must provide pre-defined Terms & Conditions templates (minimum: Standard TIA, Standard TIC) |
| FR-Q26 | The system must allow administrators to create and manage Terms & Conditions templates |
| FR-Q27 | When a template is selected, the system must copy its content to the quotation, allowing per-quotation edits |
| FR-Q28 | Edits to Terms & Conditions on a quotation must not affect the source template |

### 4.6 Version Control

| ID | Requirement |
|----|-------------|
| FR-Q29 | The system must allow users to manually create a new version of a quotation |
| FR-Q30 | When a new version is created, the system must increment the version number (e.g., Ver.1 → Ver.2) and preserve the previous version as read-only |
| FR-Q31 | The system must display version history with: Version Number, Created Date, Created By, and ability to view/download each version's PDF |
| FR-Q32 | The quotation number must remain constant across versions; only the version suffix changes |

### 4.7 Status Management

| ID | Requirement |
|----|-------------|
| FR-Q33 | The system must support the following quotation statuses: Draft, Sent, Accepted, Rejected, Expired |
| FR-Q34 | New quotations must be created with "Draft" status |
| FR-Q35 | Only quotations in "Draft" status can be edited; other statuses are read-only (new version required for changes) |
| FR-Q36 | When status changes to "Accepted" and the quotation is linked to an Opportunity, the system must automatically move the Opportunity to "Closing" stage |
| FR-Q37 | The system must automatically change status to "Expired" when the validity date passes (for quotations in "Draft" or "Sent" status) |

### 4.8 PDF Generation

| ID | Requirement |
|----|-------------|
| FR-Q38 | The system must generate a PDF matching the Tennessine commercial proposal format |
| FR-Q39 | The PDF must include: Header (logo, company info), Quotation metadata, Commercial conditions, Line items table, Technical descriptions, Additional information, Banking/contact info, Terms & conditions, Signature area |
| FR-Q40 | The PDF must use the appropriate entity branding (TIA or TIC) based on sale type |
| FR-Q41 | The system must allow downloading the PDF |
| FR-Q42 | The system must store generated PDFs for historical reference |

### 4.9 Quotation List & Search

| ID | Requirement |
|----|-------------|
| FR-Q43 | The system must provide a list view of all quotations with columns: Quotation Number, Version, Client (Contact/Company), Total Value, Currency, Status, Created Date, Expiration Date |
| FR-Q44 | The system must allow filtering quotations by: Status, Sale Type, Date Range, Created By, Client |
| FR-Q45 | The system must allow searching quotations by: Quotation Number, Client Name, Product Name |

---

## 5. Non-Goals (Out of Scope)

The following items are explicitly **not** included in this module for the MVP:

1. **Email Integration**: Sending quotations directly from the system (users will download PDF and send via external email)
2. **E-Signature**: Digital signature capture or integration with e-signature platforms
3. **Approval Workflow**: Internal approval process before quotations can be sent (all users can create and send)
4. **Template Editor**: Drag-and-drop PDF template customization (fixed layout for MVP)
5. **Automated Follow-ups**: Reminder notifications for expiring quotations
6. **Client Portal**: External access for clients to view/accept quotations online
7. **Multi-Language**: Dynamic language switching for quotation content (Portuguese and English can be handled via different templates)
8. **Inventory Check**: Real-time stock availability validation when adding products
9. **Profit Margin Calculation**: Cost/margin analysis on quotations
10. **Conversion to Order**: Automatic order creation from accepted quotations (future Order Management module)

---

## 6. Design Considerations

### 6.1 UI Layout

The Quotation detail page should follow the established three-column layout pattern:

| Left Column | Center Column | Right Column |
|-------------|---------------|--------------|
| Timeline/Activity | Quotation Form | Related Entities |
| - Version history | - Header info | - Contact card |
| - Status changes | - Commercial conditions | - Company card |
| - Comments | - Line items table | - Opportunity card |
| | - Technical descriptions | - Products list |
| | - Additional info | - Manufacturer(s) |
| | - Terms & conditions | |

### 6.2 Visual Design

- Follow the established minimalist Korean ERP aesthetic with generous whitespace
- Status badges with distinct colors: Draft (gray), Sent (blue), Accepted (green), Rejected (red), Expired (orange)
- Line items table should support inline editing
- "Included" items should be visually differentiated (e.g., italic text, different background)
- Discount fields should appear conditionally when discount is applied

### 6.3 PDF Layout

The PDF should replicate the attached Tennessine commercial proposal format:

1. **Header**: Orange banner with company name, logo, address, CNPJ
2. **Metadata Table**: Quotation number, client reference, date, recipient info
3. **Commercial Conditions Box**: Two-column layout with validity, currency, payment terms, dispatch time, warranty, manufacturer, delivery location
4. **Line Items Table**: Columns for #, Item (P/N + Description), Qty, Unit Price, Total
5. **Technical Descriptions**: Numbered sections matching line items with full specifications
6. **Additional Information Box**: Included services, notes
7. **Banking & Contact Info**: Two-column footer with bank details and sales contacts
8. **Terms & Conditions**: Full legal text (General Sales Contract)
9. **Signature Area**: Acceptance line for client signature

---

## 7. Technical Considerations

### 7.1 Database Schema (Key Entities)

**Quotation**
- id, quotation_number, version, sale_type (enum: direct_importation, nationalized)
- contact_id (FK), company_id (FK), opportunity_id (FK), created_by (FK)
- client_reference, currency, validity_days, expiration_date
- payment_terms, dispatch_time, warranty_period, incoterm
- additional_info, terms_conditions_id (FK), terms_conditions_text
- subtotal, discount_type, discount_value, total
- status (enum: draft, sent, accepted, rejected, expired)
- created_at, updated_at

**QuotationLineItem**
- id, quotation_id (FK), item_number, product_id (FK nullable)
- part_number, description, technical_description
- quantity, unit_price, is_included, discount_type, discount_value, total
- sort_order

**QuotationVersion**
- id, quotation_id (FK), version_number, pdf_url
- created_by (FK), created_at, snapshot (JSON of quotation state)

**TermsConditionsTemplate**
- id, name, entity (TIA/TIC), content, is_default
- created_at, updated_at

### 7.2 Integration Points

- **Contacts Module**: Fetch contact and associated company data
- **Products Module**: Fetch product details, P/N, technical descriptions
- **Manufacturers Module**: Associate products with manufacturers
- **Opportunities Module**: Link quotations, update opportunity status on acceptance
- **Users Module**: Track created_by, fetch user initials for quotation numbering

### 7.3 PDF Generation

- Use a server-side PDF generation library (e.g., Puppeteer with HTML template, or dedicated PDF library)
- Store generated PDFs in cloud storage (Supabase Storage)
- Consider caching/regenerating PDFs only when quotation content changes

### 7.4 Quotation Number Generation

The system must track:
- User's quotation count per month (for NN portion)
- Reset count at the start of each month
- Handle concurrent creation to avoid duplicate numbers (use database sequence or locking)

---

## 8. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Quotation Creation Time | < 10 minutes for standard quotation | Time tracking from create to first PDF generation |
| User Adoption | 100% of quotations created in system within 3 months | Count of quotations created vs. external quotations |
| Data Accuracy | < 2% of quotations require manual correction of auto-populated data | User-reported corrections |
| Version Utilization | Average 1.5 versions per won quotation | Version count on accepted quotations |
| CRM Integration | 95% of quotations linked to opportunities | Quotations with opportunity_id vs. total |

---

## 9. Open Questions

1. **Banking Information**: Should banking details be configurable in system settings, or hardcoded per entity? (Recommendation: Configurable in admin settings)

2. **User Initials**: How should user initials be determined - from user profile fields, or manually configured? What happens with duplicate initials?

3. **Product Bundles**: Should the system support pre-defined product bundles that can be added as a group to quotations?

4. **Quotation Duplication**: Should users be able to duplicate an existing quotation as a starting point for a new one (for different client)?

5. **Audit Trail**: Beyond version history, should the system log all field-level changes within a draft quotation?

6. **PDF Storage Retention**: How long should generated PDFs be retained? Should old versions be archived or permanently stored?

7. **Currency Exchange**: For reporting purposes, should the system capture exchange rates at quotation creation for value normalization?

8. **Contact without Company**: The PDF shows individual contact with CPF. Should the system support quotations to individuals (not associated with a company)?

---

## Appendix A: Quotation Number Examples

| User | Month | Sequence | Full Number |
|------|-------|----------|-------------|
| Olivalter Pergentino | July 2023 | 1st | OPTS_0107-23 |
| Olivalter Pergentino | July 2023 | 2nd | OPTS_0207-23 |
| Tiago Renovato | July 2023 | 1st | TRTS_0107-23 |
| Abel Folego | December 2024 | 15th | AFTS_1512-24 |

## Appendix B: Status Transition Rules

```
Draft → Sent (user action)
Draft → Expired (automatic, when validity date passes)
Sent → Accepted (user action) → triggers Opportunity update
Sent → Rejected (user action)
Sent → Expired (automatic, when validity date passes)
```

Note: Accepted, Rejected, and Expired are terminal states. To make changes, user must create a new version (which resets to Draft status).
