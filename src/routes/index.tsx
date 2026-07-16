import { TaskCard } from "@/components/board/swimlane/task/task-card"
import { Badge } from "@/components/ui/badge"
import { parseDueDate } from "@/lib/task-utils"
import type { TagType } from "@/server/functions/tags"
import { readTagsFn } from "@/server/functions/tags"
import type { TaskType } from "@/server/functions/todos"
import { readTasksFn } from "@/server/functions/todos"
import { createFileRoute } from "@tanstack/react-router"
import { isToday, startOfDay } from "date-fns"
import {
  CalendarClockIcon,
  CircleIcon,
  FlagIcon,
  ListTodoIcon,
  TagIcon,
} from "lucide-react"
import { useMemo } from "react"

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const tasks = await readTasksFn()
    const tags = await readTagsFn()
    return { tasks, tags }
  },
})

function App() {
  const { tasks, tags } = Route.useLoaderData()

  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status !== "done"),
    [tasks]
  )
  const todayStart = startOfDay(new Date())

  const overdue = activeTasks.filter((task) => {
    const dueDate = parseDueDate(task.dueDate)
    return dueDate !== null && !isToday(dueDate) && dueDate < todayStart
  })

  const dueToday = activeTasks.filter((task) => {
    const dueDate = parseDueDate(task.dueDate)
    return dueDate !== null && isToday(dueDate)
  })

  const upcoming = activeTasks.filter((task) => {
    const dueDate = parseDueDate(task.dueDate)
    return dueDate !== null && !isToday(dueDate) && dueDate >= todayStart
  })

  const todoBacklog = activeTasks.filter((task) => {
    const dueDate = parseDueDate(task.dueDate)
    return task.status === "todo" && dueDate === null
  })

  const frantic = activeTasks.filter((task) => task.priority === "frantic")
  const urgent = activeTasks.filter((task) => task.priority === "urgent")
  const important = activeTasks.filter((task) => task.priority === "important")
  const unprioritized = activeTasks.filter((task) => task.priority === null)

  const tasksByTag = useMemo(
    () =>
      tags.map((tag) => ({
        tag,
        tasks: activeTasks.filter((task) =>
          task.todoTags.some((todoTag) => todoTag.tagId === tag.id)
        ),
      })),
    [activeTasks, tags]
  )

  const untagged = useMemo(
    () => activeTasks.filter((task) => task.todoTags.length === 0),
    [activeTasks]
  )

  return (
    <div className="flex grow overflow-auto">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:p-6">
        <header className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overdue, due today, upcoming, and todo lists with priority
            groupings.
          </p>
        </header>

        <section className="grid gap-4 xl:grid-cols-2">
          <TaskListGroup
            title="Overdue"
            icon={<CalendarClockIcon className="size-4" />}
            tasks={overdue}
            tone="destructive"
          />
          <TaskListGroup
            title="Due Today"
            icon={<CalendarClockIcon className="size-4" />}
            tasks={dueToday}
          />
          <TaskListGroup
            title="Upcoming"
            icon={<CalendarClockIcon className="size-4" />}
            tasks={upcoming}
          />
          <TaskListGroup
            title="Todo"
            icon={<ListTodoIcon className="size-4" />}
            tasks={todoBacklog}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <FlagIcon className="size-4 text-muted-foreground" />
            <h2 className="font-heading text-lg font-medium">By Priority</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <TaskListGroup
              title="Frantic"
              icon={<CircleIcon className="size-3 fill-current" />}
              tasks={frantic}
              tone="destructive"
            />
            <TaskListGroup
              title="Urgent"
              icon={<CircleIcon className="size-3 fill-current" />}
              tasks={urgent}
              tone="default"
            />
            <TaskListGroup
              title="Important"
              icon={<CircleIcon className="size-3 fill-current" />}
              tasks={important}
              tone="secondary"
            />
            <TaskListGroup
              title="No Priority"
              icon={<CircleIcon className="size-3" />}
              tasks={unprioritized}
              tone="outline"
            />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <TagIcon className="size-4 text-muted-foreground" />
            <h2 className="font-heading text-lg font-medium">By Tag</h2>
          </div>

          {tags.length === 0 ? (
            <article className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
              No tags yet. Create tags from the Tags page to group tasks here.
            </article>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {tasksByTag.map(({ tag, tasks }) => (
                <TaskListGroup
                  key={tag.id}
                  title={tag.name}
                  icon={<TagSwatch tag={tag} />}
                  tasks={tasks}
                  tone="outline"
                />
              ))}
              <TaskListGroup
                title="Untagged"
                icon={<TagIcon className="size-4" />}
                tasks={untagged}
                tone="secondary"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function TagSwatch({ tag }: { tag: TagType }) {
  return tag.color ? (
    <span
      className="size-12 rounded-full border-3 border-border/70"
      style={{ backgroundColor: tag.color }}
      aria-hidden="true"
    />
  ) : (
    <TagIcon className="size-4" />
  )
}

function TaskListGroup({
  title,
  icon,
  tasks,
  tone = "outline",
}: {
  title: string
  icon: React.ReactNode
  tasks: TaskType[]
  tone?: "default" | "secondary" | "destructive" | "outline"
}) {
  return (
    <article className="rounded-xl border bg-card">
      <header className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">{icon}</span>
          <span>{title}</span>
        </div>
        <Badge variant={tone}>{tasks.length}</Badge>
      </header>

      {tasks.length === 0 ? (
        <p className="p-3 text-sm text-muted-foreground">
          No tasks in this list.
        </p>
      ) : (
        <ul className="space-y-2 p-2">
          {tasks.map((task) => (
            <TaskListItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </article>
  )
}

function TaskListItem({ task }: { task: TaskType }) {
  return (
    <li>
      <TaskCard task={task} />
    </li>
  )
}
