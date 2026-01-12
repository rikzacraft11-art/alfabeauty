package metrics

import (
	"fmt"
	"strings"
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

	leadNotificationEnqueueTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: "lead_api",
			Name:      "lead_notification_enqueue_total",
			Help:      "Total lead notification enqueue attempts, labeled by channel/result.",
		},
		[]string{"channel", "result"},
	)

	leadNotificationEnqueueDurationSeconds = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: "lead_api",
			Name:      "lead_notification_enqueue_duration_seconds",
			Help:      "Duration of enqueueing a lead notification into the outbox, labeled by channel/result.",
			Buckets:   []float64{0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1},
		},
		[]string{"channel", "result"},
	)

	leadNotificationSendTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: "lead_api",
			Name:      "lead_notification_send_total",
			Help:      "Total lead notification send attempts by the worker, labeled by channel/result.",
		},
		[]string{"channel", "result"},
	)

	leadNotificationSendDurationSeconds = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: "lead_api",
			Name:      "lead_notification_send_duration_seconds",
			Help:      "Duration of sending a lead notification by the worker, labeled by channel/result.",
			Buckets:   []float64{0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10},
		},
		[]string{"channel", "result"},
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

	// --- Website telemetry (Paket A A4 / UAT-16) ---

	webVitalsReportsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: "lead_api",
			Name:      "web_vitals_reports_total",
			Help:      "Total Web Vitals reports received, labeled by metric/device_type/rating.",
		},
		[]string{"metric", "device_type", "rating"},
	)

	webVitalsLCPSeconds = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: "lead_api",
			Name:      "web_vitals_lcp_seconds",
			Help:      "Largest Contentful Paint (LCP) in seconds (RUM), labeled by device_type.",
			Buckets:   []float64{0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10},
		},
		[]string{"device_type"},
	)

	webVitalsINPSeconds = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: "lead_api",
			Name:      "web_vitals_inp_seconds",
			Help:      "Interaction to Next Paint (INP) in seconds (RUM), labeled by device_type.",
			Buckets:   []float64{0.05, 0.1, 0.15, 0.2, 0.3, 0.5, 1, 2},
		},
		[]string{"device_type"},
	)

	webVitalsCLS = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: "lead_api",
			Name:      "web_vitals_cls",
			Help:      "Cumulative Layout Shift (CLS) (RUM), labeled by device_type.",
			Buckets:   []float64{0.01, 0.03, 0.05, 0.1, 0.15, 0.25, 0.5, 1},
		},
		[]string{"device_type"},
	)

	websiteEventsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: "lead_api",
			Name:      "website_events_total",
			Help:      "Website analytics events received, labeled by event/device_type.",
		},
		[]string{"event", "device_type"},
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
			leadNotificationEnqueueTotal,
			leadNotificationEnqueueDurationSeconds,
			leadNotificationSendTotal,
			leadNotificationSendDurationSeconds,
			leadNotificationsCountByStatus,
			leadNotificationsPendingReady,
			leadNotificationsPendingDelayed,
			leadNotificationsOldestReadyPendingAgeSeconds,
			leadNotificationsOldestReadyPendingPresent,
			webVitalsReportsTotal,
			webVitalsLCPSeconds,
			webVitalsINPSeconds,
			webVitalsCLS,
			websiteEventsTotal,
		)
	})
}

// ObserveHTTPRequest records low-cardinality HTTP metrics.
//
// The caller must ensure "route" is a stable template (e.g. "/api/v1/leads"), not raw paths.
func ObserveHTTPRequest(route, method string, statusCode int, dur time.Duration) {
	ObserveHTTPRequestWithTraceparent(route, method, statusCode, dur, "")
}

// ObserveHTTPRequestWithTraceparent records low-cardinality HTTP metrics and, when possible,
// attaches a trace exemplar (trace_id) to the duration histogram.
//
// IMPORTANT:
// - The trace identifier is attached as an exemplar (sample), NOT as a label.
// - This keeps metric cardinality low while enabling drill-down from spikes to traces/logs.
func ObserveHTTPRequestWithTraceparent(route, method string, statusCode int, dur time.Duration, traceparent string) {
	Init()

	statusClass := "other"
	s := statusCode / 100
	if s >= 1 && s <= 5 {
		statusClass = fmt.Sprintf("%dxx", s)
	}

	httpRequestsTotal.WithLabelValues(route, method, statusClass).Inc()

	// Attach exemplar when the Prometheus client supports it and traceparent contains a valid trace id.
	obs := httpRequestDurationSeconds.WithLabelValues(route, method)
	if eo, ok := obs.(prometheus.ExemplarObserver); ok {
		if tid := traceIDFromTraceparent(traceparent); tid != "" {
			eo.ObserveWithExemplar(dur.Seconds(), prometheus.Labels{"trace_id": tid})
			return
		}
	}
	obs.Observe(dur.Seconds())
}

