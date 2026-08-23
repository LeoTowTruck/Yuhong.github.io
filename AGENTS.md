# Project Instruction & Token Conservation Rules

## File Scope Restrictions (Strict)
- **Primary Files Only**: For all routine changes, inspection, and maintenance, strictly limit file reading and editing to the following 3 core files:
  1. `/index.html`
  2. `/script.js`
  3. `/style.css`
- **Do Not Inspect**:
  - Do NOT list or read files in `/images/` directory or its subdirectories.
  - Do NOT read secondary pages (`/GPS.html`, `/gps.html`, `/404.html`, `/line-tutorial.html`) unless the user explicitly names them in the prompt.
  - Do NOT re-read configuration files (`package.json`, `server.js`, `metadata.json`) unless modifying dependencies or server routes.

## Optimization Guidelines
- **Targeted Slicing**: When reading files with `view_file`, always use `StartLine` and `EndLine` parameters to target specific line ranges (50–100 lines max) around the section being modified, rather than reading the entire file.
- **Surgical Edits**: Make compact, targeted replacements with `edit_file` to keep tool outputs minimal and save context tokens.
