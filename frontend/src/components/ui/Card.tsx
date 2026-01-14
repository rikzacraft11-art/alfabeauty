import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`ui-radius-tight border border-border bg-background ${className}`.trim()}>
      {children}
    </div>
  );
}
