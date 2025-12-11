# Tasks: CRM Layout Revamp

## Relevant Files
*   `src/features/crm/layouts/CRMLayout.tsx`
*   `src/features/crm/pages/CRMPage.tsx`
*   `src/features/crm/components/CRMHeader.tsx`
*   `src/features/database/components/layout/DatabaseLayout.tsx` (Reference)

## Tasks



- [x] 1.0 Analyze and Replicate Clipping Issues
  - [x] 1.1 Analyze `CRMHeader.tsx` for fixed width or overflow constraints preventing the "New Opportunity" button from being seen.
  - [x] 1.2 Check `MainLayout` + `CRMLayout` interactions when Sidebar is expanded to see if it reduces viewport width below minimum content width.

- [x] 2.0 Structural Alignment with Database Module
  - [x] 2.1 Verify `CRMLayout.tsx` uses `min-h-full`, `sticky top-0`, and `px-6` padding (matching `DatabaseLayout`).
  - [x] 2.2 Verify `CRMPage.tsx` uses `p-8` padding on the main container (matching `ViewContainer`).
  - [x] 2.3 Ensure `CRMPage` container does not have `overflow-hidden` that might clip the header or button inappropriately.

- [x] 3.0 Fix CRMHeader Responsiveness and Width Constraints
  - [x] 3.1 Update `CRMHeader.tsx` to use `flex-wrap` on the top row to prevent button clipping on smaller screens.
  - [x] 3.2 Add responsive constraints to title/description to allow shrinking.
  - [x] 3.3 Ensure "New Opportunity" button stays visible or wraps correctly.

- [x] 4.0 Resolve Loading Flash and Stability
  - [x] 4.1 Refactor `CRMPage.tsx` to **always** render the main container (with `p-8`) and `CRMHeader` regardless of loading state.
  - [x] 4.2 Move the `isLoading` check to *only* replace the Kanban/List content area, preserving the page frame.
  - [x] 4.3 Verify that the layout metrics (Header position, Content start position) are identical in Loading vs Loaded states.

- [ ] 5.0 Final Verification and Cleanup
  - [ ] 5.1 Verify alignment with Database module (Screenshots/Visual Check).
  - [ ] 5.2 Verify "New Opportunity" button visibility in normal and full screen.
  - [ ] 5.3 Verify no layout shift occurs when refreshing the page.
