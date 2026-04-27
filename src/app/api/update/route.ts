import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PUT(req: Request) {
    try {
        const body = await req.json()

        const { data, error } = await supabaseAdmin
            .from("posts")
            .update({
                placeName: body.placeName,
                content: body.content,
                recommendation: body.recommendation,
                atmosphere: body.atmosphere,
                expenses: body.expenses,
                date: body.date,
                isPrivate: body.isPrivate,
                updatedAt: new Date().toISOString()
            })
            .eq("id", body.id)
            .select()
            .single()

        if (error) {
            console.error(error)
            return NextResponse.json(
                { error: "更新失敗", detail: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (e) {
        return NextResponse.json(
            { error: "サーバーエラー" },
            { status: 500 }
        )
    }
}