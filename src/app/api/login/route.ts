import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    const { userId, password } = await req.json()
    const cookieStore = await cookies()

    if (!userId || !password) {
        return Response.json(
            { error: "ユーザIDとパスワードを入力してください" },
            { status: 400 }
        )
    }

    const { data: user } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("userId", userId)
        .single()

    if (!user) {
        return Response.json(
            { error: "ユーザID または パスワードが違います" },
            { status: 400 }
        )
    }

    const isValid = await bcrypt.compare(password, user.pwd)

    if (!isValid) {
        return Response.json(
            { error: "ユーザID または パスワードが違います" },
            { status: 400 }
        )
    }

    cookieStore.set("userId", user.userId)

    return Response.json({ message: "ログイン成功" })
}