import { createRequire } from "node:module"
import { createServerFn } from "@tanstack/react-start"

type ParsedMsgData = {
  subject?: string | null
  body?: string | null
}

type MsgReaderInstance = {
  getFileData: () => ParsedMsgData
}

type MsgReaderConstructor = new (arrayBuffer: ArrayBuffer) => MsgReaderInstance

const require = createRequire(import.meta.url)

function resolveMsgReaderConstructor(): MsgReaderConstructor {
  const msgReaderModule = require("@kenjiuno/msgreader") as
    | MsgReaderConstructor
    | {
        default?:
          | MsgReaderConstructor
          | {
              default?: MsgReaderConstructor
            }
      }

  if (typeof msgReaderModule === "function") {
    return msgReaderModule
  }

  if (typeof msgReaderModule === "object") {
    const defaultExport = msgReaderModule.default

    if (typeof defaultExport === "function") {
      return defaultExport
    }

    if (
      defaultExport != null &&
      typeof defaultExport === "object" &&
      "default" in defaultExport &&
      typeof defaultExport.default === "function"
    ) {
      return defaultExport.default
    }
  }

  throw new TypeError("Unable to resolve MsgReader constructor export.")
}

const MsgReader = resolveMsgReaderConstructor()

export const uploadAndParseMsg = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data }) => {
    try {
      const file = data.get("file")

      if (file == null || typeof file === "string") {
        throw new Error("Expected a .msg file upload in the 'file' field.")
      }

      if (!file.name.toLowerCase().endsWith(".msg")) {
        throw new Error("Only .msg uploads are supported.")
      }
      console.log("uploadAndParseMsg", file.name, file.size)
      const msgFileBuffer = await file.arrayBuffer()
      const msgReader = new MsgReader(msgFileBuffer)
      const msgInfo = msgReader.getFileData()
      const { subject, body } = msgInfo

      return { subject, body }
    } catch (error) {
      console.error("Failed to upload and parse .msg file:", error)
      throw error
    }
  })
