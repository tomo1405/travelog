"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"

export default function RecommendPage() {
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/me")
            const data = await res.json()
            setUser(data.user)
        }

        fetchUser()
    }, [])

    const handleClick = async () => {
        setLoading(true)

        const res = await fetch("/api/recommend")
        const data = await res.json()

        setResult(data.result)
        setLoading(false)
    }

    return (
        <>
            <header className="h-14 bg-white shadow grid grid-cols-3 items-center px-4">
                <h1 className="text-3xl font-bold cursor-pointer" onClick={() => router.push("/")}>
                    旅ログ
                </h1>
                <h1 className="text-3xl font-bold text-center">
                    旅先提案
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

            <div className="bg-gray-100 min-h-screen">
                <div className="max-w-3xl mx-auto p-8">
                    <button
                        onClick={() => {
                            localStorage.removeItem("postPreview")
                            router.back()
                        }}
                        className="text-sm text-blue-500 hover:text-black underline"
                    >
                        戻る
                    </button>

                    <p className="m-5">
                        このページでは 今までのあなたの記録から 新たな旅行先を提案します<br />
                        今後の旅先選びの参考にしてみましょう
                    </p>

                    <div className="flex justify-center m-4">
                        <button
                            onClick={handleClick}
                            className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded"
                        >
                            提案してもらう
                        </button>
                    </div>

                    {loading && <p className="mt-4">分析中...</p>}

                    <pre className="mt-6 bg-white p-4 rounded whitespace-pre-wrap">
                        <ReactMarkdown>
                            {result}
                        </ReactMarkdown>
                    </pre>
                </div>
            </div>
        </>
    )
}