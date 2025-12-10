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
  - [ ] 1.1 Update `src/styles/globals.css` with specific monochromatic color tokens from PRD.
  - [ ] 1.2 Update `tailwind.config.js` to map tokens to Tailwind utility classes.
  - [ ] 1.3 Configure Typography (Inter) and font weights in `globals.css` / config.
  - [ ] 1.4 Define new radius and shadow variables.
- [ ] 2.0 Layout Overhaul
  - [ ] 2.1 Refactor `MainLayout` to implement the "Floating Panel" design (rounded top-left, shadow).
  - [ ] 2.2 Update `Sidebar` styling (width, colors, item hover states, collapse animation).
  - [ ] 2.3 Update `Header` to blend seamlessly or contrast as per design spec.
- [ ] 3.0 Component Refinement
  - [ ] 3.1 Update `Button` variants (Primary = Black, Secondary = White w/ Border, Ghost).
  - [ ] 3.2 Update `Card` component (padding, borders, hover effects).
  - [ ] 3.3 Update `Input` fields (height, focus rings, border colors).
  - [ ] 3.4 Update `Table` styling (clean lines, header background, cell padding).
- [ ] 4.0 Feature Specific Styling
  - [ ] 4.1 Redesign `LoginForm` to match the wireframe/aesthetic (centered, clean).
  - [ ] 4.2 Verify Admin Page tables match new Table styling.
- [ ] 5.0 Verification
  - [ ] 5.1 Verify responsive behavior (Mobile drawer vs Desktop sidebar).
  - [ ] 5.2 Verify Dark Mode compatibility for all new tokens.
