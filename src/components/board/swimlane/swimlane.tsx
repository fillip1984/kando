"use client"

import { Button } from "@/components/ui/button"
import type { TaskType } from "@/server/functions/todos"
import { PlusIcon } from "lucide-react"
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
      <div className="flex w-90 grow flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
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
        <NewTask lane={lane} />
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

const NewTask = ({ lane }: { lane: string }) => {
  const taskRef = useRef<HTMLInputElement | null>(null)

  // const utils = api.useContext();
  // const { mutate: createTask } = api.tasks.create.useMutation({
  //   onSuccess: () => {
  //     void utils.boards.invalidate();
  //     setTask("");
  //     taskRef.current?.focus();
  //   },
  // });

  // const handleKeyUp = (
  //   e: DetailedHTMLProps<
  //     InputHTMLAttributes<HTMLInputElement>,
  //     HTMLInputElement
  //   >
  // ) => {
  //   if (e.key === "Escape") {
  //     setTask("");
  //   } else if (e.key === "Enter" && task) {
  //     handleAddTask();
  //   }
  // };

  // const handleAddTask = () => {
  //   createTask({
  //     text: task,
  //     position: bucket.tasks.length,
  //     bucketId: bucket.id,
  //   });
  // };

  // const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: DragEvent<unknown>) => {
    console.log("handle drag", e.type)
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      // setDragActive(true);
    } else if (e.type === "dragleave") {
      // setDragActive(false);
    }
  }

  const handleDrop = async (e: DragEvent<unknown>) => {
    console.log("handle drop", e.type)
    e.preventDefault()
    e.stopPropagation()
    // setDragActive(false);
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

  const processMsgFile = async (msgFile: File) => {
    console.log("process msg file")

    // const msgFileBuffer = await msgFile.arrayBuffer()
    // const msgReader = new MsgReader()
    // const msgInfo = msgReader.getFileData()
    // const { subject, body } = msgInfo
    // console.log("MSG Info:", subject, body)
    // createTask({
    //   text: subject ?? "No subject",
    //   description: body ?? "",
    //   position: bucket.tasks.length,
    //   bucketId: bucket.id,
    // })
  }

  return (
    <div className="new-task mb-3 px-2">
      <div className="flex">
        {/* <input
          type="text"
          className="rounded-r-none"
          placeholder="New task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyUp={handleKeyUp}
          ref={taskRef}
        /> */}
        <button
          type="button"
          // onClick={handleAddTask}
          className="h-auto rounded-r bg-accent px-4 text-xl text-white"
          // disabled={!task}
        >
          +
        </button>
      </div>

      <div
        onDragEnter={handleDrag}
        className="relative my-1 flex w-full items-center justify-center"
      >
        <label
          htmlFor="dropzone-file"
          className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-accent bg-accent"
        >
          <div className="flex flex-col items-center justify-center py-1">
            <p className="text-sm text-primary">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-primary">MSG</p>
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
