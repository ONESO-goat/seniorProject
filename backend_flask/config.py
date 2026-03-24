# config.py
from flask import Flask, request, send_from_directory, session
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv("key.env")

app = Flask(__name__)


app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY"),
    SESSION_COOKIE_NAME="portflow_session",
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False,     # localhost only
    SESSION_COOKIE_HTTPONLY=True,
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
)


# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

print("CONFIG APP ID:", id(app))


# CORS Configuration - MUST come after app config
CORS(app, 
     supports_credentials=True,
     origins=["http://127.0.0.1:5000", "http://127.0.0.1:5500"],
     resources={r"/*": {"origins": ["http://127.0.0.1:5500", "http://127.0.0.1:5000"]}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
     expose_headers=["Set-Cookie"],
     max_age=3600)

# Initialize database
db = SQLAlchemy(app)

# Add this response handler to ensure cookies are sent properly
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ["http://127.0.0.1:5000", "http://127.0.0.1:5500"]:
        #response.headers['Access-Control-Allow-Origin'] = origin
        #response.headers['Access-Control-Allow-Credentials'] = 'true'
        #response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        #response.headers['Access-Control-Allow-Methods'] = "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        pass
    #See what cookies are being set
    print(f"\n{'='*60}")
    print(f"📤 RESPONSE for: {request.method} {request.path}")
    print(f"🍪 Cookies being set: {response.headers.getlist('Set-Cookie')}")
    print(f"📦 Session after request: {dict(session)}")
    print(f"{'='*60}\n")
    return response

# config.py — add this route to serve your frontend
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('../frontend', filename)

@app.route('/html/<path:filename>')
def serve_html(filename):
    return send_from_directory('../html', filename)

@app.route('/')
def index():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append(f"{rule.endpoint}: {rule.rule} [{', '.join(str(rule.methods))}]")
    return "<br>".join(routes)


@app.before_request
def log_session_debug():
    """Debug middleware to see what's happening with sessions"""
    print(f"\n{'='*60}")
    print(f"🔍 REQUEST: {request.method} {request.path}")
    print(f"🍪 Cookies received: {request.cookies}")
    print(f"📦 Session data: {dict(session)}")
    print(f"🔑 Session ID: {session.sid if hasattr(session, 'sid') else 'N/A'}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    app.run(debug=True, port=5000)