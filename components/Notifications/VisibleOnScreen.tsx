import { useEffect, useRef } from "react";

type Props = {
  onVisible: () => void;
  children: React.ReactNode;
};

export function VisibleOnScreen({ onVisible, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible();
      },
      { threshold: 0.8 },
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [onVisible]);

  return <div ref={ref}>{children}</div>;
}
