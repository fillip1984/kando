import DeleteCommentConfirmation from "@/components/board/swimlane/task/delete-comment-confirmation"
import DatePickerWithClear from "@/components/custom-ui/date-picker-with-clear"
import InlineEditableInput from "@/components/custom-ui/inline-editable-input"
import InlineEditableTextarea from "@/components/custom-ui/inline-editable-textarea"
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import type { ComboboxOption } from "@/lib/combobox-utils"
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
  Flag,
  GoalIcon,
  GripVerticalIcon,
  Kanban,
  TagIcon,
  TrashIcon,
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
  const handleSubmit = async ({
    updates,
  }: {
    updates: {
      title: string
      description: string
      status: TodoStatusEnum
      dueDate: string
      priority: TodoPriorityEnum | null
      position: number
    }
  }) => {
    const normalizedTitle = title.trim()
    try {
      setSaving(true)
      // if (isNew) {
      //   await createTask({
      //     data: {
      //       title,
      //       description: description || null,
      //       status,
      //       dueDate,
      //       priority: priority || null,
      //       position,
      //     },
      //   })
      //   toast.success(`Task '${normalizedTitle}' created`)
      // } else {
      await updateTask({
        data: {
          id: task.id,
          title: updates.title,
          description: updates.description || null,
          status: updates.status,
          dueDate: updates.dueDate || null,
          priority: updates.priority || null,
          position: updates.position,
        },
      })
      toast.success("Task updated")
      // }

      // close()
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
      <DialogContent className="w-3/4 sm:max-w-5xl" showCloseButton={false}>
        {/* <DialogHeader>
          <DialogTitle>
            {!task.emailSubjectLine && (
              <Button
                variant={"secondary"}
                onClick={handleCopyToClipboard}
                className="text-sm"
              >
                Email Subject line
                {!isCopied ? (
                  <CopyIcon />
                ) : (
                  <CheckIcon className="animate-bounce text-primary" />
                )}
              </Button>
            )}
          </DialogTitle>
        </DialogHeader> */}
        {/* custom header section for the task dialog */}
        {/* <div className="-m-4 flex rounded-lg">
          // some more ideas: put the status drop down at the start, have chevrons to cycle through tasks, add an ellipsis and have a delete, duplicate, etc
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="mt-2 mr-2 ml-auto"
          >
            <XIcon className="size-4" />
          </Button>
        </div> */}

        <div
          className={`-mx-4 no-scrollbar grid max-h-[75vh] gap-4 overflow-y-auto px-4 ${
            isNew ? "" : "lg:grid-cols-2"
          }`}
        >
          <div className="space-y-3 lg:min-w-0">
            <Field>
              <InlineEditableInput
                value={title}
                onChange={(value) => setTitle(value)}
                placeholder="Task title"
                onBlur={() =>
                  handleSubmit({
                    updates: {
                      title,
                      description,
                      status,
                      dueDate,
                      priority,
                      position,
                    },
                  })
                }
                className="w-full text-xl"
              />
            </Field>

            <Field>
              <InlineEditableTextarea
                value={description}
                onChange={(value) => setDescription(value)}
                placeholder="Description (optional)"
                onBlur={() =>
                  handleSubmit({
                    updates: {
                      title,
                      description,
                      status,
                      dueDate,
                      priority,
                      position,
                    },
                  })
                }
                className="w-full"
              />
            </Field>

            <FieldGroup className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Combobox
                items={Object.values(TodoStatusEnumValues)}
                value={status}
                onValueChange={(value) => {
                  const newStatus = value ?? "Todo"
                  setStatus(newStatus)
                  handleSubmit({
                    updates: {
                      title,
                      description,
                      status: newStatus,
                      dueDate,
                      priority,
                      position,
                    },
                  })
                }}
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

              <DatePickerWithClear
                value={dueDate}
                handleOnChange={(value) => {
                  const newDueDate = value
                  setDueDate(newDueDate)
                  handleSubmit({
                    updates: {
                      title,
                      description,
                      status,
                      dueDate: newDueDate,
                      priority,
                      position,
                    },
                  })
                }}
                leadingIcon={<GoalIcon data-testid="due-date-icon" />}
                placeholder="Due date"
              />

              <Combobox
                items={Object.values(TodoPriorityEnumValues)}
                value={priority}
                onValueChange={(value) => {
                  const newPriority = value
                  setPriority(newPriority)
                  handleSubmit({
                    updates: {
                      title,
                      description,
                      status,
                      dueDate,
                      priority: newPriority,
                      position,
                    },
                  })
                }}
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
            </FieldGroup>
          </div>

          {!isNew && (
            <div className="space-y-6 lg:min-w-0 lg:border-l lg:pl-4">
              <TagsSection task={task} />
              <ChecklistSection task={task} />
              <CommentsSection task={task} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
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
