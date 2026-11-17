export default function Loading() {
  return (
    <div className="container-page pt-8 sm:pt-12" aria-busy="true" aria-label="Loading products">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton mt-3 h-11 w-56" />
      <div className="mt-6 flex gap-2">
        <div className="skeleton h-11 w-16 !rounded-full" />
        <div className="skeleton h-11 w-24 !rounded-full" />
        <div className="skeleton h-11 w-24 !rounded-full" />
      </div>
      <div className="skeleton mt-4 h-12 w-full" />
      <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i}>
            <div className="skeleton aspect-[4/5] w-full" />
            <div className="skeleton mt-3 h-4 w-3/4" />
            <div className="skeleton mt-2 h-4 w-1/3" />
          </li>
        ))}
      </ul>
    </div>
  );
}
