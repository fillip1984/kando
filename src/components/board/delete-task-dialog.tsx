import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { TaskSummaryType } from "@/server/functions/todos"
import { deleteTaskFn } from "@/server/functions/todos"
import { useTaskStore } from "@/server/stores/task-store"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useState } from "react"

type DeleteTaskDialogProps = {
  open: boolean
  task: TaskSummaryType | null
}

export function DeleteTaskDialog({ open, task }: DeleteTaskDialogProps) {
  const { closeDeleteTaskConfirmation } = useTaskStore()
  const router = useRouter()
  const deleteTask = useServerFn(deleteTaskFn)
  const [deleting, setDeleting] = useState(false)
  const handleDeleteTask = async () => {
    if (!task) return
    setDeleting(true)
    await deleteTask({ data: { id: task.id } })
    setDeleting(false)
    closeDeleteTaskConfirmation()
    router.invalidate()
  }

  if (!task) return null

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Delete "{task.title}"?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={closeDeleteTaskConfirmation}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleting}
            onClick={handleDeleteTask}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
