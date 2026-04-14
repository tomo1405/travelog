import { Suspense } from "react"
import PostPageClient from "./PostPageClient"

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostPageClient />
        </Suspense>
    )
}