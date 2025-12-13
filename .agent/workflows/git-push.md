---
description: Add, Commit and Push to Github
---

# Git Push Guideline

When the user requests to "push changes", "save to git", or tags this file, follow these steps to ensure clean and descriptive version control.

## 1. Stage Changes
Stage all changed files (or specific ones if requested):
```bash
git add .
```

## 2. Commit Changes
Generate a **Conventional Commit** message describing the changes.
- **Format**: `type(scope): description`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Scope**: E.g., `auth`, `ui`, `sidebar`, `init`

**Example**:
```bash
git commit -m "feat(auth): implement login form and protected routes"
```

## 3. Push to Remote
Push the changes to the current branch on the remote origin:
```bash
git push origin <current-branch-name>
```
*Note: If the branch name is not known, check it first with `git branch --show-current`.*

## 4. Notify User
Confirm that changes have been pushed successfully.
