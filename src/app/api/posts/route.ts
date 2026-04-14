import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const prefName = searchParams.get("prefName")

    let query = supabaseAdmin
      .from("posts")
      .select("*")
      .order("createdAt", { ascending: false })

    if (prefName) {
      query = query.eq("prefName", prefName)
    }

    const { data, error } = await query

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return Response.json({
      posts: data,
    })
  } catch (err) {
    return Response.json(
      { error: "サーバエラー" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      userId,
      prefName,
      date,
      placeName,
      content,
      recommendation,
      atmosphere,
      expenses,
      isPrivate,
    } = body

    if (!prefName || !date || !placeName) {
      return Response.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert([
        {
          userId,
          prefName,
          date,
          placeName,
          content,
          recommendation: Number(recommendation),
          atmosphere: Number(atmosphere),
          expenses: expenses ? Number(expenses) : null,
          isPrivate,
        },
      ])
      .select()
      .single()

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return Response.json({
      message: "投稿しました",
      post: data,
    })
  } catch (err) {
    return Response.json(
      { error: "サーバエラー" },
      { status: 500 }
    )
  }
}