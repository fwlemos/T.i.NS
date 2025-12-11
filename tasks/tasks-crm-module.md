## Relevant Files

- `src/features/crm/components/KanbanBoard.tsx` - Main board component for visual pipeline.
- `src/features/crm/components/OpportunityForm.tsx` - Form for creating/editing opportunities.
- `src/features/crm/pages/OpportunityDetail.tsx` - The central view for managing a specific deal.
- `src/features/crm/components/StageAccordion.tsx` - Core component for handling stage-specific fields.
- `src/features/crm/components/QuotationEditor.tsx` - Complex component for managing quote line items and versions.
- `supabase/migrations/[timestamp]_crm_schema.sql` - Database definitions for the entire module.

### Notes

- This is a large module. Focus on getting the data structure right (Task 1.0) before building the UI.
- The `StageAccordion` (Task 4.0) is the most complex UI component due to dynamic field requirements.
- Quotation logic (Task 5.0) requires careful calculation handling for multi-currency support.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/crm-module`)

- [x] 1.0 CRM Database Implementation (Schema & Types)
  - [x] 1.1 Create migration for Lookup Tables (`lead_origins`, `sale_types`, `lost_reasons`) with initial seed data.
  - [x] 1.2 Create migration for `pipeline_stages` and `stage_field_requirements`.
  - [x] 1.3 Create migration for `opportunities` table with all FKs and core fields.
  - [x] 1.4 Create migration for `opportunity_products` and `peripherals`.
  - [x] 1.5 Create migration for `quotations` and `quotation_items`.
  - [x] 1.6 Apply RLS policies for all new CRM tables (View/Create/Edit/Delete permissions).
  - [x] 1.7 Generate/Update TypeScript types (`src/lib/supabase/types.ts`) to reflect new schema.

- [x] 2.0 CRM Module Layout & Navigation
  - [x] 2.1 Create `CRMLayout` component with sub-navigation (Pipeline, Settings).
  - [x] 2.2 Update global `Sidebar` to link `/crm` to the new layout.
  - [x] 2.3 Create placeholder pages: `CRMPage` (Pipeline), `CRMSettingsPage`.
  - [x] 2.4 Configure React Router to handle `/crm` routes.

- [ ] 3.0 Opportunity Management (Kanban & List Views)
  - [x] 3.1 Create `CRMView` header with View Toggle (Kanban/List) and Filters.
  - [x] 3.2 Implement `KanbanColumn` component (Scrollable, draggable area).
  - [x] 3.3 Implement `KanbanCard` component (Display Title, Value, Stage Age, Owner, Stale Indicator).
  - [x] 3.4 Implement `KanbanBoard` utilizing `dnd-kit` or similar for moving cards between stages.
  - [x] 3.5 Implement `OpportunityList` table view as an alternative to Kanban.
  - [x] 3.6 Implement `NewOpportunityDrawer` (FR-30: Title, Contact, Product, Origin).
  - [x] 3.7 Connect Views to Supabase to fetch and display real opportunities.

- [x] 4.0 Opportunity Detail & Stage Internal Logic
  - [x] 4.1 Scaffold `OpportunityDetail.tsx` with 3-Column Layout.
  - [x] 4.2 Implement `ActivityTimeline` (Left Column) functionality for CRM specific events.
  - [x] 4.3 Implement `RelatedEntitiesPanel` (Right Column) showing Contact/Company/Products.
  - [x] 4.4 Implement `StageAccordion` (Center Column) - Render stages, handle "current" expansion.
  - [x] 4.5 Implement "Advance Stage" logic - Validate required fields for current stage before moving.
  - [x] 4.6 Implement "Mark as Lost" modal with Reason selection.
  - [x] 4.7 Wire up "Lost" status updates to database.

- [ ] 5.0 Quotation System Implementation
  - [ ] 5.1 Create `QuotationList` component to display within Opportunity Detail (Quote Stage).
  - [ ] 5.2 Implement `QuotationBuilder` - Header inputs (Payment terms, Incoterm, Dates).
  - [ ] 5.3 Implement `LineItemsEditor` - Add products from Opportunity, calculate Totals (Net vs Sales).
  - [ ] 5.4 Implement "Create Version" logic (Direct Import vs Nationalized).
  - [ ] 5.5 Implement Status Actions (Mark Sent, Mark Accepted, Reject Others).
  - [ ] 5.6 Implement `Peripherals` section (Add/Remove items).

- [ ] 6.0 CRM Administration (Stages & Fields)
  - [ ] 6.1 Create `StageManager` component - Drag-and-drop ordering, Edit Names/Colors.
  - [ ] 6.2 Implement `StageFieldConfig` - Toggle required system fields, Add custom fields.
  - [ ] 6.3 Implement Editors for `LeadOrigins` and `LostReasons`.
