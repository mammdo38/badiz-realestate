export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex items-center gap-2.5">
        <div className="w-3.5 h-3.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-slate-400 animate-bounce"></div>
      </div>
    </div>
  );
}
