import DeleteCommentConfirmation from "@/components/board/swimlane/task/delete-comment-confirmation"
import StyledDatePicker from "@/components/custom-ui/styled-date-picker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import type { TodoPriorityEnum, TodoStatusEnum } from "@/lib/enum-values"
import { TodoPriorityEnumValues, TodoStatusEnumValues } from "@/lib/enum-values"
import type { TagType } from "@/server/functions/tags"
import { readTagsFn } from "@/server/functions/tags"
import type {
  ChecklistItemType,
  CommentType,
  TaskType,
} from "@/server/functions/todos"
import {
  addTagToTaskFn,
  createChecklistItemFn,
  createCommentFn,
  createTaskFn,
  deleteChecklistItemFn,
  removeTagToTaskFn,
  reorderChecklistItemsFn,
  updateChecklistItemFn,
  updateTaskFn,
} from "@/server/functions/todos"
import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import {
  AlignLeft,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  Flag,
  GoalIcon,
  GripVerticalIcon,
  Kanban,
  TagIcon,
  TrashIcon,
  Type,
  XIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function TaskDialog({
  task,
  open,
  close,
}: {
  task: TaskType
  open: boolean
  close: () => void
}) {
  // init form state
  // TODO: this should be done differently, but working quick to make things work for now
  const isNew = task.id === "new"
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TodoStatusEnum>(task.status)
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<TodoPriorityEnum | null>(null)
  const [position, setPosition] = useState(9999)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (open) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setDueDate(task.dueDate || "")
      setPriority(task.priority ?? null)
      setPosition(task.position ?? 9999)
    }
  }, [open])

  const router = useRouter()
  const createTask = useServerFn(createTaskFn)
  const updateTask = useServerFn(updateTaskFn)
  const handleSubmit = async () => {
    const normalizedTitle = title.trim()
    try {
      setSaving(true)
      if (isNew) {
        await createTask({
          data: {
            title,
            description: description || null,
            status,
            dueDate,
            priority: priority || null,
            position,
          },
        })
        toast.success(`Task '${normalizedTitle}' created`)
      } else {
        await updateTask({
          data: {
            id: task.id,
            title,
            description: description || null,
            status,
            dueDate: dueDate || null,
            priority: priority || null,
            position,
          },
        })
        toast.success("Task updated")
      }

      close()
      await router.invalidate()
    } catch (error) {
      console.error("Failed to save task", error)
      toast.error("Failed to save task")
    } finally {
      setSaving(false)
    }
  }

  const [isCopied, setIsCopied] = useState(false)
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(title)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => open === false && close()}>
      <DialogContent className="w-3/4 sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{isNew ? "Create Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>

        <div
          className={`-mx-4 no-scrollbar grid max-h-[75vh] gap-4 overflow-y-auto px-4 ${
            isNew ? "" : "lg:grid-cols-2"
          }`}
        >
          <div className="space-y-3 lg:min-w-0">
            <div className="relative">
              <Type
                data-testid="title-icon"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Task title"
                className="pl-9"
              />
            </div>

            <div className="relative">
              <AlignLeft className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
              <Textarea
                aria-label="Task description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description (optional)"
                className="max-h-80 min-h-40 resize-none pl-9 break-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Combobox
                items={Object.values(TodoStatusEnumValues)}
                value={status}
                onValueChange={(value) => setStatus(value ?? "Todo")}
              >
                <ComboboxInput>
                  <InputGroupAddon>
                    <Kanban data-testid="status-icon" className="size-4" />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent className="w-full" align="center">
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <Field className="mx-auto w-full">
                <StyledDatePicker
                  value={dueDate}
                  handleOnChange={(value) => setDueDate(value)}
                  leadingIcon={<GoalIcon data-testid="due-date-icon" />}
                  placeholder="Due date"
                />
              </Field>

              <Combobox
                items={Object.values(TodoPriorityEnumValues)}
                value={priority}
                onValueChange={(value) => setPriority(value)}
              >
                <ComboboxInput showClear placeholder="Priority">
                  <InputGroupAddon>
                    <Flag
                      data-testid="priority-field-icon"
                      className="size-4"
                    />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          {!isNew && (
            <div className="space-y-6 lg:min-w-0 lg:border-l lg:pl-4">
              <TagsSection task={task} />
              <ChecklistSection task={task} />
              <CommentsSection task={task} />
            </div>
          )}
        </div>

        <DialogFooter>
          {task.emailSubjectLine && (
            <Button
              variant={"ghost"}
              onClick={handleCopyToClipboard}
              className="mr-auto"
            >
              Email Subject line
              {!isCopied ? (
                <CopyIcon />
              ) : (
                <CheckIcon className="animate-bounce text-primary" />
              )}
            </Button>
          )}
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            disabled={saving || !title.trim() || !status}
            onClick={handleSubmit}
          >
            {saving ? "Saving..." : isNew ? "Create Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type ComboboxOption = {
  value: string
  label: string
}

