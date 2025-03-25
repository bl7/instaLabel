export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <h2 className="text-xl font-semibold">Loading...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we load your content</p>
      </div>
    </div>
  )
} 