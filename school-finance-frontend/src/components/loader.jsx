function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-border border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-text-muted animate-pulse">Loading…</p>
      </div>
    </div>
  );
}

export default FullScreenLoader;
