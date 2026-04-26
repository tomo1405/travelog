"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"

export default function RecommendClient({ user }: { user: any }) {
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [custom, setCustom] = useState("")
    const router = useRouter()

    const handleClick = async () => {
        setLoading(true)
        setResult("")

        const res = await fetch("/api/recommend", {
            method: "POST",
            body: JSON.stringify({ custom }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const reader = res.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) return

        let done = false

        while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading

            const chunk = decoder.decode(value)
            setResult((prev) => prev + chunk)
        }

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
                            router.back()
                        }}
                        className="text-sm text-blue-500 hover:text-black underline cursor-pointer"
                    >
                        戻る
                    </button>

                    <p className="m-5">
                        このページでは 今までのあなたの記録から 新たな旅行先を提案します<br />
                        今後の旅先選びの参考にしてみましょう
                    </p>

                    <div className="p-4 bg-white">
                        <label className="font-medium">こだわり条件入力</label>
                        <textarea
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="こだわりや嗜好があれば入力してください"
                        />
                    </div>

                    <div className="flex justify-center m-4">
                        <button
                            onClick={handleClick}
                            disabled={loading}
                            className={`px-4 py-2 rounded text-white ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {loading ? "分析中..." : "提案してもらう"}
                        </button>
                    </div>

                    {loading &&
                        <div className="mt-6 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600">旅行データを分析中...</p>
                        </div>
                    }

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