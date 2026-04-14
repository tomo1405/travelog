import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
        return Response.json({ user: null })
    }

    const { data: user } = await supabaseAdmin
        .from("users")
        .select("userId")
        .eq("userId", userId)
        .single()

    const { data: posts } = await supabaseAdmin
        .from("posts")
        .select("prefName")
        .eq("userId", userId)

    const prefectures = Array.from(
        new Set((posts ?? []).map(p => p.prefName).filter(Boolean))
    )

    return Response.json({
        user,
        visitedCount: prefectures.length,
        visitedPrefectures: prefectures,
    })
}