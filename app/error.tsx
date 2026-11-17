"use client";

import { useEffect } from "react";

/** Last-resort safety net: visitors never see a raw error page. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page py-20 text-center sm:py-28">
      <div className="mx-auto max-w-md animate-rise rounded-3xl border border-line bg-card p-8 sm:p-10">
        <h1 className="text-2xl font-semibold">Our catalogue is being updated</h1>
        <p className="mt-3 text-muted">Something went wrong on our side. Please try again in a moment.</p>
        <button type="button" onClick={reset} className="btn btn-dark mt-7">
          Try again
        </button>
      </div>
    </section>
  );
}
