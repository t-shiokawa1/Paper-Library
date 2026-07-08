#!/usr/bin/env bash
# Create a self-signed TLS certificate for https://localhost (for local add-in testing).
# Run once:  bash make-cert.sh
set -e
cd "$(dirname "$0")"

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout localhost-key.pem -out localhost-cert.pem \
  -days 825 -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo
echo "Created localhost-cert.pem and localhost-key.pem."
echo
echo "Next: trust the cert so Word will load the pane (macOS):"
echo "  sudo security add-trusted-cert -d -r trustRoot \\"
echo "    -k /Library/Keychains/System.keychain localhost-cert.pem"
echo
echo "Then run:  python3 serve-https.py"
