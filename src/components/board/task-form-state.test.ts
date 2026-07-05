import { describe, expect, it } from "vitest"

import { Swimlanes } from "@/server/functions/todos"

import { createTaskFormForLane } from "./task-form-state"

describe("createTaskFormForLane", () => {
  it("defaults create form status to the requested swimlane", () => {
    for (const lane of Swimlanes) {
      expect(createTaskFormForLane(lane)).toEqual({
        title: "",
        description: "",
        dueDate: "",
        status: lane,
        priority: "",
      })
    }
  })
})
