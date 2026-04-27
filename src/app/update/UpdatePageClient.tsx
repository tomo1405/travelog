"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"

type Post = {
    id: string
    userId: string
    prefName: string
    placeName: string
    content: string
    recommendation: number
    atmosphere: number
    expenses: number | null
    date: string
    createdAt?: string
    isPrivate: boolean
}

type Props = {
    user: any
    prefCode: string
    prefName: string
    posts: Post[]
}

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

export default function UpdatePageClient({
    user,
    prefCode,
    prefName,
    posts
}: Props) {
    const router = useRouter()

    const [editingPost, setEditingPost] = useState<Post | null>(null)
    const [form, setForm] = useState<any>({})
    const [localPosts, setLocalPosts] = useState(posts)

    useEffect(() => {
        if (editingPost) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }

        return () => {
            document.body.style.overflow = ""
        }
    }, [editingPost])

    const openModal = (post: Post) => {
        setEditingPost(post)
        setForm({ ...post })
    }

    const handleChange = (key: string, value: any) => {
        setForm((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        if (!form.date || !form.placeName) {
            alert("必須項目を入力してください")
            return
        }

        const res = await fetch("/api/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })

        if (res.ok) {
            alert("更新しました")
        } else {
            alert("更新失敗")
            return
        }

        setLocalPosts((prev) => prev.map((p) => (p.id === form.id ? form : p)))

        setEditingPost(null)
        if (!prefCode) {
            router.back()
            router.refresh()
            return
        }

        router.push(`/prefectures/${prefCode}?prefCode=${encodeURIComponent(prefCode)}&prefName=${encodeURIComponent(prefName)}`)
        router.refresh()
    }

    const handleDelete = async (id: string) => {
        if (!confirm("この投稿を削除しますか？")) return

        const res = await fetch("/api/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                userId: user?.userId
            })
        })

        if (!res.ok) {
            alert("削除失敗")
            return
        }

        setLocalPosts((prev) => prev.filter((p) => p.id !== id))
        router.push(`/prefectures/${prefCode}?prefCode=${encodeURIComponent(prefCode)}&prefName=${encodeURIComponent(prefName)}`)
        router.refresh()
    }

    const renderStars = (value: number) =>
        "★".repeat(value) + "☆".repeat(5 - value)

    return (
        <>
            <header className="h-14 bg-white shadow grid grid-cols-3 items-center px-4">
                <h1
                    className="text-3xl font-bold cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    旅ログ
                </h1>

                <h1 className="text-3xl font-bold text-center">
                    {prefName}
                </h1>

                <div className="flex justify-end">
                    {user && <span>{user.userId} さん</span>}
                </div>
            </header>

            <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-10">
                <div className="w-full max-w-2xl space-y-4">

                    <button
                        onClick={() => router.back()}
                        className="text-sm text-blue-500 hover:text-black underline cursor-pointer"
                    >
                        戻る
                    </button>

                    {localPosts.length === 0 ? (
                        <p>記事がありません</p>
                    ) : (
                        localPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white p-4 rounded shadow"
                            >
                                <h2 className="font-bold text-lg">
                                    {post.placeName}
                                </h2>

                                <p className="text-gray-600 mt-1">
                                    {post.content}
                                </p>

                                <div className="text-sm text-gray-500 mt-2">
                                    <p>投稿者: {post.userId}</p>
                                    <p>日付: {post.date}</p>

                                    <p>おすすめ度:</p>
                                    <div className="ml-4">
                                        {renderStars(post.recommendation)}
                                    </div>

                                    <p>雰囲気（1：静か ～ 5：賑やか）:</p>
                                    <div className="ml-4">
                                        {renderStars(post.atmosphere)}
                                    </div>

                                    {post.expenses && (
                                        <p>費用: {post.expenses}円</p>
                                    )}

                                    {post.isPrivate &&
                                        user?.userId === post.userId && (
                                            <p className="text-xs text-red-500 mt-2">
                                                ※この投稿は非公開です（自分のみ表示）
                                            </p>
                                        )}

                                    {user?.userId === post.userId && (
                                        <div className="flex gap-3 mt-2">
                                            <button
                                                onClick={() => openModal(post)}
                                                className="text-blue-500 underline cursor-pointer"
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-500 underline cursor-pointer"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {editingPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl p-6 sticky">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-400">
                                投稿編集画面
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold mb-6 text-center">
                            投稿編集
                        </h1>

                        <div className="mb-4">
                            <p className="font-medium">都道府県</p>
                            <p className="ml-2">{prefName}</p>
                        </div>

                        <div className="mb-4">
                            <label className="font-medium">訪問日（必須）</label>
                            <input
                                type="date"
                                value={form.date || ""}
                                onChange={(e) => handleChange("date", e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="font-medium">場所（必須）</label>
                            <input
                                type="text"
                                value={form.placeName || ""}
                                onChange={(e) => handleChange("placeName", e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="font-medium">本文</label>
                            <textarea
                                value={form.content || ""}
                                onChange={(e) => handleChange("content", e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="font-medium">おすすめ度（1〜5）</label>
                            <div className="ml-4">
                                <StarRating
                                    value={form.recommendation}
                                    onChange={(v) => handleChange("recommendation", v)}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="font-medium">
                                雰囲気（1：静か 〜 5：賑やか）
                            </label>
                            <div className="ml-4">
                                <StarRating
                                    value={form.atmosphere}
                                    onChange={(v) => handleChange("atmosphere", v)}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="font-medium">費用</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={form.expenses ?? ""}
                                    onChange={(e) =>
                                        handleChange("expenses", e.target.value)
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                />
                                <span>円</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isPrivate || false}
                                    onChange={(e) =>
                                        handleChange("isPrivate", e.target.checked)
                                    }
                                />
                                非公開にする
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditingPost(null)}
                                className="w-1/2 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
                            >
                                キャンセル
                            </button>

                            <button
                                onClick={handleSave}
                                className="w-1/2 py-2 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer"
                            >
                                更新する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}