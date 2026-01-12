package obs

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
	"time"
)

// Init configures the standard library logger for JSON line output.
// Call this once at process startup (cmd/server).
func Init() {
	initOnce.Do(func() {
		// Avoid the default time prefix, since we already emit "ts".
		log.SetFlags(0)
		log.SetOutput(os.Stdout)
	})
}

var initOnce sync.Once

func ensureInit() {
	Init()
}

// Fields is a JSON-serializable key/value bag for structured logs.
//
// Guidelines (Paket A):
// - Do not log PII (names, phone numbers, emails, message bodies).
// - Keep labels/values low-cardinality.
// - Prefer flags and reasons over raw payloads.
type Fields map[string]any

type event struct {
	TS     string `json:"ts"`
	Event  string `json:"event"`
	Fields Fields `json:"fields,omitempty"`
}

// Log emits a single-line JSON log entry.
func Log(name string, fields Fields) {
	ensureInit()

	e := event{
		TS:     time.Now().UTC().Format(time.RFC3339Nano),
		Event:  name,
		Fields: fields,
	}

	b, err := json.Marshal(e)
	if err != nil {
		// Last resort: keep it non-fatal, and keep it on stderr.
		// (If JSON marshaling fails, we cannot reliably emit JSON.)
		_, _ = fmt.Fprintf(os.Stderr, "event=%s marshal_error=%v\n", name, err)
		return
	}

	log.Print(string(b))
}

// Fatal logs a structured entry and terminates the process.
func Fatal(name string, fields Fields) {
	ensureInit()
	Log(name, fields)
	os.Exit(1)
}
