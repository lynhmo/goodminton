---
globs: "**/*.md"
description: This rule ensures conversational memory is maintained by creating
  persistent, linked Markdown files in the designated chat folder
  (`project/badminton/chats`). It handles both creation and cross-referencing
  automatically during subsequent chats.
alwaysApply: true
---

Always log the current conversation session into a new, sequentially named Markdown file within the `project/badminton/chats` directory. If any subsequent message references an existing chat log (e.g., "referencing X"), automatically insert a wiki-style link (`[[filename]]`) to that referenced note in the new log entry's content.