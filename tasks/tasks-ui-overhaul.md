# Task List: UI Design System Overhaul & Premium Aesthetic

## Relevant Files

- `src/styles/globals.css` - Global CSS variables for colors, radius, and shadows.
- `tailwind.config.js` - Configuration for colors, fonts, and theme extensions.
- `src/components/layout/MainLayout.tsx` - Structure of the sidebar + main content relationship.
- `src/components/layout/Sidebar.tsx` - Styling for the collapsible sidebar.
- `src/components/ui/` - Core UI components to refactor (`Button.tsx`, `Card.tsx`, `Table.tsx`, `Input.tsx`).
- `src/features/auth/components/LoginForm.tsx` - Specific styling update for the login page.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/ui-overhaul`)

- [ ] 1.0 Design System Configuration
  - [x] 1.1 Update `src/styles/globals.css`:
    - [x] Define CSS variables for monochromatic palette (`--bg-primary`, `--text-primary`, etc.).
    - [x] Define radius variables (`--radius-sm`, `--radius-xl`, etc.).
    - [x] Define shadow variables (`--shadow-xs`, `--shadow-lg`).
  - [x] 1.2 Update `tailwind.config.js`:
    - [x] Extend theme with new color tokens.
    - [x] Map border radius and box shadow tokens.
    - [x] Configure `fontFamily` to use Inter.
  - [x] 1.3 Audit and remove legacy/unused design tokens.

- [x] 2.0 Layout Overhaul
  - [x] 2.1 Refactor `MainLayout.tsx`:
    - [x] Implement the "Floating Panel" effect (main content container with rounded top-left).
    - [x] Add subtle shadow overlap with sidebar.
    - [x] Ensure background color distinction (`#F3F4F6` for app bg, `#FFFFFF` for content).
  - [x] 2.2 Update `Sidebar.tsx`:
    - [x] Set correct width (240px expanded / 64px collapsed).
    - [x] Style navigation items (padding, hover effects, active state with indicator).
    - [x] Implement smooth collapse transition.
  - [x] 2.3 Update `Header.tsx`:
    - [x] Blend with Main Content background (white).
    - [x] Style Theme Toggle and User Avatar to be subtle.

- [x] 3.0 Component Refinement
  - [x] 3.1 Refactor `Button.tsx`:
    - [x] Update `default` variant (Black bg, White text, rounded-lg).
    - [x] Update `outline` variant (White bg, Border, rounded-lg).
    - [x] Update `ghost` variant.
  - [x] 3.2 Refactor `Card.tsx`:
    - [x] Increase padding defaults (p-6).
    - [x] Reduce border intensity (subtle gray).
    - [x] Apply `rounded-xl`.
  - [x] 3.3 Refactor `Input.tsx`:
    - [x] Increase height (h-10 or h-11).
    - [x] Update focus ring style (`ring-gray-900/10`).
  - [x] 3.4 Refactor `Table.tsx`:
    - [x] Remove vertical borders.
    - [x] Style headers (uppercase, small font, gray background).
    - [x] Increase row height and padding.

- [x] 4.0 Feature Specific Styling
  - [x] 4.1 Redesign `LoginForm.tsx`:
    - [x] Center card on screen with proper background.
    - [x] Apply new Button and Input styles.
    - [x] Add "Welcome" typography and branding.
  - [x] 4.2 Verify and adjust `AdminPage` layouts:
    - [x] Ensure PermissionGates don't break layout flow.
    - [x] Verify `Table` usage in `UserList` and `RoleList`.

- [ ] 5.0 Verification & Cleanup
  - [ ] 5.1 Verify responsive behavior (Sidebar becomes drawer on mobile).
  - [ ] 5.2 Verify Dark Mode consistency (ensure no unreadable text/bg combinations).
  - [ ] 5.3 Run `npm run build` to ensure no CSS/Tailwind errors.
