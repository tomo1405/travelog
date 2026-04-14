import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const userId = req.cookies.get("userId")?.value
    console.log("userId:", userId)

    const isLoginPage = req.nextUrl.pathname.startsWith("/login")
    const isRegisterPage = req.nextUrl.pathname.startsWith("/register")

    if (!userId && !isLoginPage && !isRegisterPage) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/map/:path*"],
}