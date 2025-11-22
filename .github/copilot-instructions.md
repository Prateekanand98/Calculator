# Copilot Instructions — All-in-One Calculator

This is a small, single-page static web app (HTML/CSS/JS). The goal of these instructions is to help an AI coding agent be immediately productive when making changes, fixes or enhancements.

Summary
- Project type: Single-page static app. Files: `index.html`, `script.js`, `style.css`.
- Runtime: Browser only. No build steps or tests in the repo.

Big picture / architecture
- Single HTML entry (`index.html`) wires UI controls to global functions in `script.js` via inline `onclick` handlers and id lookups.
- `script.js` is a monolithic file organized by comment section headers (e.g. `// ========== ADDITION HELPERS ==========`). Functions are grouped by feature (arithmetic, financial, 2D/3D shapes, expression parser, etc.).
- UI state is stored in globals (e.g. `additionTerms`, `multiplicationTerms`, `divisionTerms`). Small persistent state: `_bgIndex` stored in `localStorage`.
- Presentation classes to preserve: `.tab-content`, `.sub-tab-content`, `.active`, `.tab-btn`, `.sub-tab-btn`, `.result`. UI switching happens with `switchTab` and `switchSubTab`.

Key patterns and conventions (do not break silently)
- DOM-first approach: functions rely on specific element ids (e.g. `addNewInput`, `addTermsDisplay`, `addResult`). When renaming an id, update both `index.html` and `script.js`.
- Inline handlers: many buttons use `onclick=\"someFunction()\"`. Prefer updating both the HTML and the JS function signature together rather than refactoring only one side.
- Function naming: feature prefixes are used consistently — `calculateX`, `addXTerm`, `clearXFields`, `copyXResult` (e.g. `calculateCircleArea`, `addAdditionTerm`). Use these prefixes when adding new features.
- Formatting helpers: use existing helpers where possible: `formatResult()`, `showResult(elementId, message, isSuccess)`, `validateInputs(...)`, and conversion helpers `convertLength/convertArea/convertVolume`.
- Error handling: UI feedback uses `showResult(..., false)`. Preserve this pattern so messages show correctly in the existing result panels.

Developer workflows
- Run locally: open `index.html` in browser or serve the folder. From PowerShell you can run:
  - `py -m http.server 8000` (or `python -m http.server 8000`) then open `http://localhost:8000`
  - or use any static server (VS Code Live Server extension is convenient).
- Debugging: use browser DevTools. Recommended entry points:
  - Set breakpoints in `script.js` around the top-level helpers (`showResult`, `formatResult`) or specific `calculate*` functions.
  - Inspect DOM elements by id to confirm expected state (e.g. check `additionTerms` in console after adding terms).
- No test suite: unit tests are not present — prefer small, well-scoped manual verification in browser after changes.

Examples from the codebase (use these as references)
- Tab switching: `switchTab('addition')` is called by the tab buttons in `index.html`.
- Addition workflow: `addAdditionTerm()`, `updateAdditionDisplay()`, `calculateAddition()` — state stored in `additionTerms` and result placed into `#addResult`.
- Reuse formatting: calculators call `showResult('circleAreaResult', resultHTML)` and use `formatResult()` for numeric display.

Suggested practices for edits & PRs
- Make focused changes: modify `index.html` and `script.js` together in the same PR when changing ids, handlers, or function signatures.
- Preserve existing global helpers and DOM ids unless you're intentionally refactoring. If refactoring to modules, include a migration plan: update HTML bindings, wire events via `addEventListener`, and test every tab.
- Keep the comment-section organization in `script.js` — it helps navigation and matches how code is structured now.

What not to do
- Do not change element ids or remove inline `onclick` handlers without updating the matching JS references — this will silently break various calculators.
- Avoid introducing build tooling or transpilation without an explicit migration plan (there are no tests or CI in this repo).

If anything in this file is unclear or you want more detail (e.g., a short migration plan to split `script.js` into modules), tell me which area and I will update the instructions or produce a migration patch.

— End of instructions
