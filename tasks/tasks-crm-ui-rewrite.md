# Tasks: CRM UI Rewrite (Clean Slate)

## Relevant Files
*   `src/features/crm/layouts/CRMLayout.tsx`
*   `src/features/crm/pages/CRMPage.tsx`
*   `src/features/crm/components/CRMHeader.tsx`
*   `src/features/crm/components/KanbanBoard.tsx`
*   `src/features/crm/components/OpportunityList.tsx`
*   `src/features/crm/pages/OpportunityDetail.tsx`

## Tasks



- [ ] 1.0 Implement Core CRM Layout & Routing (Strict Design System Compliance)
  - [x] 1.1 Refactor `CRMLayout.tsx`: Use `min-h-full flex flex-col`. Sticky Header with `px-6 pt-2 pb-1 bg-background z-10`. Content wrapper `flex-1`.
  - [x] 1.2 Implement `CRMHeader.tsx`: Responsive Flexbox layout. Top: Title, Toggles, "New Opportunity" (Right). Bottom: Filters.
  - [x] 1.3 Refactor `CRMPage.tsx`: `h-full flex flex-col p-8 space-y-6`. Ensure consistent usage of container padding.
  - [x] 1.4 Verify Route Configuration: Ensure `CRMLayout` is the parent of `CRMPage` and `OpportunityDetail`.

- [ ] 2.0 Implement Kanban View (Visual & Functional Overhaul)
  - [x] 2.1 Refactor `KanbanBoard.tsx`: Horizontal scroll container. Columns min-width 360px.
  - [x] 2.2 Update `KanbanColumn.tsx` visual style: Light gray background (`bg-secondary`), rounded header, clean count badges.
  - [x] 2.3 Refactor `KanbanCard.tsx`: White card (`bg-white`), `rounded-xl`, `shadow-sm`, `border-border-medium`.
  - [x] 2.4 Implement Card Content: Title, Company, Net/Sales Values, Days in Stage, Owner Avatar.
  - [ ] 2.5 Verify Drag and Drop constraints (Forward 1 step, Backward any step).

- [ ] 3.0 Implement List View Table (Design System Aligned)
  - [x] 3.1 Refactor `OpportunityList.tsx`: Use clean table design (Audit Data Table styles).
  - [x] 3.2 Configure Columns: Title, Company, Contact, Stage, Net Value, Sales Value, Days Open, Owner.
  - [x] 3.3 Implement Sorting and Filtering hooks.

- [ ] 4.0 Implement Opportunity Detail Page (3-Column Layout)
  - [x] 4.1 Refactor `OpportunityDetail.tsx` Structure: 3-Column Grid (`280px` Left, `flex-1` Center, `300px` Right).
  - [x] 4.2 Left Column (`ActivityTimeline.tsx`): Chronological feed, scrollable.
  - [x] 4.3 Center Column (`StageAccordion.tsx`): Current stage expanded by default. Accordion styling (Clean borders).
  - [x] 4.4 Right Column (`RelatedEntitiesPanel.tsx`): Fixed/Sticky position. Contact, Company, Products summary.
  - [x] 4.5 Header Actions: "Advance Stage", "Lost", "More" buttons in `OpportunityDetail` header.

- [ ] 5.0 Final Polish & Responsive Verification
  - [ ] 5.1 Verify Mobile/Tablet responsiveness (Columns stacking, Sidebar drawer).
  - [ ] 5.2 Verify "New Opportunity" button visibility on all screen sizes.
  - [ ] 5.3 Conduct "Reload Test": Verify no layout shifts on page refresh.
