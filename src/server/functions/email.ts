import { MsgReader } from "@kenjiuno/msgreader-web-ng"
import { createServerFn } from "@tanstack/react-start"

export const parseOutlookMsg = createServerFn({ method: "POST" })
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
      const msgFileBuffer = await file.arrayBuffer()
      const msgReader = new MsgReader(msgFileBuffer)
      //   msgReader.parserConfig = {
      //     ansiEncoding: ansiEncoding,
      //     includeRawProps: includeRawProps,
      //   }
      // TODO: interesting dump of other data that may be useful
      //   const testMsgInfo = msgReader.getFileData()
      //   console.log("testMsgInfo", testMsgInfo)
      const msgInfo = msgReader.getFileData()
      const { subject, body } = msgInfo

      return { subject, body }
    } catch (error) {
      console.error("Failed to upload and parse .msg file:", error)
      throw error
    }
  })
