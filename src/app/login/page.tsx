"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async () => {
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ userId, password }),
            credentials: "include",
        })

        const data = await res.json()

        if (res.ok) {
            // alert("ログインに成功しました")
            router.push("/")
        } else {
            setError(data.error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 pt-16">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">旅ログ</h1>
                <p className="text-gray-600 text-lg">
                    旅行の思い出を記録して 次の旅先を見つけましょう
                </p>
            </div>

            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">ログイン</h1>

                {error && (
                    <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
                )}

                <p className="mb-4">
                    <label className="block mb-1 font-medium">ユーザID</label>
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="ユーザIDを入力してください"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </p>

                <p className="mb-6">
                    <label className="block mb-1 font-medium">パスワード</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="パスワードを入力してください"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </p>

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors mb-4 cursor-pointer"
                >
                    ログイン
                </button>

                <p className="text-center text-gray-600">
                    初めての方は{" "}
                    <Link href="/register" className="text-green-600 hover:underline">
                        新規登録ページへ
                    </Link>
                </p>
            </div>
        </div>
    )
}