package obs

import (
	"context"
	"strings"
)

// traceparentKey is used to store a W3C traceparent header in context.
//
// This allows non-HTTP code paths (services/workers) to attach trace-aware
// exemplars or include trace correlation fields in structured logs.
type traceparentKey struct{}

// WithTraceparent returns a derived context that carries the given traceparent.
// Empty/whitespace inputs return the original context unchanged.
func WithTraceparent(ctx context.Context, traceparent string) context.Context {
	tp := strings.TrimSpace(traceparent)
	if tp == "" {
		return ctx
	}
	return context.WithValue(ctx, traceparentKey{}, tp)
}

// TraceparentFromContext returns the traceparent stored in ctx (if any).
func TraceparentFromContext(ctx context.Context) string {
	if ctx == nil {
		return ""
	}
	v, _ := ctx.Value(traceparentKey{}).(string)
	return strings.TrimSpace(v)
}
