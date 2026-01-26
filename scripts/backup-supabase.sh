#!/bin/bash

# Supabase Lead Backup Script
# Paket A §14: Backup & restore Supabase — playbook minimal
#
# Usage: ./backup-supabase.sh
# Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LEAD_API_ADMIN_TOKEN
#
# This script exports all leads from Supabase as a CSV file.
# Store backups securely outside the repository.

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/../backups"
DATE_STR=$(date +"%Y-%m-%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/leads-backup-${DATE_STR}.csv"

# Load environment variables from .env if it exists
if [ -f "${SCRIPT_DIR}/../frontend/.env" ]; then
    set -a
    source "${SCRIPT_DIR}/../frontend/.env"
    set +a
fi

# Validate required env vars
if [ -z "$LEAD_API_ADMIN_TOKEN" ]; then
    echo "Error: LEAD_API_ADMIN_TOKEN is not set"
    echo "Please set it in your environment or frontend/.env file"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SITE_URL" ]; then
    SITE_URL="http://localhost:3000"
else
    SITE_URL="$NEXT_PUBLIC_SITE_URL"
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Make API request to export leads
echo "Exporting leads from ${SITE_URL}..."
echo ""

HTTP_CODE=$(curl -s -w "%{http_code}" -o "$BACKUP_FILE" \
    -H "X-Admin-Token: ${LEAD_API_ADMIN_TOKEN}" \
    "${SITE_URL}/api/leads/export")

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Backup successful!"
    echo "   File: ${BACKUP_FILE}"
    echo "   Size: $(wc -c < "$BACKUP_FILE" | tr -d ' ') bytes"
    echo ""
    echo "First 5 lines:"
    head -5 "$BACKUP_FILE"
else
    echo "❌ Backup failed with HTTP status: ${HTTP_CODE}"
    cat "$BACKUP_FILE"
    rm -f "$BACKUP_FILE"
    exit 1
fi

echo ""
echo "--- Backup Policy Reminder ---"
echo "• Store backups in a secure location outside the repository"
echo "• Retention: 30 days recommended"
echo "• Test restore procedure periodically"
