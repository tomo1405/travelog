import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import PrefPageClient from "./PrefPageClient"

type Props = {
  params: {
    prefName: string
  }
  searchParams: {
    prefCode?: string
    prefName?: string
  }
}

export default async function Page({ params: routeParams, searchParams }: Props) {
  const params = await searchParams
  const prefCode = params.prefCode ?? routeParams.prefName ?? ""
  const prefName = params.prefName ?? ""
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  let user = null

  if (userId) {
    const { data } = await supabaseAdmin
      .from("users")
      .select("userId")
      .eq("userId", userId)
      .single()

    user = data
  }

  const { data: posts } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("prefName", prefName)
    .order("createdAt", { ascending: false })

  return (
    <PrefPageClient
      user={user}
      prefCode={prefCode}
      prefName={prefName}
      initialPosts={posts ?? []}
    />
  )
}