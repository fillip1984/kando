"use client"

import { Button } from "@/components/ui/button"

import type { TodoStatusEnum } from "@/lib/enum-values"
import { parseOutlookMsg } from "@/server/functions/email"
import type { TaskType } from "@/server/functions/todos"
import { createTaskFn } from "@/server/functions/todos"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { CloudUploadIcon, PlusIcon } from "lucide-react"
import type { DragEvent } from "react"
import { useEffect, useRef, useState } from "react"
import { TaskCard } from "./task/task-card"
import { TaskDialog } from "./task/task-dialog"

export function Swimlane({
  lane,
  tasks,
  ref,
}: {
  lane: string
  tasks: TaskType[]
  ref?: React.Ref<HTMLDivElement>
}) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const nextPosition =
    tasks.reduce(
      (maxPosition, task) => Math.max(maxPosition, task.position ?? -1),
      -1
    ) + 1

  return (
    <>
      <div className="relative flex w-100 shrink-0 grow flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        <header className="mb-2 flex items-center justify-between p-2">
          <h2 className="font-heading text-base">{lane}</h2>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            {tasks.length}
          </span>
        </header>
        <div className="flex grow flex-col overflow-hidden">
          <div
            ref={ref}
            data-column-id={lane}
            className="flex min-h-full flex-col gap-1 overflow-y-auto px-2"
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="p-2">
          <Button
            variant="outline"
            className="mt-3 w-full justify-start"
            onClick={() => setIsTaskDialogOpen(true)}
          >
            <PlusIcon className="size-4" />
            Add Task
          </Button>
        </div>
        <NewTaskFromOutlookOverlay tasks={tasks} lane={lane} />
      </div>

      <TaskDialog
        task={
          {
            id: "new",
            title: "",
            description: "",
            status: lane,
            dueDate: "",
            priority: null,
            position: nextPosition,
          } as TaskType
        }
        open={isTaskDialogOpen}
        close={() => setIsTaskDialogOpen(false)}
      />
    </>
  )
}

const NewTaskFromOutlookOverlay = ({
  tasks,
  lane,
}: {
  tasks: TaskType[]
  lane: string
}) => {
  const [isDragStart, setIsDragStart] = useState(false)
  const [isDragReady, setIsDragReady] = useState(false)
  const dragDepthRef = useRef(0)

  const router = useRouter()
  const uploadMsgFn = useServerFn(parseOutlookMsg)
  const createTask = useServerFn(createTaskFn)
  const nextPosition =
    tasks.reduce(
      (maxPosition, task) => Math.max(maxPosition, task.position ?? -1),
      -1
    ) + 1

  useEffect(() => {
    window.addEventListener("dragenter", (e) =>
      setIsDragStart(isFileDrag(e as unknown as DragEvent<unknown>))
    )

    return () => {
      window.removeEventListener("dragenter", () => setIsDragStart(false))
    }
  }, [])

  const isFileDrag = (e: DragEvent<unknown>) => {
    const items = Array.from(e.dataTransfer.items)

    if (items.length === 0) {
      return false
    }

    const isFile = items.some((item) => item.kind === "file")

    return isFile
  }

  const handleDrag = (e: DragEvent<unknown>) => {
    e.preventDefault()
    e.stopPropagation()

    const isMsgDrag = isFileDrag(e)

    if (e.type === "dragenter") {
      dragDepthRef.current += 1
      setIsDragReady(isMsgDrag)
      return
    }

    if (e.type === "dragover") {
      if (isMsgDrag) {
        e.dataTransfer.dropEffect = "copy"
      }
      setIsDragReady(isMsgDrag)
      return
    }

    if (e.type === "dragleave") {
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

      if (dragDepthRef.current === 0) {
        setIsDragReady(false)
      }
    }
  }

  const handleDrop = async (e: DragEvent<unknown>) => {
    e.preventDefault()
    e.stopPropagation()
    dragDepthRef.current = 0
    setIsDragReady(false)
    setIsDragStart(false)

    if (e.dataTransfer.files.length > 0) {
      await processMsgFile(e.dataTransfer.files[0])
    }
  }

  const processMsgFile = async (msgFile: File) => {
    const formData = new FormData()
    formData.append("file", msgFile)

    const { subject, body } = await uploadMsgFn({ data: formData })

    await createTask({
      data: {
        title: subject ?? "No subject",
        description: body ?? "",
        position: nextPosition,
        status: lane as TodoStatusEnum,
      },
    })
    router.invalidate()
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      className={`${isDragStart ? "pointer-events-auto" : "pointer-events-none"} absolute top-0 right-0 bottom-0 left-0`}
    >
      <div
        onDrop={handleDrop}
        className={`${isDragReady ? "visible" : "hidden"}`}
      >
        {/* backdrop */}
        <div className="absolute inset-0 z-998 bg-black/30 backdrop-blur"></div>

        <div className="absolute inset-2 z-999 flex flex-col items-center justify-center">
          <CloudUploadIcon className="size-12 text-muted-foreground" />
          <p>Add task via Outlook email</p>
        </div>
      </div>
    </div>
  )
}
