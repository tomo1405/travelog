import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function DELETE(req: Request) {
    try {
        const body = await req.json()
        const { id, userId } = body

        if (!id || !userId) {
            return NextResponse.json(
                { error: "不正なリクエスト" },
                { status: 400 }
            )
        }

        const { data, error } = await supabaseAdmin
            .from("posts")
            .delete()
            .eq("id", id)
            .eq("userId", userId)

        if (error) {
            console.error(error)
            return NextResponse.json(
                { error: "削除失敗", detail: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data })
    } catch (e) {
        return NextResponse.json(
            { error: "サーバーエラー" },
            { status: 500 }
        )
    }
}