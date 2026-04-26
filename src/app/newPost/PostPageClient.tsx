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

export default function PostPage({ user }: { user: any }) {
    const searchParams = useSearchParams()
    const prefName = searchParams.get("prefName")
    const router = useRouter()

    const [date, setDate] = useState("")
    const [placeName, setPlaceName] = useState("")
    const [content, setContent] = useState("")
    const [recommendation, setRecommendation] = useState(3)
    const [atmosphere, setAtmosphere] = useState(3)
    const [expenses, setExpenses] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [open, setOpen] = useState(false)

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

    const savePreview = () => {
        if (!prefName) return

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

        if (Number(expenses) < 0 || Number(expenses) > 2 ** 63 - 1) {
            alert("費用の数値が大きすぎます")
            return
        }

        const data = buildPostData()

        localStorage.setItem("postPreview", JSON.stringify(data))
        setOpen(true)
    }

    const buildPostData = () => {
        return {
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
    }

    const handleSubmit = async () => {
        const data = buildPostData()

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
            alert("投稿しました")
            router.push("/")
        } else {
            alert("投稿に失敗しました")
        }
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

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-400">投稿プレビュー</span>
                        </div>

                        <h1 className="text-xl font-bold text-center mb-6">
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
                                <p className="font-medium">{prefName}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">訪問日時</p>
                                <p className="font-medium">{date}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">場所</p>
                                <p className="font-medium">{placeName}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">本文</p>
                                <p className="whitespace-pre-wrap">{content || "なし"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">おすすめ度</p>
                                <p>{"★".repeat(recommendation)}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">雰囲気</p>
                                <p>{"★".repeat(atmosphere)}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">費用</p>
                                <p>{expenses ? `${expenses}円` : "未入力"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">公開設定</p>
                                <p>{isPrivate ? "非公開" : "公開"}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setOpen(false)}
                                className="w-1/2 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
            )}

            {!open && (
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
                                placeholder="お店やホテル、観光地など"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="font-medium">本文</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                                placeholder="口コミがあればご記入ください"
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
                            onClick={() => savePreview()}
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold"
                        >
                            内容を確認する
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}