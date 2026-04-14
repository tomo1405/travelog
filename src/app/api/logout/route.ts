import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "ログアウト" });
  response.cookies.set("userId", "");
  return response;
}