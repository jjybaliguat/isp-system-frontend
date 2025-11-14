import Image from "next/image"

export default function LoadingComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Image
            src="/images/sierra-logo.png"
            alt="Sierra Communications"
            width={200}
            height={100}
            className="animate-pulse"
            priority
          />
          {/* Animated ring effect around logo */}
          <div className="absolute inset-0 -z-10 animate-ping opacity-20">
            <div className="h-full w-full rounded-full bg-cyan-500/30 blur-xl" />
          </div>
        </div>

        {/* Loading spinner */}
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" />
        </div>

        <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
