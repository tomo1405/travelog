import { Suspense } from "react"
import PreviewPageClient from "./PreviewPageClient"

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PreviewPageClient />
        </Suspense>
    )
}