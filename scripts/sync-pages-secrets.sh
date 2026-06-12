#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT:-bowlerproshop-mvp}"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-a0c9f7df7dc2450542b92bf137c59cbd}"
ENV_FILE="${ION_ENV_FILE:-.env}"
GEMINI_MODEL_VALUE="${GEMINI_MODEL:-gemini-2.5-flash}"

extract_env_value() {
  local key="$1"
  node - "$ENV_FILE" "$key" <<'NODE'
const fs = require("node:fs");
const [file, key] = process.argv.slice(2);
if (!fs.existsSync(file)) process.exit(2);
const env = fs.readFileSync(file, "utf8");
const line = env.split(/\r?\n/).find((entry) => entry.startsWith(`${key}=`));
if (!line) process.exit(3);
let value = line.slice(key.length + 1).trim();
if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
  value = value.slice(1, -1);
}
process.stdout.write(value);
NODE
}

if ! extract_env_value GEMINI_API_KEY >/dev/null; then
  echo "Missing GEMINI_API_KEY in ${ENV_FILE}" >&2
  exit 1
fi

echo "Syncing Pages secrets for ${PROJECT_NAME} in account ${ACCOUNT_ID}."
echo "Secret values are not printed."

extract_env_value GEMINI_API_KEY |
  CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" npx wrangler pages secret put GEMINI_API_KEY --project-name="$PROJECT_NAME"

printf '%s' "$GEMINI_MODEL_VALUE" |
  CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" npx wrangler pages secret put GEMINI_MODEL --project-name="$PROJECT_NAME"

CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" npx wrangler pages secret list --project-name="$PROJECT_NAME"
