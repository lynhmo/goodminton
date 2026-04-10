# Badminton App — Agents & Skills

## Agents

| Agent | File | Vai trò |
|-------|------|---------|
| 🎨 **UI Reviewer** | [agents/ui-reviewer.md](agents/ui-reviewer.md) | Đánh giá visual design, MUI compliance, responsive, Material Design |
| 👤 **UX Reviewer** | [agents/ux-reviewer.md](agents/ux-reviewer.md) | Đánh giá user flow, usability, accessibility, interaction patterns |
| 💼 **Business Reviewer** | [agents/business-reviewer.md](agents/business-reviewer.md) | Đánh giá business logic, revenue, market fit, growth |
| 🎯 **Project Manager** | [agents/project-manager.md](agents/project-manager.md) | Điều phối team, planning, tổng hợp review, quyết định |
| 🔥 **Debugger** | [agents/debugger.md](agents/debugger.md) | Senior dev chuyên debug — systematic root cause analysis, không đoán mò |

## Skills

| Skill | File | Mô tả |
|-------|------|-------|
| **React + TypeScript** | [skills/react-typescript-patterns/SKILL.md](skills/react-typescript-patterns/SKILL.md) | Component patterns, hooks, state management, performance |
| **MUI Design System** | [skills/mui-design-system/SKILL.md](skills/mui-design-system/SKILL.md) | Theme, layout, MUI components, Material Design, responsive |
| **Design System Audit** | [skills/design-system/SKILL.md](skills/design-system/SKILL.md) | Generate & audit design tokens, visual consistency, AI slop detection |

## Tech Stack

- **Frontend**: React 18+ / TypeScript (strict)
- **UI Library**: MUI (Material UI) v5+
- **State**: React Context + useReducer / TanStack Query
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6+
- **Build**: Vite

## Workflow

```
Feature Request
    │
    ▼
🎯 Project Manager — Tạo plan, phân Task
    │
    ├──→ Developer — Implement
    │
    ▼
🎯 Project Manager — Điều phối review
    │
    ├──→ 🎨 UI Reviewer — Visual audit
    ├──→ 👤 UX Reviewer — Usability audit
    └──→ 💼 Business Reviewer — Business audit
    │
    ▼
🎯 Project Manager — Tổng hợp, quyết định
    │
    ▼
✅ Approve / ❌ Block + Action Items


Bug / Lỗi xảy ra
    │
    ▼
🔥 Debugger — Điều tra root cause (4 phases)
    │
    ├── Phase 1: Đọc error, reproduce, trace data flow
    ├── Phase 2: Tìm pattern, so sánh code đúng vs sai
    ├── Phase 3: 1 hypothesis → 1 fix → test
    └── Phase 4: Verify + viết test + cleanup
    │
    ▼
✅ Fixed + Test + Lessons Learned
```
