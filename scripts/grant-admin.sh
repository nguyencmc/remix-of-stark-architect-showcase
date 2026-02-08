#!/bin/bash
# Grant admin role to user via Supabase API

SUPABASE_URL="https://lszogzmfinrzfzqkpral.supabase.co"
SERVICE_ROLE_KEY="$1"

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "Usage: $0 <service_role_key>"
    exit 1
fi

# First, find the user ID
echo "Finding user ID for nguyenvnu1.uet@gmail.com..."

USER_ID=$(curl -s "${SUPABASE_URL}/rest/v1/rpc/get_user_id_by_email" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"email": "nguyenvnu1.uet@gmail.com"}')

echo "User ID: $USER_ID"

# Insert admin role
echo "Granting admin role..."
curl -s "${SUPABASE_URL}/rest/v1/user_roles" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{\"user_id\": ${USER_ID}, \"role\": \"admin\"}"

echo ""
echo "Done!"
