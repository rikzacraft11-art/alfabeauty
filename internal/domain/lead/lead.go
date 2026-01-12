package lead

import (
	"strings"
	"time"

	"github.com/google/uuid"
)

type Lead struct {
	ID             uuid.UUID
	CreatedAt      time.Time
	// IdempotencyKeyHash is a SHA-256 hex hash of the client-supplied Idempotency-Key.
	// We store only the hash to avoid persisting the raw key.
	IdempotencyKeyHash string
	// Partner profiling fields (Paket A §5).
	BusinessName      string
	ContactName       string
	PhoneWhatsApp     string
	City              string
	SalonType         string
	Consent           bool
	ChairCount        *int
	Specialization    string
	CurrentBrandsUsed string
	MonthlySpendRange string

	// Additional contact/notes.
	Email   string
	Message string
	PageURLInitial string
	PageURLCurrent string
	UserAgent      string
	IPAddress      string
	Honeypot       string // Honeypot field for spam detection - should be empty for legitimate submissions
}

const (
	maxBusinessNameLen      = 120
	maxContactNameLen       = 80
	maxPhoneWhatsAppLen     = 20
	maxCityLen              = 80
	maxSalonTypeLen         = 16
	maxEmailLen             = 254
	maxMessageLen           = 2000
	maxSpecializationLen    = 200
	maxCurrentBrandsUsedLen = 200
	maxMonthlySpendRangeLen = 80
	maxPageURLLen           = 2048
	maxUserAgentLen         = 512
	maxIPLen                = 64
	maxIdempotencyHashLen   = 64
	maxHoneypotLen          = 200
)

func (l *Lead) Normalize() {
	l.BusinessName = strings.TrimSpace(l.BusinessName)
	l.ContactName = strings.TrimSpace(l.ContactName)
	l.PhoneWhatsApp = normalizePhoneWhatsApp(l.PhoneWhatsApp)
	l.City = strings.TrimSpace(l.City)
	l.SalonType = strings.TrimSpace(strings.ToUpper(l.SalonType))
	if l.ChairCount != nil {
		v := *l.ChairCount
		if v <= 0 {
			// Treat non-positive values as unset.
			l.ChairCount = nil
		}
	}
	l.Specialization = strings.TrimSpace(l.Specialization)
	l.CurrentBrandsUsed = strings.TrimSpace(l.CurrentBrandsUsed)
	l.MonthlySpendRange = strings.TrimSpace(l.MonthlySpendRange)

	l.Email = strings.TrimSpace(strings.ToLower(l.Email))
	l.Message = strings.TrimSpace(l.Message)
	l.IdempotencyKeyHash = strings.TrimSpace(strings.ToLower(l.IdempotencyKeyHash))
	l.PageURLInitial = strings.TrimSpace(l.PageURLInitial)
	l.PageURLCurrent = strings.TrimSpace(l.PageURLCurrent)
	l.UserAgent = strings.TrimSpace(l.UserAgent)
	l.IPAddress = strings.TrimSpace(l.IPAddress)
	l.Honeypot = strings.TrimSpace(l.Honeypot)
}

func (l Lead) Validate() error {
	// Baseline validation aligned to Paket A §5 (Become Partner profiling).
	if l.Honeypot != "" {
		// Treat as bot. Caller may decide to drop silently.
		return ErrSpam
	}
	if l.BusinessName == "" {
		return ErrInvalid("business_name is required")
	}
	if l.ContactName == "" {
		return ErrInvalid("contact_name is required")
	}
	if l.PhoneWhatsApp == "" {
		return ErrInvalid("phone_whatsapp is required")
	}
	if l.City == "" {
		return ErrInvalid("city is required")
	}
	if !l.Consent {
		return ErrInvalid("consent is required")
	}
	if !isValidSalonType(l.SalonType) {
		return ErrInvalid("salon_type is invalid")
	}

	// Field length limits (defense-in-depth).
	if len(l.BusinessName) > maxBusinessNameLen {
		return ErrInvalid("business_name too long")
	}
	if len(l.ContactName) > maxContactNameLen {
		return ErrInvalid("contact_name too long")
	}
	if len(l.PhoneWhatsApp) > maxPhoneWhatsAppLen {
		return ErrInvalid("phone_whatsapp too long")
	}
	if len(l.City) > maxCityLen {
		return ErrInvalid("city too long")
	}
	if len(l.SalonType) > maxSalonTypeLen {
		return ErrInvalid("salon_type too long")
	}
	if len(l.Email) > maxEmailLen {
		return ErrInvalid("email too long")
	}
	if len(l.Message) > maxMessageLen {
		return ErrInvalid("message too long")
	}
	if len(l.Specialization) > maxSpecializationLen {
		return ErrInvalid("specialization too long")
	}
	if len(l.CurrentBrandsUsed) > maxCurrentBrandsUsedLen {
		return ErrInvalid("current_brands_used too long")
	}
	if len(l.MonthlySpendRange) > maxMonthlySpendRangeLen {
		return ErrInvalid("monthly_spend_range too long")
	}
	if len(l.PageURLInitial) > maxPageURLLen {
		return ErrInvalid("page_url_initial too long")
	}
	if len(l.PageURLCurrent) > maxPageURLLen {
		return ErrInvalid("page_url_current too long")
	}
	if len(l.UserAgent) > maxUserAgentLen {
		return ErrInvalid("user_agent too long")
	}
	if len(l.IPAddress) > maxIPLen {
		return ErrInvalid("ip_address too long")
	}
	if len(l.IdempotencyKeyHash) > maxIdempotencyHashLen {
		return ErrInvalid("idempotency_key_hash too long")
	}
	if len(l.Honeypot) > maxHoneypotLen {
		return ErrInvalid("company too long")
	}
	return nil
}

func isValidSalonType(v string) bool {
	switch strings.ToUpper(strings.TrimSpace(v)) {
	case "SALON", "BARBER", "BRIDAL", "UNISEX", "OTHER":
		return true
	default:
		return false
	}
}

// normalizePhoneWhatsApp normalizes a WhatsApp/phone number to an E.164-like form.
// Spec requirement is lenient: accept +62..., 62..., or 08... and normalize.
func normalizePhoneWhatsApp(input string) string {
	trimmed := strings.TrimSpace(input)
	if trimmed == "" {
		return ""
	}

	// Keep digits only.
	digits := make([]byte, 0, len(trimmed))
	for i := 0; i < len(trimmed); i++ {
		c := trimmed[i]
		if c >= '0' && c <= '9' {
			digits = append(digits, c)
		}
	}
	if len(digits) == 0 {
		return ""
	}

	// Indonesia-friendly normalization.
	if digits[0] == '0' {
		digits = append([]byte{'6', '2'}, digits[1:]...)
	}
	if len(digits) >= 10 && len(digits) <= 15 {
		// Store with '+' prefix.
		return "+" + string(digits)
	}
	return ""
}
