## Relevant Files

- `src/features/crm/layouts/CRMLayout.tsx` - Layout file handling the main visual structure.
- `src/features/crm/hooks/useOpportunities.ts` - Main data fetching hook to be optimized.
- `src/features/crm/hooks/useCRMOptions.ts` - Options fetching hook to be optimized.
- `src/features/crm/components/KanbanBoard.tsx` - Kanban UI component.
- `src/features/crm/pages/CRMPage.tsx` - Main CRM Page entry point.
- `src/features/crm/pages/OpportunityDetail.tsx` - Detail view component.
- `PRDs/tims-design-system.md` - Design Reference.

### Notes

- The current implementation is Dark Mode heavy. The goal is to switch to a "White Panel" aesthetic on a Gray background, consistent with the rest of the application.
- Performance issues (10s+ load) are likely due to inefficient data fetching (Waterfall or problematic Joins) or timeout on `auth.users` join.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Update the file after completing each sub-task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch `feature/crm-revamp`

- [x] 1.0 Performance Analysis & Optimization
  - [x] 1.1 Modify `useOpportunities` to temporarily remove `owner_profile` join to identify if it's the bottleneck.
  - [x] 1.2 If bottleneck confirmed, refactor to use `profiles` table join or fetch owners separately.
  - [x] 1.3 Implement `isLoading` state handling in `CRMPage` to show a skeleton instead of a blank screen.
  - [x] 1.4 Verify initial load time is under 2 seconds.

- [x] 2.0 Refactor CRM Design System (Layout)
  - [x] 2.1 Navigate to `src/features/crm/layouts/CRMLayout.tsx` and implement the "White Panel" design:
    - Page Background: `#F3F4F6`
    - Main Content: `bg-white rounded-tl-[32px] ml-4 mt-4 shadow-sm min-h-[calc(100vh-20px)]`
  - [x] 2.2 Update `CRMHeader` to sit comfortably within the new white panel (remove dark mode overrides).
  - [x] 2.3 Update `Sidebar` link (if needed) to ensure it triggers the layout correctly (already done but verify).

- [x] 3.0 Refactor Opportunity Views (Kanban & List)
  - [x] 3.1 Refactor `KanbanBoard` columns:
    - Background: Transparent or very subtle gray (`bg-gray-50`).
    - Headers: Dark text (`text-gray-900`), clean typography.
  - [x] 3.2 Refactor `KanbanCard`:
    - Container: `bg-white border border-gray-200 rounded-xl p-4 shadow-sm`.
    - Hover: `border-gray-300 shadow-md`.
    - Text: Dark primary, gray secondary.
  - [x] 3.3 Refactor `OpportunityList`:
    - Use standard `DataTable` (which should be light-mode friendly).
    - Ensure headers are light gray, text is dark.

- [x] 4.0 Refactor Opportunity Detail View
  - [x] 4.1 Refactor `OpportunityDetail.tsx`:
    - Remove `bg-[#121212]` and other dark overrides.
    - Implement 3-column layout with light borders (`border-gray-200`).
  - [x] 4.2 Refactor `StageAccordion`:
    - Completed Stages: Green/Checked.
    - Current Stage: White background with active border.
    - Future Stages: Gray/Muted.
  - [x] 4.3 Refactor `ActivityTimeline` and `RelatedEntitiesPanel` to match the light theme.
