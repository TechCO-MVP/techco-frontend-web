"use client";

import { useState } from "react";
import { type getDictionary } from "@/get-dictionary";
import { Button } from "./ui/button";

export default function Counter({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const [count, setCount] = useState(0);
  return (
    <p>
      This component is rendered on client:
      <Button onClick={() => setCount((n) => n - 1)}>
        {dictionary.counter.decrement}
      </Button>
      {count}
      <Button onClick={() => setCount((n) => n + 1)}>
        {dictionary.counter.increment}
      </Button>
    </p>
  );
}
