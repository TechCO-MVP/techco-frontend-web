"use client";

import { useState } from "react";
import { type getDictionary } from "@/get-dictionary";
import { Button } from "./ui/button";

interface CounterProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}
export default function Counter({ dictionary }: Readonly<CounterProps>) {
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
