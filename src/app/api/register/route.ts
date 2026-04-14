import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { userId, password } = await req.json()
  if (!userId || !password) {
    return Response.json({ error: "すべての項目を入力してください" }, { status: 400 })
  }

  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("userId", userId)
    .maybeSingle()

  if (existingUser) {
    return Response.json({ error: "このユーザーIDは既に使われています" }, { status: 400 })
  }

  const password_hash = await bcrypt.hash(password, 10)

  const { error: insertError } = await supabaseAdmin
    .from("users")
    .insert([{ userId, pwd: password_hash }])

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 400 })
  }

  return Response.json({ message: "登録成功" })
}