"use client"

import { Button } from "@/components/ui/button"
import { parseOutlookMsg } from "@/server/functions/email"
import type { TaskStatus, TaskType } from "@/server/functions/todos"
import { createTaskFn } from "@/server/functions/todos"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { CloudUploadIcon, PlusIcon } from "lucide-react"
import type { ChangeEvent, DragEvent } from "react"
import { useRef, useState } from "react"
import { TaskCard } from "./task/task-card"
import { TaskDialog } from "./task/task-dialog"

export function Swimlane({
  label,
  lane,
  tasks,
  ref,
}: {
  label: string
  lane: string
  tasks: TaskType[]
  ref?: React.Ref<HTMLDivElement>
}) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  return (
    <>
      <div className="relative flex w-90 shrink-0 grow flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
        <header className="mb-2 flex items-center justify-between p-2">
          <h2 className="font-heading text-base">{label}</h2>
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
            position: tasks.length,
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
  const [isDragReady, setIsDragReady] = useState(false)
  const dragDepthRef = useRef(0)

  const isFileDrag = (e: DragEvent<unknown>) => {
    const items = Array.from(e.dataTransfer.items)

    console.log(
      "isFileDrag:items",
      items.map((item) => {
        const file = item.getAsFile()

        return {
          kind: item.kind,
          type: item.type,
          name: file?.name ?? null,
        }
      })
    )

    if (items.length === 0) {
      console.log("isFileDrag:result", false, "reason=no-items")
      return false
    }

    const isFile = items.some((item) => item.kind === "file")

    console.log("isFileDrag:result", isFile)

    return isFile
  }

  const handleDrag = (e: DragEvent<unknown>) => {
    e.preventDefault()
    e.stopPropagation()

    const isMsgDrag = isFileDrag(e)
    console.log("handle drag outcome", e.type, { isMsgDrag })

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
    console.log("handle drop", e.type)
    e.preventDefault()
    e.stopPropagation()
    dragDepthRef.current = 0
    setIsDragReady(false)

    if (e.dataTransfer.files.length > 0) {
      await processMsgFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handle change", e.type)
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      await processMsgFile(e.target.files[0])
    }
  }

  const router = useRouter()
  const uploadMsgFn = useServerFn(parseOutlookMsg)
  const createTask = useServerFn(createTaskFn)

  const processMsgFile = async (msgFile: File) => {
    console.log("process msg file")

    const formData = new FormData()
    formData.append("file", msgFile)

    const { subject, body } = await uploadMsgFn({ data: formData })

    await createTask({
      data: {
        title: subject ?? "No subject",
        description: body ?? "",
        position: tasks.length,
        status: lane as TaskStatus,
      },
    })
    router.invalidate()
  }

  return (
    <div className="new-task mb-3 px-2">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        className="relative my-1 flex w-full items-center justify-center"
      >
        <label
          htmlFor="dropzone-file"
          className={
            "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition duration-200 " +
            (isDragReady
              ? "scale-[1.02] border-primary bg-primary/10 text-primary shadow-sm"
              : "border-accent bg-accent text-primary")
          }
        >
          <div className="flex flex-col items-center justify-center gap-1 py-2">
            {isDragReady ? (
              <CloudUploadIcon className="size-5 animate-pulse" />
            ) : null}
            <p className="text-sm">
              <span className="font-semibold">
                {isDragReady
                  ? "Drop Outlook email to upload"
                  : "Click to upload"}
              </span>
              {isDragReady ? null : " or drag and drop"}
            </p>
            <p className="text-xs">MSG</p>
          </div>
          {/* Trick to getting file drag and drop to function (by function I 
              mean the browser doesn't try to load or ask if you want to 
              download it) is to drop the file into the <input type="file"/> 
              element. To style things, you cannot make the input hidden but 
              can make it's opacity 0. One last note, the input below overlays 
              everything above so css styles like setting the cursor to a 
              pointer will not apply unless you put it on this element. Same 
              with on hover effects... messing with z index doesn't fix this.
            */}
          <input
            id="dropzone-file"
            type="file"
            accept=".msg"
            multiple={false}
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleChange}
            onDrop={handleDrop}
          />
        </label>
      </div>
    </div>
  )
}
