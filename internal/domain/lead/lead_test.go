package lead

import "testing"

func TestLeadValidate_LengthLimits(t *testing.T) {
	base := Lead{
		BusinessName:  "Biz",
		ContactName:   "Contact",
		PhoneWhatsApp: "+6281111111111",
		City:          "Jakarta",
		SalonType:     "SALON",
		Consent:       true,
	}

	cases := []struct {
		name string
		mut  func(*Lead)
	}{
		{
			name: "business_name too long",
			mut: func(l *Lead) { l.BusinessName = repeat("a", maxBusinessNameLen+1) },
		},
		{
			name: "contact_name too long",
			mut: func(l *Lead) { l.ContactName = repeat("a", maxContactNameLen+1) },
		},
		{
			name: "phone_whatsapp too long",
			mut: func(l *Lead) { l.PhoneWhatsApp = repeat("1", maxPhoneWhatsAppLen+1) },
		},
		{
			name: "city too long",
			mut: func(l *Lead) { l.City = repeat("a", maxCityLen+1) },
		},
		{
			name: "email too long",
			mut: func(l *Lead) { l.Email = repeat("a", maxEmailLen+1) },
		},
		{
			name: "message too long",
			mut: func(l *Lead) { l.Message = repeat("a", maxMessageLen+1) },
		},
		{
			name: "specialization too long",
			mut: func(l *Lead) { l.Specialization = repeat("a", maxSpecializationLen+1) },
		},
		{
			name: "current_brands_used too long",
			mut: func(l *Lead) { l.CurrentBrandsUsed = repeat("a", maxCurrentBrandsUsedLen+1) },
		},
		{
			name: "monthly_spend_range too long",
			mut: func(l *Lead) { l.MonthlySpendRange = repeat("a", maxMonthlySpendRangeLen+1) },
		},
		{
			name: "page_url_initial too long",
			mut: func(l *Lead) { l.PageURLInitial = repeat("a", maxPageURLLen+1) },
		},
		{
			name: "page_url_current too long",
			mut: func(l *Lead) { l.PageURLCurrent = repeat("a", maxPageURLLen+1) },
		},
		{
			name: "user_agent too long",
			mut: func(l *Lead) { l.UserAgent = repeat("a", maxUserAgentLen+1) },
		},
		{
			name: "ip_address too long",
			mut: func(l *Lead) { l.IPAddress = repeat("a", maxIPLen+1) },
		},
		{
			name: "idempotency_key_hash too long",
			mut: func(l *Lead) { l.IdempotencyKeyHash = repeat("a", maxIdempotencyHashLen+1) },
		},
		{
			name: "company too long",
			mut: func(l *Lead) { l.Honeypot = repeat("a", maxHoneypotLen+1) },
		},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			l := base
			tc.mut(&l)
			l.Normalize()
			if err := l.Validate(); err == nil {
				t.Fatalf("expected error")
			}
		})
	}
}

func repeat(s string, n int) string {
	if n <= 0 {
		return ""
	}
	b := make([]byte, 0, len(s)*n)
	for i := 0; i < n; i++ {
		b = append(b, s...)
	}
	return string(b)
}
