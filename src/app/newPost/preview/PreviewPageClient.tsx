'use client'

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PreviewPage() {
    const searchParams = useSearchParams()
    const prefName = searchParams.get("prefName")
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/me")
            const data = await res.json()
            setUser(data.user)
        }

        fetchUser()
    }, [])

    useEffect(() => {
        const saved = localStorage.getItem("postPreview")
        if (saved) {
            setData(JSON.parse(saved))
        }
    }, [])

    const handleSubmit = async () => {
        if (!data) return

        if (!user?.userId) {
            alert("ログイン情報が取得できていません")
            return
        }

        const res = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (res.ok) {
            localStorage.removeItem("postPreview")
            alert("投稿しました！")
            router.push("/")
        } else {
            alert("投稿に失敗しました")
        }
    }

    const handleBack = () => {
        router.push(`/newPost?prefName=${encodeURIComponent(data.prefName)}`)
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">プレビュー情報がありません</p>
            </div>
        )
    }

    return (
        <>
            <header className="h-14 bg-white shadow grid grid-cols-3 items-center px-4">
                <h1 className="text-3xl font-bold cursor-pointer" onClick={() => router.push("/")}>
                    旅ログ
                </h1>
                <h1 className="text-3xl font-bold text-center">
                    {prefName}
                </h1>
                <div className="flex justify-end items-center gap-4 ml-auto">
                    {user ? (
                        <>
                            <span className="font-medium">
                                {user.userId} さん
                            </span>
                        </>
                    ) : (<></>)}
                </div>
            </header>
            <div className="min-h-screen bg-gray-100 flex justify-center pt-10 pb-10">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl mb-auto">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handleBack}
                            className="text-sm text-blue-500 underline hover:text-black"
                        >
                            戻る
                        </button>

                        <span className="text-sm text-gray-400">
                            投稿プレビュー
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-6">
                        投稿内容の確認
                    </h1>

                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-gray-500">ユーザID</p>
                            <p className="font-medium">
                                {user?.userId ?? "読み込み中"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">都道府県</p>
                            <p className="font-medium">{data.prefName}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">訪問日時</p>
                            <p className="font-medium">{data.date}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">場所</p>
                            <p className="font-medium">{data.placeName}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">本文</p>
                            <p className="whitespace-pre-wrap">{data.content || "なし"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">おすすめ度</p>
                            <p>{"★".repeat(data.recommendation)}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">雰囲気</p>
                            <p>{"★".repeat(data.atmosphere)}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">費用</p>
                            <p>{data.expenses ? `${data.expenses}円` : "未入力"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">公開設定</p>
                            <p>{data.isPrivate ? "非公開" : "公開"}</p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={handleBack}
                            className="w-1/2 py-2 border rounded hover:bg-gray-50"
                        >
                            修正する
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="w-1/2 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
                        >
                            投稿する
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}