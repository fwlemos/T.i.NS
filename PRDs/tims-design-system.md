# TIMS Design System Specification

## Design Philosophy

The TIMS interface follows a **minimalist monochromatic aesthetic** inspired by modern Korean ERP systems. The design prioritizes clarity, breathing room, and professional elegance through generous whitespace, soft geometry, and restrained color usage.

---

## Core Visual Principles

### 1. Color Palette

**Primary Colors (Monochromatic Base)**
- `--bg-primary`: `#FFFFFF` — Main background
- `--bg-secondary`: `#F8F9FA` or `#FAFAFA` — Subtle section backgrounds
- `--bg-tertiary`: `#F3F4F6` — Hover states, subtle dividers
- `--text-primary`: `#111111` or `#1A1A1A` — Headlines, primary text
- `--text-secondary`: `#6B7280` or `#71717A` — Secondary text, labels
- `--text-muted`: `#9CA3AF` — Placeholder text, disabled states
- `--border-light`: `#E5E7EB` — Subtle borders, dividers
- `--border-medium`: `#D1D5DB` — Input borders, card outlines

**Accent Colors (Sparingly Used)**
- `--accent-positive`: `#10B981` or `#22C55E` — Success, positive growth indicators
- `--accent-negative`: `#EF4444` — Error, negative growth indicators
- `--accent-warning`: `#F59E0B` — Warnings, pending states
- `--accent-info`: `#3B82F6` — Links, selected states (use minimally)

**Dark Mode Equivalents**
- `--bg-primary-dark`: `#0A0A0A` or `#111111`
- `--bg-secondary-dark`: `#1A1A1A`
- `--bg-tertiary-dark`: `#262626`
- `--text-primary-dark`: `#FAFAFA`
- `--text-secondary-dark`: `#A1A1AA`
- `--border-light-dark`: `#27272A`

### 2. Typography

**Font Family**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Type Scale**
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page Title | 24-28px | 600 | 1.2 |
| Section Header | 18-20px | 600 | 1.3 |
| Card Title | 14-16px | 500-600 | 1.4 |
| Body Text | 14px | 400 | 1.5 |
| Small/Caption | 12-13px | 400-500 | 1.4 |
| KPI Numbers | 28-36px | 600-700 | 1.1 |

**Typography Guidelines**
- Use **sentence case** for most UI elements (not ALL CAPS)
- Headlines are bold but not heavy (weight 600, not 700-800)
- Numbers in KPIs should be slightly larger and bolder than surrounding text
- Percentage changes displayed in smaller text with colored indicators

### 3. Spacing System (8px Grid)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

**Whitespace Philosophy**
- **Generous padding** inside cards: 20-24px minimum
- **Breathing room** between sections: 24-32px
- **Comfortable margins** around content areas: 24-40px
- Let elements "breathe" — when in doubt, add more space

### 4. Border Radius (Soft Geometry)

```css
--radius-sm: 6px;      /* Buttons, inputs, small elements */
--radius-md: 8px;      /* Cards, dropdowns */
--radius-lg: 12px;     /* Panels, modals */
--radius-xl: 16px;     /* Main content area, large containers */
--radius-2xl: 20-24px; /* Hero sections, primary panels */
--radius-full: 9999px; /* Pills, avatars, circular elements */
```

**Key Radius Applications**
- **Main content panel**: `16-24px` radius (this is a signature element)
- **Cards within content**: `8-12px` radius
- **Buttons**: `6-8px` radius
- **Input fields**: `6-8px` radius
- **Sidebar**: Sharp corners (0px) or very subtle (4px)

### 5. Shadows (Subtle & Soft)

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.03);
```

**Shadow Guidelines**
- Shadows are **barely perceptible** — they create depth without being obvious
- Use shadows to separate layers, not to draw attention
- Cards often have no shadow or only `shadow-xs`
- Main content panel may have `shadow-md` against sidebar

---

## Layout Structure

### Overall Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌──────────┐  ┌─────────────────────────────────────────────┐   │
│ │          │  │                                             │   │
│ │  SIDEBAR │  │           MAIN CONTENT AREA                 │   │
│ │          │  │                                             │   │
│ │  (Dark   │  │    (White/Light background with            │   │
│ │   or     │  │     rounded corners - 16-24px radius)      │   │
│ │  Light)  │  │                                             │   │
│ │          │  │                                             │   │
│ │          │  │                                             │   │
│ └──────────┘  └─────────────────────────────────────────────┘   │
│                                                                 │
│  Background: #F3F4F6 or subtle gray                             │
└─────────────────────────────────────────────────────────────────┘
```

### Sidebar Specifications

**Expanded State**
- Width: `240-280px`
- Background: `#FFFFFF` (light) or `#111111` (dark variant)
- Padding: `16-20px`
- Logo area at top: `60-80px` height

**Collapsed State**
- Width: `64-72px`
- Only icons visible (centered)
- Tooltip on hover for navigation labels

**Sidebar Elements**
- Navigation items: `40-44px` height
- Icon size: `20px`
- Gap between icon and label: `12px`
- Active state: Subtle background (`#F3F4F6`) + left border accent or filled background
- Hover state: `#F8F9FA` background
- Section dividers: `1px` line with `16px` vertical margin
- Collapsible sections with smooth chevron rotation

**Toggle Button**
- Position: Bottom of sidebar or floating at edge
- Size: `32-36px`
- Icon: Chevron or hamburger menu
- Smooth transition: `300ms ease`

### Main Content Area

**Container Styling**
```css
.main-content {
  background: #FFFFFF;
  border-radius: 16px 16px 0 0; /* or 20-24px for more dramatic curve */
  margin-left: 8-16px;
  margin-top: 8-16px;
  min-height: calc(100vh - 16px);
  padding: 24-32px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.03);
}
```

