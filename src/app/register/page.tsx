"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        if (confirmPassword && value !== confirmPassword) {
            setError("パスワードが一致しません")
        } else {
            setError("")
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setConfirmPassword(value)
        if (password && value !== password) {
            setError("パスワードが一致しません")
        } else {
            setError("")
        }
    }

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("パスワードが一致しません")
            return
        }

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ userId, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()

        if (res.ok) {
            alert("新規登録 完了")
            router.push("/login")
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
                <h1 className="text-2xl font-bold mb-2 text-center">新規登録</h1>

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

                <p className="mb-4">
                    <label className="block mb-1 font-medium">パスワード</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="パスワードを入力してください"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </p>

                <p className="mb-6">
                    <label className="block mb-1 font-medium">パスワード確認</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="もう一度パスワードを入力してください"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                </p>

                <button
                    onClick={handleRegister}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                >
                    登録
                </button>

                <p className="text-center text-gray-600">
                    <Link href="/login" className="text-blue-600 hover:underline">
                        ログインページへ
                    </Link>
                    {" "}戻る
                </p>
            </div>
        </div>
    )
}