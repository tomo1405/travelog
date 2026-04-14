import { GoogleGenerativeAI } from "@google/generative-ai"
import { supabaseAdmin } from "@/lib/supabase"
import { cookies } from "next/headers"

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
)

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

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
    タイトル:${d.placeName}
    内容:${d.content}`
  ).join("\n\n")

  const prompt = `
以下はユーザーの旅行日記です。

${diaryText}

このユーザーの旅行傾向を分析し、
次におすすめの旅行先を日本国内で3つ提案してください。

形式：

1. 地名
理由：
おすすめスポット：
`

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  })

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  return Response.json({ result: text })
}