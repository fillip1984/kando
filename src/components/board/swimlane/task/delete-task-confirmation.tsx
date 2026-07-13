import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import type { TaskType } from "@/server/functions/todos"
import { deleteTaskFn } from "@/server/functions/todos"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { Trash2Icon } from "lucide-react"
import { useState } from "react"

export default function DeleteTaskConfirmation({
  task,
  open,
  close,
}: {
  task: TaskType
  open: boolean
  close: () => void
}) {
  const router = useRouter()
  const deleteTask = useServerFn(deleteTaskFn)
  const [isDeleting, setIsDeleting] = useState(false)
  const handleDeleteTask = async () => {
    setIsDeleting(true)
    await deleteTask({ data: { id: task.id } })
    setIsDeleting(false)
    router.invalidate()
    close()
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete '${task.title}' task.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteTask}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  // if (!task) return null

  // return (
  //   <Dialog open={open}>
  //     <DialogContent>
  //       <DialogHeader>
  //         <DialogTitle>Delete Task</DialogTitle>
  //         <DialogDescription>
  //           This action cannot be undone. Delete "{task.title}"?
  //         </DialogDescription>
  //       </DialogHeader>

  //       <DialogFooter>
  //         <Button variant="outline" onClick={closeDeleteTaskConfirmation}>
  //           Cancel
  //         </Button>
  //         <Button
  //           variant="destructive"
  //           disabled={deleting}
  //           onClick={handleDeleteTask}
  //         >
  //           {deleting ? "Deleting..." : "Delete"}
  //         </Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // )
}
