import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter as AlertDialogFooterContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { TagType } from "@/server/functions/tags"
import {
  createTagFn,
  deleteTagFn,
  readTagsFn,
  updateTagFn,
} from "@/server/functions/tags"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { PencilIcon, PlusIcon, TagIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const tagColorOptions = [
  "#16a34a",
  "#0f766e",
  "#0284c7",
  "#4f46e5",
  "#7c3aed",
  "#c026d3",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
]

function getRandomTagColor() {
  return tagColorOptions[Math.floor(Math.random() * tagColorOptions.length)]
}

export const Route = createFileRoute("/tags")({
  component: TagsPage,
  loader: async () => {
    const tags = await readTagsFn()
    return { tags }
  },
})

function TagsPage() {
  const { tags } = Route.useLoaderData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)

  const openCreateDialog = () => {
    setSelectedTag(null)
    setDialogOpen(true)
  }

  const openEditDialog = (tag: TagType) => {
    setSelectedTag(tag)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="flex grow overflow-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
          <header className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h1 className="font-heading text-2xl font-semibold">Tags</h1>
                <p className="text-sm text-muted-foreground">
                  Review existing tags and manage them from a dialog.
                </p>
              </div>
              <Button onClick={openCreateDialog}>
                <PlusIcon className="size-4" />
                Create Tag
              </Button>
            </div>
          </header>

          <section className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-lg font-medium">
                Existing Tags
              </h2>
              <Badge variant="outline">{tags.length}</Badge>
            </div>

            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tags yet. Create your first one.
              </p>
            ) : (
              <ul className="space-y-2">
                {tags.map((tag) => (
                  <TagListItem
                    key={tag.id}
                    tag={tag}
                    onEdit={() => openEditDialog(tag)}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <TagDialog
        open={dialogOpen}
        tag={selectedTag}
        close={() => setDialogOpen(false)}
      />
    </>
  )
}

function TagListItem({ tag, onEdit }: { tag: TagType; onEdit: () => void }) {
  return (
    <li className="rounded-lg border bg-background p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{tag.name}</p>
          {tag.description ? (
            <p className="text-sm text-muted-foreground">{tag.description}</p>
          ) : null}
        </div>
        <Badge variant="outline" className="gap-1">
          <TagIcon className="size-3" />
          <span>{tag.color || "No color"}</span>
        </Badge>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        {tag.color ? (
          <div className="flex items-center gap-2">
            <span
              className="size-4 rounded-full border"
              style={{ backgroundColor: tag.color }}
            />
            <span className="text-xs text-muted-foreground">{tag.color}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No color set</span>
        )}
        <Button variant="outline" size="sm" onClick={onEdit}>
          <PencilIcon className="size-3.5" />
          Edit
        </Button>
      </div>
    </li>
  )
}

function TagDialog({
  open,
  tag,
  close,
}: {
  open: boolean
  tag: TagType | null
  close: () => void
}) {
  const isNew = tag === null
  const router = useRouter()
  const createTag = useServerFn(createTagFn)
  const updateTag = useServerFn(updateTagFn)
  const deleteTag = useServerFn(deleteTagFn)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#16a34a")
  const [saving, setSaving] = useState(false)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    setName(tag?.name ?? "")
    setDescription(tag?.description ?? "")
    setColor(tag?.color ?? getRandomTagColor())
    setDeleteConfirmationOpen(false)
  }, [open, tag])

  const handleSubmit = async () => {
    const normalizedName = name.trim()
    if (!normalizedName) {
      return
    }

    try {
      setSaving(true)
      if (isNew) {
        await createTag({
          data: {
            name: normalizedName,
            description: description.trim() || null,
            color,
          },
        })
        toast.success(`Tag '${normalizedName}' created`)
      } else {
        await updateTag({
          data: {
            id: tag.id,
            name: normalizedName,
            description: description.trim() || null,
            color,
          },
        })
        toast.success("Tag updated")
      }

      close()
      await router.invalidate()
    } catch (error) {
      console.error("Failed to save tag", error)
      toast.error("Failed to save tag")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (tag === null) {
      return
    }

    try {
      setDeleting(true)
      await deleteTag({ data: { id: tag.id } })
      toast.success("Tag deleted")
      setDeleteConfirmationOpen(false)
      close()
      await router.invalidate()
    } catch (error) {
      console.error("Failed to delete tag", error)
      toast.error("Failed to delete tag")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && close()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isNew ? "Create Tag" : "Edit Tag"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="tag-name-dialog">
                Name
              </label>
              <Input
                id="tag-name-dialog"
                placeholder="Example: Backend"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label
                className="text-sm font-medium"
                htmlFor="tag-description-dialog"
              >
                Description
              </label>
              <Textarea
                id="tag-description-dialog"
                placeholder="Optional context for when to use this tag"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="tag-color-dialog">
                Color
              </label>
              <div className="flex items-center gap-3">
                <Input
                  id="tag-color-dialog"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-10 w-18 rounded-md px-1"
                />
                <span className="text-sm text-muted-foreground">{color}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            {!isNew ? (
              <Button
                variant="destructive"
                className="mr-auto"
                disabled={saving || deleting}
                onClick={() => setDeleteConfirmationOpen(true)}
              >
                <Trash2Icon className="size-4" />
                Delete Tag
              </Button>
            ) : null}
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              disabled={saving || deleting || !name.trim()}
              onClick={handleSubmit}
            >
              {saving ? "Saving..." : isNew ? "Create Tag" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteConfirmationOpen}
        onOpenChange={(nextOpen) =>
          !nextOpen && setDeleteConfirmationOpen(false)
        }
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete tag?</AlertDialogTitle>
            <AlertDialogDescription>
              {tag
                ? `This will permanently delete '${tag.name}'.`
                : "This will permanently delete this tag."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooterContent>
            <AlertDialogCancel variant="outline" disabled={deleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooterContent>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
