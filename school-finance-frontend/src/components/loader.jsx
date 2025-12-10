   function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur flex items-center justify-center z-50">
      <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default FullScreenLoader;