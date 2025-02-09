"use client";

import { usePipefyPipe } from "@/hooks/use-pipefy-pipe";





export default function Users() {
    const { isLoading, error, data } = usePipefyPipe({pipeId: '305704169'})

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
console.log(data);
  return (
    <code>

        {JSON.stringify(data?.phases, null, 2)}

    </code>
  );
}
