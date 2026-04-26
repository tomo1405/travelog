import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import HomeClient from "./HomeClient"

export default async function Home() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  let user = null
  let visitedCount = 0
  let visitedPrefectures: string[] = []

  if (userId) {
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("userId")
      .eq("userId", userId)
      .single()

    const { data: posts } = await supabaseAdmin
      .from("posts")
      .select("prefName")
      .eq("userId", userId)

    const prefectures = Array.from(
      new Set((posts ?? []).map((p) => p.prefName).filter(Boolean))
    )

    user = userData
    visitedCount = prefectures.length
    visitedPrefectures = prefectures
  }

  return (
    <HomeClient
      user={user}
      visitedCount={visitedCount}
      visitedPrefectures={visitedPrefectures}
    />
  )
}