from flask import Flask, request, send_from_directory, session
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv("key.env")

app = Flask(__name__)

database_url = os.environ.get("DATABASE_URL", "sqlite:///portflow.db")
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY"),
    SESSION_COOKIE_NAME="portflow_session",
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=True,      # ✅ must be True on HTTPS (Render uses HTTPS)
    SESSION_COOKIE_HTTPONLY=True,
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ✅ Updated CORS to include your Render domain
CORS(app,
     supports_credentials=True,
     origins=[
         "http://127.0.0.1:5000",
         "http://127.0.0.1:5500",
         "https://panthoflow.onrender.com"
     ],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
     expose_headers=["Set-Cookie"],
     max_age=3600)

db = SQLAlchemy(app)

# ✅ Single route for /
@app.route('/')
def home():
    return send_from_directory('login_signin', 'index.html')

# Serve login_signin folder (for signup.html etc.)
@app.route('/login_signin/<path:filename>')
def serve_login(filename):
    return send_from_directory('login_signin', filename)

# Serve HTML files
@app.route('/html/<path:filename>')
def serve_html(filename):
    return send_from_directory('html', filename)

# Serve CSS files
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

# Serve JS files
@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

# Serve images
@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

@app.route('/debug-files')
def debug_files():
    import os
    # Shows all files and folders from where Flask is running
    result = []
    for item in os.listdir('.'):
        result.append(item)
    return "<br>".join(sorted(result))


@app.after_request
def after_request(response):
    print(f"\n{'='*60}")
    print(f"📤 RESPONSE for: {request.method} {request.path}")
    print(f"🍪 Cookies being set: {response.headers.getlist('Set-Cookie')}")
    print(f"📦 Session after request: {dict(session)}")
    print(f"{'='*60}\n")
    return response

@app.before_request
def log_session_debug():
    print(f"\n{'='*60}")
    print(f"🔍 REQUEST: {request.method} {request.path}")
    print(f"🍪 Cookies received: {request.cookies}")
    print(f"📦 Session data: {dict(session)}")
    print(f"{'='*60}\n")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)