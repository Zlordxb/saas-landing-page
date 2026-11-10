#!/usr/bin/env bash
# Runs the database tests on plain PostgreSQL (16 or newer):
#   1. creates a throwaway database,
#   2. adds a small stand-in for Supabase's roles and auth schema,
#   3. applies every migration in order,
#   4. runs supabase/tests/security.test.sql.
# Connection settings come from the usual PG* variables (PGHOST, PGUSER, PGPASSWORD...).
set -euo pipefail

cd "$(dirname "$0")/.."
DB="bookflow_test_$$"

cleanup() { dropdb --if-exists "$DB" >/dev/null 2>&1 || true; }
trap cleanup EXIT

createdb "$DB"
run() { psql --dbname "$DB" --no-psqlrc --quiet --set ON_ERROR_STOP=1 "$@"; }

run --file supabase/tests/supabase-stub.sql
for migration in supabase/migrations/*.sql; do
  echo "Applying $(basename "$migration")"
  run --file "$migration"
done
run --file supabase/tests/security.test.sql
