import { Suspense } from "react"
import PrefPageClient from "./PrefPageClient"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrefPageClient />
    </Suspense>
  )
}