**When sidebar is present:**
- Main content has rounded top-left corner
- Creates a "floating panel" effect
- Subtle shadow separation from sidebar

---

## Component Specifications

### Cards

**Standard Card**
```css
.card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20-24px;
  transition: all 200ms ease;
}

.card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
```

**KPI/Metric Card**
- Large number prominently displayed (28-36px, weight 600-700)
- Small label above or below (12-13px, muted color)
- Percentage change indicator with icon (arrow up/down)
- Mini sparkline or bar chart (optional)
- Generous padding (24px)

### Buttons

**Primary Button**
```css
.btn-primary {
  background: #111111;
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: background 150ms ease;
}

.btn-primary:hover {
  background: #333333;
}
```

**Secondary Button**
```css
.btn-secondary {
  background: #FFFFFF;
  color: #111111;
  border: 1px solid #E5E7EB;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
}

.btn-secondary:hover {
  background: #F8F9FA;
  border-color: #D1D5DB;
}
```

**Ghost/Text Button**
```css
.btn-ghost {
  background: transparent;
  color: #6B7280;
  padding: 8px 12px;
}

.btn-ghost:hover {
  background: #F3F4F6;
  color: #111111;
}
```

### Form Inputs

```css
.input {
  height: 40-44px;
  padding: 0 14px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  transition: all 150ms ease;
}

.input:focus {
  border-color: #111111;
  outline: none;
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
}

.input::placeholder {
  color: #9CA3AF;
}
```

### Tables

**Table Styling**
- Clean horizontal lines only (no vertical borders)
- Header row: `#F8F9FA` background, uppercase or semi-bold labels (12-13px)
- Row height: `48-56px`
- Hover state: `#FAFAFA` background
- Cell padding: `16px` horizontal
- Status badges: Pill-shaped with subtle background colors

### Charts & Data Visualization

**Bar Charts**
- Bars: Solid `#111111` (or dark gray `#374151`)
- Bar radius: `4px` top corners
- Grid lines: Very subtle (`#F3F4F6`)
- Axis labels: `12px`, muted color
- Hover tooltip: White background, subtle shadow, `8px` radius

**Line Charts**
- Line stroke: `2px`
- Dots on data points: `6px` diameter
- Grid lines: Dashed or dotted, very subtle
- Fill under line: Very subtle gradient to transparent

**Percentage Indicators**
- Positive: Green text + upward arrow icon
- Negative: Red text + downward arrow icon
- Size: `12-13px`
- Format: `+12%` or `-5.2%`

---

## Icons

**Recommended Icon Set**
- [Lucide Icons](https://lucide.dev/) — Clean, consistent, well-maintained
- Alternative: [Heroicons](https://heroicons.com/) (Outline variant)

**Icon Specifications**
- Default size: `20px` (navigation), `16px` (inline), `24px` (featured)
- Stroke width: `1.5-2px`
- Color: Match text color hierarchy (`#111111` primary, `#6B7280` secondary)
- Never use filled icons in main UI (outline only for this aesthetic)

---

## Animations & Transitions

**Standard Transitions**
```css
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

**Sidebar Collapse**
```css
.sidebar {
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Hover Effects**
- Subtle and quick (150-200ms)
- Background color changes, not transforms
- No dramatic scaling or lifting

**Page Transitions**
- Fade in: `200ms`
- Content should feel immediate, not sluggish

---

## Responsive Behavior

**Breakpoints**
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

**Mobile Behavior**
- Sidebar becomes off-canvas drawer
- Toggle via hamburger menu
- Main content takes full width
- Reduced padding (16-20px)
- Single-column card layouts

**Tablet Behavior**
- Sidebar auto-collapses to icon-only
- Expands on hover or toggle
- Two-column card grids

---

## Do's and Don'ts

### Do ✓
- Use generous whitespace
- Keep color palette restrained (mostly black/white/gray)
- Apply large border radius to main content area
- Use subtle shadows sparingly
- Keep typography clean and readable
- Let data be the visual focus, not decoration

### Don't ✗
- Don't use multiple accent colors throughout
- Don't add gradients or decorative elements
- Don't use heavy shadows or 3D effects
- Don't overcrowd the interface with elements
- Don't use ALL CAPS except sparingly for labels
- Don't use colored backgrounds for sections (keep it white)

---

## Quick Reference: Tailwind CSS Classes

```jsx
// Main content panel
className="bg-white rounded-2xl shadow-sm ml-4 mt-4 min-h-screen p-8"

// Card
className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"

// Primary button
className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"

// Secondary button
className="bg-white text-gray-900 border border-gray-200 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50"

// Sidebar nav item (active)
className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-900 font-medium"

// Sidebar nav item (inactive)
className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"

// KPI number
className="text-3xl font-semibold text-gray-900"

// Percentage indicator (positive)
className="text-sm text-emerald-600 flex items-center gap-1"

// Percentage indicator (negative)
className="text-sm text-red-500 flex items-center gap-1"

// Table header
className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider"

// Input field
className="w-full h-11 px-4 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
```

---

## Implementation Checklist

- [ ] Configure color tokens as CSS variables
- [ ] Set up typography scale with Inter font
- [ ] Implement collapsible sidebar component
- [ ] Create rounded main content container
- [ ] Build card component with hover states
- [ ] Design button variants (primary, secondary, ghost)
- [ ] Style form inputs with focus states
- [ ] Configure chart components with monochromatic palette
- [ ] Add subtle transitions throughout
- [ ] Test responsive behavior at all breakpoints
- [ ] Implement dark mode variant
