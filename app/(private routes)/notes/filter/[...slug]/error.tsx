"use client";

export default function Error({
  error,
}: {
  error: Error;
}) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
    </div>
  );
}