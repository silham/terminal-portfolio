/** Placeholder — will be filled in a future session. */
export function EmptyView({ label }: { label: string }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4 text-sm text-gray-700">
      <div aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i}>~</div>
        ))}
      </div>
      <p className="mt-4 text-gray-600 italic">-- {label} coming soon --</p>
    </div>
  );
}
