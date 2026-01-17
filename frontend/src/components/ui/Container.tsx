import type { ReactNode } from "react";

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[120rem] px-4 sm:px-6 lg:px-10 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
