import { cookies } from "next/headers"
import { Suspense } from "react"
import { supabaseAdmin } from "@/lib/supabase"
import UpdatePageClient from "./UpdatePageClient"

type Props = {
    searchParams: {
        prefCode?: string
        prefName?: string
    }
}

export default async function UpdatePage({ searchParams }: Props) {
    const params = await searchParams
    const prefCode = params.prefCode ?? ""
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
        .eq("userId", userId)
        .eq("prefName", prefName)

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UpdatePageClient
                user={user}
                prefCode={prefCode}
                prefName={prefName}
                posts={posts ?? []}
            />
        </Suspense>
    )
}