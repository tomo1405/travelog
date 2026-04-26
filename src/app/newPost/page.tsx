import { cookies } from "next/headers"
import { Suspense } from "react"
import { supabaseAdmin } from "@/lib/supabase"
import PostPageClient from "./PostPageClient"

export default async function NewPostPage() {
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
        <Suspense fallback={<div>Loading...</div>}>
            <PostPageClient
                user={user}
            />
        </Suspense>
    )
}