const TagsSection = ({ task }: { task: TaskType }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // gather tags
  const readTags = useServerFn(readTagsFn)
  const [availableTags, setAvailableTags] = useState<TagType[]>([])
  useEffect(() => {
    const fetchTags = async () => {
      const tags = await readTags()
      setAvailableTags(tags)
    }
    fetchTags()
  }, [readTags])

  const router = useRouter()
  const addTag = useServerFn(addTagToTaskFn)
  const removeTag = useServerFn(removeTagToTaskFn)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    setSelectedTags(task.todoTags.map((todoTag) => todoTag.tagId))
  }, [task.id, task.todoTags])

  const handleSelectedTagsChange = async (nextSelectedTags: string[]) => {
    console.log("handleSelectedTagsChange", nextSelectedTags)
    const previousSelectedTags = selectedTags
    setSelectedTags(nextSelectedTags)

    const addedTagIds = nextSelectedTags.filter(
      (tagId) => !previousSelectedTags.includes(tagId)
    )
    const removedTagIds = previousSelectedTags.filter(
      (tagId) => !nextSelectedTags.includes(tagId)
    )

    if (addedTagIds.length === 0 && removedTagIds.length === 0) {
      return
    }

    try {
      for (const tagId of addedTagIds) {
        await addTag({
          data: {
            todoId: task.id,
            tagId,
          },
        })
      }

      for (const tagId of removedTagIds) {
        await removeTag({
          data: {
            todoId: task.id,
            tagId,
          },
        })
      }

      await router.invalidate()
    } catch (error) {
      console.error("Failed to update task tags", error)
      toast.error("Failed to update task tags")
      setSelectedTags(previousSelectedTags)
    }
  }

  const lookupTagColor = (tagId: string, tags: TagType[]): string => {
    const tag = tags.find((t) => t.id === tagId)
    return tag?.color ? tag.color : "transparent"
  }
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <TagIcon className="size-4" />
        Tags
        <div className="ml-auto flex items-center">
          <Badge variant="secondary">{task.todoTags.length}</Badge>
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}

            variant="ghost"
          >
            <ChevronDownIcon
              className={`${isCollapsed ? "-rotate-90" : ""} transition`}
            />
          </Button>
        </div>
      </h3>

      {!isCollapsed && (
        <Combobox
          multiple
          autoHighlight
          items={availableTags.map((tag) => ({
            value: tag.id,
            label: tag.name,
          }))}
          value={selectedTags}
          onValueChange={(value) => void handleSelectedTagsChange(value)}
        >
          <ComboboxChips>
            <ComboboxValue>
              <div className="flex grow flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex h-5 w-fit items-center gap-2 rounded-2xl border pl-2 text-sm"
                    >
                      {tag ? (
                        <span
                          className="size-2 rounded-full"
                          style={{
                            backgroundColor: lookupTagColor(tag, availableTags),
                          }}
                        />
                      ) : null}
                      <span>
                        {availableTags.find((t) => t.id === tag)?.name || ""}
                      </span>
                      <Button
                        variant={"ghost"}
                        size={"icon-xs"}
                        data-slot="combobox-chip-remove"
                        onClick={() =>
                          handleSelectedTagsChange(
                            selectedTags.filter((t) => t !== tag)
                          )
                        }
                      >
                        <XIcon className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <ComboboxChipsInput placeholder="Select tags..." />
              </div>
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent align="center">
            <ComboboxEmpty>No tags found.</ComboboxEmpty>
            <ComboboxList>
              {(item: ComboboxOption) => (
                <ComboboxItem key={item.value} value={item.value}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
    </div>
  )
}

const ChecklistSection = ({ task }: { task: TaskType }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [newChecklistItem, setNewChecklistItem] = useState("")

  const router = useRouter()
  const createChecklistItem = useServerFn(createChecklistItemFn)
  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim()) return
    setIsPending(true)
    await createChecklistItem({
      data: {
        content: newChecklistItem,
        position: task.checklistItems.length,
        todoId: task.id,
      },
    })
    setNewChecklistItem("")
    setIsPending(false)
    router.invalidate()
  }

  // DnD
  const reorderChecklistItems = useServerFn(reorderChecklistItemsFn)
  const [checklistRef, checklistItems, setChecklistItems] = useDragAndDrop<
    HTMLUListElement,
    ChecklistItemType
  >([], {
    dragHandle: ".drag-handle",
    plugins: [animations()],
    onDragend: async (event) => {
      const dragEvent = event as { values: ChecklistItemType[] }
      const updates = dragEvent.values.map((item, i) => ({
        id: item.id,
        content: item.content,
        position: i,
        complete: item.complete,
      }))
      await reorderChecklistItems({ data: { updates } })
      router.invalidate()
    },
  })
  useEffect(() => {
    setChecklistItems(task.checklistItems)
  }, [task.checklistItems, setChecklistItems])

  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <CheckIcon className="size-4" />
        Checklist
        <div className="ml-auto flex items-center">
          <Badge variant="secondary">
            {checklistItems.filter((item) => item.complete).length}/
            {checklistItems.length}
          </Badge>
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}

            variant="ghost"
          >
            <ChevronDownIcon
              className={`${isCollapsed ? "-rotate-90" : ""} transition`}
            />
          </Button>
        </div>
      </h3>
      {!isCollapsed && (
        <>
          <ul ref={checklistRef} className="isolate">
            {checklistItems.map((item) => (
              <ChecklistItem key={item.id} item={item} />
            ))}
          </ul>
          <InputGroup>
            <InputGroupInput
              placeholder="New checklist item..."
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyUp={async (e) => {
                if (e.key === "Enter") await handleAddChecklistItem()
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                onClick={handleAddChecklistItem}
                disabled={isPending || !newChecklistItem}
              >
                Add
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </>
      )}
    </div>
  )
}

