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
import type { CommentType } from "@/server/functions/todos"
import { deleteCommentFn } from "@/server/functions/todos"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { Trash2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function DeleteCommentConfirmation({
  comment,
  open,
  close,
}: {
  comment: CommentType
  open: boolean
  close: () => void
}) {
  const router = useRouter()
  const deleteComment = useServerFn(deleteCommentFn)
  const [isDeleting, setIsDeleting] = useState(false)
  const handleDeleteComment = async () => {
    try {
      setIsDeleting(true)
      await deleteComment({ data: { id: comment.id } })
      toast.success("Comment deleted")
      await router.invalidate()
      close()
    } catch (error) {
      console.error("Failed to delete comment", error)
      toast.error("Failed to delete comment")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete '${comment.content}' comment.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteComment}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
