import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase"
import RecommendClient from "./RecommendClient"

export default async function RecommendPage() {
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

    return (
        <RecommendClient
            user={user}
        />
    )
}