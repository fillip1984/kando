import StyledDatePicker from "@/components/custom-ui/styled-date-picker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
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
import { priorityLabels } from "@/lib/priority-utils"
import { swimlaneLabels } from "@/lib/swimlane-utils"
import type { TagType } from "@/server/functions/tags"
import { readTagsFn } from "@/server/functions/tags"
import type {
  ChecklistItemType,
  TaskPriority,
  TaskStatus,
  TaskType,
} from "@/server/functions/todos"
import {
  addTagToTaskFn,
  createChecklistItemFn,
  createCommentFn,
  createTaskFn,
  deleteChecklistItemFn,
  deleteCommentFn,
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
  PlusIcon,
  TrashIcon,
  Type,
  XIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

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
  const [status, setStatus] = useState<TaskStatus | "">("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<TaskPriority | "">("")
  const [position, setPosition] = useState(9999)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (open) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setDueDate(task.dueDate || "")
      setPriority(task.priority || "")
      setPosition(task.position ?? 9999)
    }
  }, [open])

  const router = useRouter()
  const createTask = useServerFn(createTaskFn)
  const updateTask = useServerFn(updateTaskFn)
  const handleSubmit = async () => {
    try {
      setSaving(true)
      if (isNew) {
        await createTask({
          data: {
            title,
            description: description || null,
            status: status as TaskStatus,
            dueDate,
            priority: priority || null,
            position,
          },
        })
      } else {
        await updateTask({
          data: {
            id: task.id,
            title,
            description: description || null,
            status: status as TaskStatus,
            dueDate: dueDate || null,
            priority: priority || null,
            position,
          },
        })
      }
    } finally {
      // TODO: this may cause issues if the server function fails
      // TODO: to make this perfect we should wait for the dialog to close then set saving to false
      close()
      router.invalidate()
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Create Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar grid max-h-[75vh] gap-3 overflow-y-auto px-4">
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
              value={status || null}
              items={swimlaneLabels.map((label) => label.value)}
              onValueChange={(next) => setStatus(next ?? "")}
            >
              <ComboboxInput
                aria-label="Open status options"
                showTrigger
                value={
                  status
                    ? swimlaneLabels.find((label) => label.value === status)
                        ?.name
                    : ""
                }
                placeholder="Status"
                className="shrink-0"
              >
                <InputGroupAddon>
                  <Kanban data-testid="status-icon" className="size-4" />
                </InputGroupAddon>
              </ComboboxInput>

              <Field className="mx-auto w-full">
                <StyledDatePicker
                  value={dueDate}
                  handleOnChange={(value) => setDueDate(value)}
                  leadingIcon={<GoalIcon data-testid="due-date-icon" />}
                  placeholder="Due date"
                />
              </Field>

              <ComboboxContent className="w-full" align="center">
                <ComboboxList>
                  {swimlaneLabels.map((label) => (
                    <ComboboxItem key={label.value} value={label.value}>
                      {label.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <Combobox
              value={priority || null}
              items={priorityLabels.map((label) => label.value)}
              onValueChange={(next) => setPriority(next ?? "")}
            >
              <ComboboxInput
                aria-label="Open priority options"
                showClear
                showTrigger
                value={
                  priority
                    ? priorityLabels.find((label) => label.value === priority)
                        ?.name
                    : ""
                }
                placeholder="Priority"
                className="shrink-0"
              >
                <InputGroupAddon>
                  <Flag data-testid="priority-field-icon" className="size-4" />
                </InputGroupAddon>
              </ComboboxInput>
              <ComboboxContent className="w-full" align="center">
                <ComboboxList>
                  {priorityLabels.map((label) => (
                    <ComboboxItem key={label.value} value={label.value}>
                      {label.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {task.id !== "new" && (
            <>
              <TagsSection task={task} />
              <ChecklistSection task={task} />
              <CommentsSection task={task} />
            </>
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

const TagsSection = ({ task }: { task: TaskType }) => {
  // gather tags
  const readTags = useServerFn(readTagsFn)
  const [availableTags, setAvailableTags] = useState<TagType[]>([])
  useEffect(() => {
    const fetchTags = async () => {
      const tags = await readTags()
      setAvailableTags(tags)
    }
    fetchTags()
  }, [readTags, task.todoTags])

  // search state
  const [tagSearch, setTagSearch] = useState("")
  const [filteredTags, setFilteredTags] = useState<TagType[]>([])
  useEffect(() => {
    console.log("filtered tags")
    let suggestedTags = []
    if (tagSearch.trim().length === 0) {
      console.log("no search, showing all tags")
      suggestedTags = availableTags
    } else {
      suggestedTags = availableTags.filter((tag) =>
        tag.name.toLowerCase().includes(tagSearch.toLowerCase())
      )
    }
    // exclude tags already added to the task
    suggestedTags = suggestedTags.filter(
      (tag) => !task.todoTags.some((todoTag) => todoTag.tagId === tag.id)
    )
    setFilteredTags(suggestedTags)
  }, [tagSearch, availableTags])

  const router = useRouter()
  const addTag = useServerFn(addTagToTaskFn)
  const handleAddTag = async (tag: TagType) => {
    await addTag({
      data: {
        todoId: task.id,
        tagId: tag.id,
      },
    })
    setTagSearch("")
    router.invalidate()
  }

  const removeTag = useServerFn(removeTagToTaskFn)
  const handleRemoveTag = async (tag: TagType) => {
    await removeTag({
      data: {
        todoId: task.id,
        tagId: tag.id,
      },
    })
    router.invalidate()
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Tags</h3>
      <InputGroup>
        <InputGroupAddon align="block-start">
          <div data-slot="input-group-control" className="flex flex-wrap gap-2">
            {task.todoTags.map((todoTag) => (
              <div
                key={todoTag.id}
                className="flex h-5 w-fit items-center gap-2 rounded-2xl border pl-2 text-sm"
              >
                {todoTag.tag?.color ? (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: todoTag.tag.color }}
                  />
                ) : null}
                <span>{todoTag.tag!.name}</span>
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  onClick={() => handleRemoveTag(todoTag.tag!)}
                >
                  <XIcon className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        </InputGroupAddon>

        <InputGroupAddon align="block-end">
          <InputGroupInput
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            placeholder="Search tags..."
          />
        </InputGroupAddon>
      </InputGroup>

      {/* TODO: replace with combo box instead? https://ui.shadcn.com/docs/components/base/combobox#multiple */}
      {/* <Input
        
      /> */}
      {filteredTags.length > 0 && (
        <div className="flex flex-wrap">
          {filteredTags.map((todoTag) => (
            <Button
              key={todoTag.id}
              variant={"ghost"}
              onClick={() => handleAddTag(todoTag)}
              className="p-0"
            >
              <Badge variant="outline">
                {todoTag.color ? (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: todoTag.color }}
                  />
                ) : null}
                <span>{todoTag.name}</span>
                <PlusIcon data-icon="inline-end" />
              </Badge>
            </Button>
          ))}
        </div>
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
  const [checklistRef, checklistItems] = useDragAndDrop<
    HTMLUListElement,
    ChecklistItemType
  >(task.checklistItems, {
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
      reorderChecklistItems({ data: { updates } })
    },
  })

  return (
    <div className="mt-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
        <CheckIcon className="size-4" />
        Checklist
        <div className="ml-auto">
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
          <ul ref={checklistRef} className="mb-4">
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
      <GripVerticalIcon className="drag-handle size-4" />
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

  const router = useRouter()
  const createComment = useServerFn(createCommentFn)
  const handleCreateComment = async () => {
    await createComment({
      data: {
        content: newCommentContent,
        todoId: task.id,
      },
    })
    setNewCommentContent("")
    router.invalidate()
  }

  const deleteComment = useServerFn(deleteCommentFn)
  const handleDeleteComment = async (commentId: string) => {
    await deleteComment({
      data: {
        id: commentId,
      },
    })
    router.invalidate()
  }

  return (
    <div className="mt-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
        <AlignLeft className="size-4" />
        Comments
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
          variant="ghost"
        >
          <ChevronDownIcon
            className={`${isCollapsed ? "-rotate-90" : ""} transition`}
          />
        </Button>
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
                      onClick={() => handleDeleteComment(comment.id)}
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
                  onClick={handleCreateComment}
                >
                  Post
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </>
      )}
    </div>
  )
}
