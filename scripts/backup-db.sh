#!/usr/bin/env bash
set -euo pipefail

# Nightly NeonDB logical backup to Cloudflare R2 (BUILD-GUIDE.md 9.5)
if [[ -z "${DIRECT_DATABASE_URI:-}" ]]; then
  echo "Error: DIRECT_DATABASE_URI is required for pg_dump." >&2
  exit 1
fi

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_FILE="/tmp/shena-db-${TIMESTAMP}.dump"

echo "[backup] Dumping NeonDB database to ${BACKUP_FILE}..."
pg_dump --format=custom --no-owner --no-acl "${DIRECT_DATABASE_URI}" -f "${BACKUP_FILE}"

if [[ -n "${R2_BACKUP_BUCKET:-}" && -n "${R2_ENDPOINT:-}" ]]; then
  echo "[backup] Uploading ${BACKUP_FILE} to s3://${R2_BACKUP_BUCKET}/db/${TIMESTAMP}.dump..."
  aws s3 cp "${BACKUP_FILE}" "s3://${R2_BACKUP_BUCKET}/db/${TIMESTAMP}.dump" --endpoint-url "${R2_ENDPOINT}"
fi

rm -f "${BACKUP_FILE}"
echo "[backup] Completed."
