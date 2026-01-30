"use client";

import { useState, useRef, useEffect } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FloatingInputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

type FloatingTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
};

/**
 * FloatingInput: Underline expand animation with floating label.
 * TOGAF ARCH-18: Design V2 premium form input.
 */
export function FloatingInput({
    label,
    error,
    className = "",
    ...props
}: FloatingInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            setHasValue(!!inputRef.current.value);
        }
    }, [props.value]);

    const isActive = isFocused || hasValue;

    return (
        <div className={`relative ${className}`}>
            <input
                ref={inputRef}
                className={`
          w-full bg-transparent border-b-2 pt-6 pb-2 px-0
          text-foreground type-body
          focus:outline-none
          transition-colors duration-[var(--transition-elegant)]
          ${error ? "border-error" : isFocused ? "border-foreground" : "border-border"}
        `}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setHasValue(!!e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${props.id}-error` : undefined}
                {...props}
            />
            <label
                className={`
          absolute left-0 transition-all duration-[var(--transition-elegant)]
          pointer-events-none
          ${isActive
                        ? "top-0 type-legal text-muted"
                        : "top-6 type-body text-muted-soft"
                    }
        `}
            >
                {label}
            </label>
            {/* Underline focus indicator */}
            <span
                className={`
          absolute bottom-0 left-1/2 h-0.5 bg-foreground
          transition-all duration-[var(--transition-elegant)]
          ${isFocused ? "w-full -translate-x-1/2" : "w-0 -translate-x-1/2"}
        `}
            />
            {error && (
                <p id={`${props.id}-error`} className="mt-1 type-data text-error">{error}</p>
            )}
        </div>
    );
}

/**
 * FloatingTextarea: Same pattern for textarea.
 */
export function FloatingTextarea({
    label,
    error,
    className = "",
    ...props
}: FloatingTextareaProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            setHasValue(!!textareaRef.current.value);
        }
    }, [props.value]);

    const isActive = isFocused || hasValue;

    return (
        <div className={`relative ${className}`}>
            <textarea
                ref={textareaRef}
                className={`
          w-full bg-transparent border-b-2 pt-6 pb-2 px-0
          text-foreground type-body min-h-[120px] resize-y
          focus:outline-none
          transition-colors duration-[var(--transition-elegant)]
          ${error ? "border-error" : isFocused ? "border-foreground" : "border-border"}
        `}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setHasValue(!!e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${props.id}-error` : undefined}
                {...props}
            />
            <label
                className={`
          absolute left-0 transition-all duration-[var(--transition-elegant)]
          pointer-events-none
          ${isActive
                        ? "top-0 type-legal text-muted"
                        : "top-6 type-body text-muted-soft"
                    }
        `}
            >
                {label}
            </label>
            <span
                className={`
          absolute bottom-0 left-1/2 h-0.5 bg-foreground
          transition-all duration-[var(--transition-elegant)]
          ${isFocused ? "w-full -translate-x-1/2" : "w-0 -translate-x-1/2"}
        `}
            />
            {error && (
                <p id={`${props.id}-error`} className="mt-1 type-data text-error">{error}</p>
            )}
        </div>
    );
}
