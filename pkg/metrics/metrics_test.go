package metrics

import "testing"

func TestTraceIDFromTraceparent(t *testing.T) {
	tests := []struct {
		name string
		tp   string
		want string
	}{
		{
			name: "valid",
			tp:   "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
			want: "4bf92f3577b34da6a3ce929d0e0e4736",
		},
		{
			name: "valid_with_whitespace",
			tp:   " 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01 ",
			want: "4bf92f3577b34da6a3ce929d0e0e4736",
		},
		{
			name: "empty",
			tp:   "",
			want: "",
		},
		{
			name: "invalid_parts",
			tp:   "00-4bf92f3577b34da6a3ce929d0e0e4736-01",
			want: "",
		},
		{
			name: "invalid_traceid_len",
			tp:   "00-4bf92f35-00f067aa0ba902b7-01",
			want: "",
		},
		{
			name: "invalid_traceid_nonhex",
			tp:   "00-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-00f067aa0ba902b7-01",
			want: "",
		},
		{
			name: "invalid_all_zero_traceid",
			tp:   "00-00000000000000000000000000000000-00f067aa0ba902b7-01",
			want: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := traceIDFromTraceparent(tt.tp); got != tt.want {
				t.Fatalf("traceIDFromTraceparent() = %q, want %q", got, tt.want)
			}
		})
	}
}
