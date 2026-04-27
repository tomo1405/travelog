"use client"

import { useRouter } from "next/navigation"

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
    initialPosts: Post[]
}

export default function PrefPageClient({
    user,
    prefCode,
    prefName,
    initialPosts,
}: Props) {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
        })

        router.replace("/")
        router.refresh()
    }

    const handlePost = () => {
        router.push(`/newPost?prefName=${encodeURIComponent(prefName)}`)
    }

    const handleUpdate = () => {
        router.push(`/update?prefCode=${encodeURIComponent(prefCode)}&prefName=${encodeURIComponent(prefName)}`)
    }

    const renderStars = (value: number) => {
        return "★".repeat(value) + "☆".repeat(5 - value)
    }

    const visiblePosts = initialPosts.filter((post) => {
        if (!post.isPrivate) return true
        if (!user) return false
        return post.userId === user.userId
    })

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

                <div className="flex justify-end items-center gap-4">
                    {user ? (
                        <>
                            <span className="font-medium">
                                {user.userId} さん
                            </span>

                            <button
                                onClick={handleLogout}
                                className="text-red-500 font-semibold underline"
                            >
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <>
                            <span>ゲスト さん</span>

                            <button
                                onClick={() => router.push("/login")}
                                className="text-blue-500 font-semibold underline"
                            >
                                ログイン
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-10">
                {user && (
                    <div>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg mb-6 cursor-pointer mx-4"
                            onClick={handlePost}
                        >
                            投稿する
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg mb-6 cursor-pointer mx-4"
                            onClick={handleUpdate}
                        >
                            編集する
                        </button>
                    </div>
                )}

                <div className="w-full max-w-2xl space-y-4">
                    <button
                        onClick={() => {
                            router.back()
                        }}
                        className="text-sm text-blue-500 hover:text-black underline cursor-pointer"
                    >
                        戻る
                    </button>
                    {visiblePosts.length === 0 ? (
                        <p>記事がありません</p>
                    ) : (
                        visiblePosts.map((post) => (
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
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}