const ChecklistItem = ({ item }: { item: ChecklistItemType }) => {
  const [isChecked, setIsChecked] = useState(item.complete)

  const router = useRouter()
  const updateChecklistItem = useServerFn(updateChecklistItemFn)
  const handleToggle = async () => {
    setIsChecked(!isChecked)
    await updateChecklistItem({
      data: {
        id: item.id,
        content: item.content,
        position: item.position,
        complete: !isChecked,
      },
    })
    router.invalidate()
  }

  const deleteChecklistItem = useServerFn(deleteChecklistItemFn)
  const handleDelete = async () => {
    await deleteChecklistItem({
      data: {
        id: item.id,
      },
    })
    router.invalidate()
  }

  return (
    <li className="flex items-center gap-2 p-2">
      <span className="drag-handle cursor-grab active:cursor-grabbing">
        <GripVerticalIcon className="size-4" />
      </span>
      <Checkbox checked={isChecked} onCheckedChange={handleToggle} />
      <span
        className={`${isChecked ? "text-muted-foreground line-through" : ""}`}
      >
        {item.content}
      </span>
      <Button
        variant="destructive"
        size="icon-xs"
        className="ml-auto"
        onClick={handleDelete}
      >
        <TrashIcon />
      </Button>
    </li>
  )
}

const CommentsSection = ({ task }: { task: TaskType }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [newCommentContent, setNewCommentContent] = useState("")
  const [isNewCommentContentValid, setIsNewCommentContentValid] =
    useState(false)
  useEffect(() => {
    setIsNewCommentContentValid(newCommentContent.trim().length > 0)
  }, [newCommentContent])
  const [isDeleteCommentConfirmationOpen, setIsDeleteCommentConfirmationOpen] =
    useState(false)
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(
    null
  )

  const router = useRouter()
  const createComment = useServerFn(createCommentFn)
  const handleCreateComment = async () => {
    if (!isNewCommentContentValid) return
    await createComment({
      data: {
        content: newCommentContent,
        todoId: task.id,
      },
    })
    setNewCommentContent("")
    router.invalidate()
  }

  const handleDeleteComment = (comment: CommentType) => {
    setSelectedComment(comment)
    setIsDeleteCommentConfirmationOpen(true)
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <AlignLeft className="size-4" />
        Comments
        <div className="ml-auto flex items-center">
          <Badge variant="secondary">{task.comments.length}</Badge>
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
            variant="ghost"
          >
            <ChevronDownIcon
              className={`${isCollapsed ? "-rotate-90" : ""} transition`}
            />
          </Button>
        </div>
      </h3>
      {!isCollapsed && (
        <>
          <div>
            {task.comments.map((comment) => (
              <div key={comment.id} className="mb-2 flex items-start gap-2">
                <div className="flex-1 rounded-lg border border-border/70 bg-card p-2">
                  <p className="text-sm">{comment.content}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    {comment.createdAt.toLocaleDateString()}
                    <Button
                      variant="destructive"
                      size="icon-xs"
                      onClick={() => handleDeleteComment(comment)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Field>
            <InputGroup>
              <InputGroupTextarea
                id="block-end-textarea"
                placeholder="Write a comment..."
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
              />
              <InputGroupAddon align="block-end">
                {/* <InputGroupText>{newCommentContent.length}/280</InputGroupText> */}
                <InputGroupButton
                  variant="default"
                  size="sm"
                  className="ml-auto"
                  disabled={!isNewCommentContentValid}
                  onClick={handleCreateComment}
                >
                  Post
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </>
      )}

      {selectedComment !== null && (
        <DeleteCommentConfirmation
          comment={selectedComment}
          open={isDeleteCommentConfirmationOpen}
          close={() => {
            setIsDeleteCommentConfirmationOpen(false)
            setSelectedComment(null)
          }}
        />
      )}
    </div>
  )
}
