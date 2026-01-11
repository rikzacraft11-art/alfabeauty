package metrics

import (
	"fmt"
	"sync"
	"time"

	"github.com/prometheus/client_golang/prometheus"
)

var registerOnce sync.Once

var (
	httpRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: "lead_api",
			Name:      "http_requests_total",
			Help:      "HTTP requests observed by the API, labeled by route/method/status_class.",
		},
		[]string{"route", "method", "status_class"},
	)

	httpRequestDurationSeconds = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: "lead_api",
			Name:      "http_request_duration_seconds",
			Help:      "HTTP request duration in seconds, labeled by route/method.",
			// Focused on a lightweight API; keep buckets coarse and few.
			Buckets: []float64{0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5},
		},
		[]string{"route", "method"},
	)

	leadSubmissionsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: "lead_api",
			Name:      "lead_submissions_total",
			Help:      "Total lead submissions observed by the API, labeled by result.",
		},
		[]string{"result"},
	)

	leadNotificationsCountByStatus = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Namespace: "lead_api",
			Name:      "lead_notifications_count",
			Help:      "Count of lead_notifications rows, labeled by status.",
		},
		[]string{"status"},
	)

	leadNotificationsPendingReady = prometheus.NewGauge(
		prometheus.GaugeOpts{
			Namespace: "lead_api",
			Name:      "lead_notifications_pending_ready_total",
			Help:      "Number of pending notifications ready to be sent (next_attempt_at <= now).",
		},
	)

	leadNotificationsPendingDelayed = prometheus.NewGauge(
		prometheus.GaugeOpts{
			Namespace: "lead_api",
			Name:      "lead_notifications_pending_delayed_total",
			Help:      "Number of pending notifications delayed for retry/backoff (next_attempt_at > now).",
		},
	)

	leadNotificationsOldestReadyPendingAgeSeconds = prometheus.NewGauge(
		prometheus.GaugeOpts{
			Namespace: "lead_api",
			Name:      "lead_notifications_oldest_ready_pending_age_seconds",
			Help:      "Age (seconds) of the oldest ready-to-send pending notification. 0 when none.",
		},
	)

	leadNotificationsOldestReadyPendingPresent = prometheus.NewGauge(
		prometheus.GaugeOpts{
			Namespace: "lead_api",
			Name:      "lead_notifications_oldest_ready_pending_present",
			Help:      "1 if there is at least one ready-to-send pending notification, else 0.",
		},
	)
)

// Init registers metrics in the default registry.
//
// It is safe to call multiple times (tests create multiple apps in-process).
func Init() {
	registerOnce.Do(func() {
		prometheus.MustRegister(
			httpRequestsTotal,
			httpRequestDurationSeconds,
			leadSubmissionsTotal,
			leadNotificationsCountByStatus,
			leadNotificationsPendingReady,
			leadNotificationsPendingDelayed,
			leadNotificationsOldestReadyPendingAgeSeconds,
			leadNotificationsOldestReadyPendingPresent,
		)
	})
}

// ObserveHTTPRequest records low-cardinality HTTP metrics.
//
// The caller must ensure "route" is a stable template (e.g. "/api/v1/leads"), not raw paths.
func ObserveHTTPRequest(route, method string, statusCode int, dur time.Duration) {
	Init()

	statusClass := "other"
	s := statusCode / 100
	if s >= 1 && s <= 5 {
		statusClass = fmt.Sprintf("%dxx", s)
	}

	httpRequestsTotal.WithLabelValues(route, method, statusClass).Inc()
	httpRequestDurationSeconds.WithLabelValues(route, method).Observe(dur.Seconds())
}

// IncLeadSubmission increments the lead submission counter.
func IncLeadSubmission(result string) {
	Init()
	leadSubmissionsTotal.WithLabelValues(result).Inc()
}

// SetLeadNotificationBacklog updates gauges for lead notification backlog.
func SetLeadNotificationBacklog(
	countsByStatus map[string]int64,
	pendingReady int64,
	pendingDelayed int64,
	oldestReadyCreatedAt *time.Time,
) {
	Init()

	// Reset known statuses to 0 first to avoid stale values when a status disappears.
	for _, st := range []string{"pending", "processing", "sent", "failed"} {
		leadNotificationsCountByStatus.WithLabelValues(st).Set(0)
	}
	for st, v := range countsByStatus {
		leadNotificationsCountByStatus.WithLabelValues(st).Set(float64(v))
	}

	leadNotificationsPendingReady.Set(float64(pendingReady))
	leadNotificationsPendingDelayed.Set(float64(pendingDelayed))

	if oldestReadyCreatedAt == nil {
		leadNotificationsOldestReadyPendingPresent.Set(0)
		leadNotificationsOldestReadyPendingAgeSeconds.Set(0)
		return
	}

	secs := time.Since(*oldestReadyCreatedAt).Seconds()
	if secs < 0 {
		secs = 0
	}
	leadNotificationsOldestReadyPendingPresent.Set(1)
	leadNotificationsOldestReadyPendingAgeSeconds.Set(secs)
}
