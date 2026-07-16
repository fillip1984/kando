import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { TagType } from "@/server/functions/tags"
import { createTagFn, readTagsFn } from "@/server/functions/tags"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { TagIcon } from "lucide-react"
import type { FormEvent } from "react"
import { useState } from "react"

export const Route = createFileRoute("/tags")({
  component: TagsPage,
  loader: async () => {
    const tags = await readTagsFn()
    return { tags }
  },
})

function TagsPage() {
  const { tags } = Route.useLoaderData()
  const router = useRouter()
  const createTag = useServerFn(createTagFn)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#16a34a")
  const [saving, setSaving] = useState(false)

  const handleCreateTag = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    if (!normalizedName) {
      return
    }

    try {
      setSaving(true)
      await createTag({
        data: {
          name: normalizedName,
          description: description.trim() || null,
          color,
        },
      })
      setName("")
      setDescription("")
      setColor("#16a34a")
      router.invalidate()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex grow overflow-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
        <header className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Tags</h1>
          <p className="text-sm text-muted-foreground">
            Create tags and review your existing tag library.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border bg-card p-4">
            <h2 className="font-heading text-lg font-medium">Create Tag</h2>
            <form className="mt-3 space-y-3" onSubmit={handleCreateTag}>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="tag-name">
                  Name
                </label>
                <Input
                  id="tag-name"
                  placeholder="Example: Backend"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label
                  className="text-sm font-medium"
                  htmlFor="tag-description"
                >
                  Description
                </label>
                <Textarea
                  id="tag-description"
                  placeholder="Optional context for when to use this tag"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="tag-color">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    id="tag-color"
                    type="color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    className="h-10 w-18 rounded-md px-1"
                  />
                  <span className="text-sm text-muted-foreground">{color}</span>
                </div>
              </div>

              <Button type="submit" disabled={saving || !name.trim()}>
                {saving ? "Creating..." : "Create Tag"}
              </Button>
            </form>
          </section>

          <section className="rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-lg font-medium">Review Tags</h2>
              <Badge variant="outline">{tags.length}</Badge>
            </div>

            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tags yet. Create your first one.
              </p>
            ) : (
              <ul className="space-y-2">
                {tags.map((tag) => (
                  <TagListItem key={tag.id} tag={tag} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function TagListItem({ tag }: { tag: TagType }) {
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
      {tag.color ? (
        <div className="mt-2 flex items-center gap-2">
          <span
            className="size-4 rounded-full border"
            style={{ backgroundColor: tag.color }}
          />
          <span className="text-xs text-muted-foreground">{tag.color}</span>
        </div>
      ) : null}
    </li>
  )
}
