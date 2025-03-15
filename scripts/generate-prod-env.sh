#!/bin/bash

# Exit on error
set -e

echo "🔐 Generating secure production environment variables..."

# Function to generate a secure random string
generate_secure_string() {
    openssl rand -base64 32 | tr -d '/+' | cut -c1-32
}

# Create backup of existing production env if it exists
if [ -f .env.production ]; then
    echo "📑 Creating backup of existing .env.production..."
    cp .env.production ".env.production.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Generate secure values
DB_PASSWORD=$(generate_secure_string)
SESSION_SECRET=$(generate_secure_string)

# Replace sensitive values in .env.production
sed -i "s/CHANGE_THIS_TO_A_SECURE_PASSWORD/$DB_PASSWORD/g" .env.production
sed -i "s/CHANGE_THIS_TO_A_SECURE_SECRET/$SESSION_SECRET/g" .env.production

echo "✅ Production environment variables generated successfully!"
echo ""
echo "⚠️ IMPORTANT: Please save these credentials securely:"
echo "Database Password: $DB_PASSWORD"
echo "Session Secret: $SESSION_SECRET"
echo ""
echo "These values have been automatically updated in .env.production"
echo "Make sure to update your database with the new credentials!"
echo ""
echo "🔒 Security Checklist:"
echo "1. Save these credentials in a secure password manager"
echo "2. Update database user password"
echo "3. Update any external services that need these credentials"
echo "4. Store a backup of these credentials in your company's secure vault"
echo ""
echo "❗ Delete this output after saving the credentials securely!"