# Kando

Kando is a single-board Kanban task tracker built with TanStack Start, React, TypeScript, Drizzle, and shadcn/ui.

## What it does

- Shows tasks in four swimlanes: `todo`, `in_progress`, `blocked`, and `done`.
- Lets you create and edit tasks from a shared dialog.
- Supports drag-and-drop between columns to update task status.
- Includes a sidebar with mutually exclusive filters such as overdue, today, blocked only, and no due date.
- Persists data in PostgreSQL through Drizzle.

## Requirements

- Node.js 20 or newer.
- `pnpm`.
- A PostgreSQL database.

## Setup

Install dependencies:

```bash
pnpm install
```

Set the required environment variables before running the app:

```bash
DATABASE_URL=postgres://user:password@host:5432/database
DATABASE_SCHEMA=kando
```

Apply the schema to your database:

```bash
pnpm db:push
```

If you want to inspect the database visually, open Drizzle Studio:

```bash
pnpm db:studio
```

## Run the app

Start the development server:

```bash
pnpm dev
```

Then open the app in your browser at the local Vite URL shown in the terminal.

## How to use Kando

1. Open the board and review tasks grouped by status.
2. Use the sidebar to narrow the list with one filter at a time.
3. Create a task from a swimlane button, then choose the target status in the dialog.
4. Edit an existing task from its card to update the title, description, due date, or status.
5. Drag a card to another column to move it between swimlanes.
6. Toggle light/dark mode with the theme switch in the header.

## Available scripts

- `pnpm dev` starts the local development server on port 3000.
- `pnpm build` creates a production build.
- `pnpm preview` serves the production build locally.
- `pnpm test` runs the Vitest suite.
- `pnpm lint` runs ESLint.
- `pnpm typecheck` runs the TypeScript compiler without emitting files.
- `pnpm format` formats the codebase with Prettier.
- `pnpm check` verifies formatting without changing files.
- `pnpm db:push` pushes the schema to the configured database.
- `pnpm db:studio` opens Drizzle Studio for the configured database.

## Project structure

- `src/routes/index.tsx` wires the main board UI together.
- `src/components/board/` contains the Kanban board, filters, dialog, and task state helpers.
- `src/server/db/` contains the database client, schema, and relations.
- `src/server/functions/todos.ts` contains the server functions used by the board.

## Adding UI components

If you want to add more shadcn/ui components, use:

```bash
npx shadcn@latest add button
```

The generated component will be placed under `src/components/ui/`.
