# Branching & Deployment
- Default to current branch.
- If I say "Use STAGING", assume branch = staging and BULK MODE is allowed.
- Do not modify Git history. I decide when to commit/push/merge in GitHub Desktop.
- Never deploy directly; Shopify automatically pulls from GitHub.
# Enforcement
- On `main`: BULK MODE is **not permitted**. Only NORMAL MODE (≤3 files).
- If a prompt asks for BULK on `main`, refuse and ask to switch to `staging`.
- Emergency override (discouraged): Only proceed with BULK on `main` if the prompt includes the exact phrase:
  "I accept the risk: BULK on main". Still cap at 10 files and require a rollback plan.
