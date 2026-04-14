'use client'

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function StarRating({
    value,
    onChange
}: {
    value: number
    onChange: (v: number) => void
}) {
    return (
        <div className="flex gap-1 text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => onChange(star)}
                    className={star <= value ? "text-yellow-400" : "text-gray-300"}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

export default function PostPage() {
    const searchParams = useSearchParams()
    const prefName = searchParams.get("prefName")
    const router = useRouter()

    const [user, setUser] = useState<any>(null)
    const [date, setDate] = useState("")
    const [placeName, setPlaceName] = useState("")
    const [content, setContent] = useState("")
    const [recommendation, setRecommendation] = useState(3)
    const [atmosphere, setAtmosphere] = useState(3)
    const [expenses, setExpenses] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)

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
            const data = JSON.parse(saved)

            setDate(data.date || "")
            setPlaceName(data.placeName || "")
            setContent(data.content || "")
            setRecommendation(data.recommendation ?? 3)
            setAtmosphere(data.atmosphere ?? 3)
            setExpenses(data.expenses || "")
            setIsPrivate(data.isPrivate || false)
        }
    }, [])

    const savePreview = (prefName: string | null) => {
        if (!prefName) {
            return
        }

        if (!user?.userId) {
            alert("ユーザー情報の取得中です")
            return
        }

        if (!date || !placeName) {
            alert("必須項目を入力してください")
            return
        }

        if (recommendation < 1 || atmosphere < 1) {
            alert("評価を入力してください")
            return
        }

        const data = {
            userId: user?.userId,
            date,
            prefName,
            placeName,
            content,
            recommendation,
            atmosphere,
            expenses,
            isPrivate
        }

        localStorage.setItem("postPreview", JSON.stringify(data))
        router.push(`/newPost/preview?prefName=${encodeURIComponent(prefName)}`)
    }

    return (
        <>
            <header className="h-14 bg-white shadow grid grid-cols-3 items-center px-4">
                <h1 className="text-3xl font-bold cursor-pointer"
                    onClick={() => {
                        localStorage.removeItem("postPreview")
                        router.push("/")
                    }}>
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

            <div className="bg-gray-100 min-h-screen flex justify-center pt-16">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl mb-auto">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => {
                                localStorage.removeItem("postPreview")
                                router.back()
                            }}
                            className="text-sm text-blue-500 hover:text-black underline"
                        >
                            戻る
                        </button>

                        <span className="text-sm text-gray-400">
                            新規投稿
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold mb-6 text-center">新規投稿</h1>

                    <div className="mb-4">
                        <p className="font-medium">都道府県</p>
                        <p className="ml-2">{prefName}</p>
                    </div>

                    <div className="mb-4">
                        <label className="font-medium">訪問日（必須）</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="font-medium">場所（必須）</label>
                        <input
                            type="text"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="font-medium">本文</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="font-medium">おすすめ度（1 〜 5）</label>
                        <div className="ml-4">
                            <StarRating value={recommendation} onChange={setRecommendation} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="font-medium">雰囲気（1：静か 〜 5：賑やか）</label>
                        <div className="ml-4">
                            <StarRating value={atmosphere} onChange={setAtmosphere} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="font-medium">費用</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={expenses}
                                onChange={(e) => setExpenses(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                            <span>円</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                            非公開にする
                        </label>
                    </div>

                    <button
                        onClick={() => savePreview(prefName)}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold"
                    >
                        内容を確認する
                    </button>
                </div>
            </div>
        </>
    )
}