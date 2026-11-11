#!/usr/bin/env bash
set -euo pipefail

# Verify pg_restore into a temporary NeonDB branch or test database (BUILD-GUIDE.md 9.5)
if [[ -z "${TEST_RESTORE_DATABASE_URI:-}" || -z "${BACKUP_DUMP_PATH:-}" ]]; then
  echo "Usage: TEST_RESTORE_DATABASE_URI=postgresql://... BACKUP_DUMP_PATH=/path/to/dump ./scripts/restore-test.sh" >&2
  exit 1
fi

echo "[restore-test] Restoring ${BACKUP_DUMP_PATH} into test database..."
pg_restore --clean --if-exists --no-owner --no-acl -d "${TEST_RESTORE_DATABASE_URI}" "${BACKUP_DUMP_PATH}"
echo "[restore-test] Restore verified."
