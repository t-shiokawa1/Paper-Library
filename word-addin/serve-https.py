#!/usr/bin/env python3
"""Tiny HTTPS static server for local Word add-in testing.

Serves this folder at https://localhost:3000 so Word can load taskpane.html.
Run `bash make-cert.sh` once first to create localhost-cert.pem / localhost-key.pem.

    python3 serve-https.py

Office requires HTTPS; a plain http server will not work.
"""
import http.server, ssl, os, sys

PORT = 3000
HERE = os.path.dirname(os.path.abspath(__file__))
CERT = os.path.join(HERE, "localhost-cert.pem")
KEY = os.path.join(HERE, "localhost-key.pem")

if not (os.path.exists(CERT) and os.path.exists(KEY)):
    sys.exit("Missing cert. Run:  bash make-cert.sh")

os.chdir(HERE)

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Office loads the pane cross-origin; allow it and disable caching while testing.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(certfile=CERT, keyfile=KEY)
httpd = http.server.HTTPServer(("127.0.0.1", PORT), Handler)
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
print(f"Serving {HERE}\n  https://localhost:{PORT}/taskpane.html\nCtrl+C to stop.")
httpd.serve_forever()
