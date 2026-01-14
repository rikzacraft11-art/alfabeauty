import Link from "next/link";
import type { ComponentProps } from "react";

import { getButtonClassName, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";

type LinkComponentProps = ComponentProps<typeof Link>;

export default function ButtonLink({
  href,
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...linkProps
}: {
  href: LinkComponentProps["href"];
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & Omit<LinkComponentProps, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      className={getButtonClassName({ variant, size, className })}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
