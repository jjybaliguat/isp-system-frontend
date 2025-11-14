import { useRouter } from "next/navigation"
import { IconLock } from "@tabler/icons-react"

export default function AccessDenied() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 flex flex-col items-center text-center max-w-md">
        <IconLock className="text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