// traceIDFromTraceparent extracts the 32-hex trace-id from a W3C traceparent header.
// Expected format: "version-traceid-spanid-flags" (e.g. "00-<32hex>-<16hex>-01").
func traceIDFromTraceparent(tp string) string {
	tp = strings.TrimSpace(tp)
	if tp == "" {
		return ""
	}
	parts := strings.Split(tp, "-")
	if len(parts) != 4 {
		return ""
	}
	traceID := strings.ToLower(strings.TrimSpace(parts[1]))
	if len(traceID) != 32 {
		return ""
	}
	// Must be lowercase hex.
	for i := 0; i < len(traceID); i++ {
		c := traceID[i]
		isNum := c >= '0' && c <= '9'
		isHex := c >= 'a' && c <= 'f'
		if !isNum && !isHex {
			return ""
		}
	}
	// W3C forbids all-zero trace-id.
	if traceID == "00000000000000000000000000000000" {
		return ""
	}
	return traceID
}

// IncLeadSubmission increments the lead submission counter.
func IncLeadSubmission(result string) {
	Init()
	leadSubmissionsTotal.WithLabelValues(result).Inc()
}

// ObserveLeadNotificationEnqueueWithTraceparent records outbox enqueue performance and, when possible,
// attaches a trace exemplar (trace_id) to the duration histogram.
//
// result should be a stable low-cardinality value, e.g. "ok" or "error".
func ObserveLeadNotificationEnqueueWithTraceparent(channel, result string, dur time.Duration, traceparent string) {
	Init()
	ch := strings.TrimSpace(strings.ToLower(channel))
	if ch == "" {
		ch = "unknown"
	}
	res := strings.TrimSpace(strings.ToLower(result))
	if res == "" {
		res = "unknown"
	}

	leadNotificationEnqueueTotal.WithLabelValues(ch, res).Inc()

	obs := leadNotificationEnqueueDurationSeconds.WithLabelValues(ch, res)
	if eo, ok := obs.(prometheus.ExemplarObserver); ok {
		if tid := traceIDFromTraceparent(traceparent); tid != "" {
			eo.ObserveWithExemplar(dur.Seconds(), prometheus.Labels{"trace_id": tid})
			return
		}
	}
	obs.Observe(dur.Seconds())
}

// ObserveLeadNotificationSendWithTraceparent records worker send performance and, when possible,
// attaches a trace exemplar (trace_id) to the duration histogram.
//
// result should be a stable low-cardinality value, e.g. "ok" or "error".
func ObserveLeadNotificationSendWithTraceparent(channel, result string, dur time.Duration, traceparent string) {
	Init()
	ch := strings.TrimSpace(strings.ToLower(channel))
	if ch == "" {
		ch = "unknown"
	}
	res := strings.TrimSpace(strings.ToLower(result))
	if res == "" {
		res = "unknown"
	}

	leadNotificationSendTotal.WithLabelValues(ch, res).Inc()
	if dur <= 0 {
		return
	}

	obs := leadNotificationSendDurationSeconds.WithLabelValues(ch, res)
	if eo, ok := obs.(prometheus.ExemplarObserver); ok {
		if tid := traceIDFromTraceparent(traceparent); tid != "" {
			eo.ObserveWithExemplar(dur.Seconds(), prometheus.Labels{"trace_id": tid})
			return
		}
	}
	obs.Observe(dur.Seconds())
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

// ObserveWebVital records a Core Web Vitals (RUM) measurement.
//
// The input value is expected to be in milliseconds for LCP/INP (as emitted by web-vitals),
// and unitless for CLS.
//
// Labels are intentionally low-cardinality: do NOT include URL or user identifiers.
func ObserveWebVital(metricName string, value float64, deviceType string, rating string) {
	Init()

	metric := strings.ToUpper(strings.TrimSpace(metricName))
	device := normalizeDeviceType(deviceType)
	rate := normalizeRating(rating)

	webVitalsReportsTotal.WithLabelValues(metric, device, rate).Inc()

	switch metric {
	case "LCP":
		// web-vitals reports LCP in milliseconds.
		webVitalsLCPSeconds.WithLabelValues(device).Observe(value / 1000.0)
	case "INP":
		// web-vitals reports INP in milliseconds.
		webVitalsINPSeconds.WithLabelValues(device).Observe(value / 1000.0)
	case "CLS":
		webVitalsCLS.WithLabelValues(device).Observe(value)
	default:
		// Unknown metric: counted, but not histogrammed.
		return
	}
}

// IncWebsiteEvent increments a low-cardinality website analytics event counter.
func IncWebsiteEvent(eventName string, deviceType string) {
	Init()

	event := strings.TrimSpace(eventName)
	if event == "" {
		event = "unknown"
	}
	websiteEventsTotal.WithLabelValues(event, normalizeDeviceType(deviceType)).Inc()
}

func normalizeDeviceType(v string) string {
	s := strings.TrimSpace(strings.ToLower(v))
	switch s {
	case "mobile", "desktop":
		return s
	default:
		return "unknown"
	}
}

func normalizeRating(v string) string {
	s := strings.TrimSpace(strings.ToLower(v))
	switch s {
	case "good":
		return "good"
	case "needs-improvement", "needs_improvement":
		return "needs_improvement"
	case "poor":
		return "poor"
	default:
		return "unknown"
	}
}
