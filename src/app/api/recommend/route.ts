import { GoogleGenerativeAI } from "@google/generative-ai"
import { supabaseAdmin } from "@/lib/supabase"
import { cookies } from "next/headers"

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
)

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  const body = await req.json()
  const customPrompt: string = body?.custom || ""

  if (!userId) {
    return Response.json(
      { error: "ログインしてください" },
      { status: 401 }
    )
  }

  const { data } = await supabaseAdmin
    .from("posts")
    .select("placeName, content, prefName")
    .eq("userId", userId)

  const diaryText = data?.map((d) =>
    `旅行先:${d.prefName}
    場所:${d.placeName}
    本文:${d.content}`
  ).join("\n\n")

  const prompt = `
以下はユーザーの旅行日記です。

${diaryText}

このユーザーの旅行傾向を分析し、
次におすすめの旅行先を日本国内で3つ提案してください。

${customPrompt ? `こだわり条件：
${customPrompt}
${"\n"}
【重要】なるべくこだわり条件の内容を加味すること
` : ""}

形式：

1. 地名
理由：
おすすめスポット：
`

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  })

  const result = await model.generateContentStream(prompt)
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        controller.enqueue(new TextEncoder().encode(text))
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  })
}