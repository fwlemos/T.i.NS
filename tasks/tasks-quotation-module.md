## Relevant Files

- `src/features/quotations/types.ts` - TypeScript interfaces for Quotation entities.
- `src/features/quotations/components/QuotationForm.tsx` - Main form component for creating/editing quotations.
- `src/features/quotations/components/QuotationPDF.tsx` - PDF template/generation component.
- `supabase/migrations/YYYYMMDDHHMMSS_quotation_module.sql` - Database migration for quotation schema.
- `src/server/api/routers/quotation.ts` - TRPC router for quotation operations.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `npx jest` to run tests.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/quotation-module`)
- [ ] 1.0 Database Schema & Migrations
- [ ] 2.0 Core Backend Logic (TRPC Routers)
- [ ] 3.0 Quotation List & Management UI
- [ ] 4.0 Quotation Creation & Editing UI
- [ ] 5.0 PDF Generation Service
- [ ] 6.0 Integration & Polish
