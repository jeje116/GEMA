---
name: create_skill
description: Automates the creation of professional-grade Antigravity skills. Incorporates best practices for progressive disclosure, resource organization, and automatic agent registration.
---

# Create Skill

Use this skill to define a new capability for Antigravity. It enforces a professional structure inspired by industry best practices (conciseness, progressive disclosure, and modularity).

## Inputs
*   **Skill Name**: The name of the skill (snake_case).
*   **Description**: A short, action-oriented summary of what the skill does.
*   **Instructions**: The core logic or checklist for the skill.

## Tooling Strategy
*   Use `write_to_file` to create `SKILL.md` and related files.
*   Use `run_command` to verify directory creation if not using `write_to_file`'s auto-create.

## Workflow

### 1. Design & Strategy
Before creating files, deduce from context or ask the user:
*   **Trigger**: What specifically should trigger this skill? (This goes into the `description`).
*   **Complexity**:
    *   *Simple*: Just a `SKILL.md` checklist.
    *   *Complex*: Needs `scripts/` (for tools) or `references/` (for docs).

### 2. Create Skill Structure
Create the skill directory at `.agents/skills/[skill_name]/`.
Based on **Complexity**, create subfolders if needed:
*   `.agents/skills/[skill_name]/scripts/` (Executable code)
*   `.agents/skills/[skill_name]/references/` (Documentation)
*   `.agents/skills/[skill_name]/assets/` (Templates/Images)

### 3. Write `SKILL.md` (The "Concise" Rule)
*   **Frontmatter**:
    *   `name`: `snake_case_name`
    *   `description`: **CRITICAL**. This is what the AI router reads.
*   **Body**:
    *   **Progressive Disclosure**: Keep it under 500 words. Refactor deep context, matrices, or long tables into `references/`.
    *   **Structure**:
        ```markdown
        ---
        name: [skill_name]
        description: [description]
        ---
        
        # [Human Readable Title]
        
        [Instructions, prompts, and steps provided by the user]
        ```

### 4. Register Slash Command (Workflow)
Create the workspace-local workflow trigger at:
*   `.agents/workflows/[skill_name].md`

*   **Content**:
    ```markdown
    ---
    description: [Short, action-oriented summary]
    ---
    1. Run the [skill_name] skill.
    ```

*Note: Skill creation remains workspace-local and version-controlled under `.agents/` unless the user explicitly requests global installation.*

### 5. Update README.md
*   **Target**: `.agents/skills/README.md`
*   **Action**: Add the new skill to the `## 🛠️ Available Skills` section.
*   **Logic**:
    *   Determine the appropriate category (header) for the skill (e.g., Development, Documentation, Strategy, Quality Assurance).
    *   If the category exists, append the skill to it.
    *   If not, create a new category header `### [Category Name]` and add the skill there.
    *   **Format**: `* [**[Human Name]**](./[skill_name]/SKILL.md) (/[skill_name]) - [Short description]`

### 6. Final Confirmation
Confirm to the user:
*   Structure created in `.agents/skills/[skill_name]/`.
*   Slash command `/[skill_name]` ready in `.agents/workflows/[skill_name].md`.
*   Documentation catalog `.agents/skills/README.md` updated.

## Skill Design Principles (Advanced)
When generating instructions for `SKILL.md`, enforce these agentic design patterns:
*   **Single Responsibility**: A skill should do exactly one thing exceptionally well. If it's doing two things, it should be two skills.
*   **Observable Actions**: Favor instructions that produce tangible output (files, git commits, diagrams) rather than just returning text in the chat.
*   **Fail Gracefully**: Explicitly instruct the skill to stop and ask the user for clarification if required context, files, or permissions are missing, rather than guessing.
*   **Safety Constraints**: If the skill involves executing code, deleting files, or making network requests, include a clear "Safety & Verification" step.