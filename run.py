# run.py

from backend_flask.config import app, db
from flask import send_from_directory
import os

# THIS IS THE KEY LINE - Import routes so Flask knows about them!
import backend_flask.user_routes
import backend_flask.post_routes
import backend_flask.main_page_routes
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def home():
    return send_from_directory(os.path.join(BASE_DIR, 'login_signin'), 'index.html')

@app.route('/login_signin/<path:filename>')
def serve_login(filename):
    return send_from_directory('login_signin', filename)

@app.route('/html/<path:filename>')
def serve_html(filename):
    return send_from_directory('html', filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

if os.environ.get("RENDER") is None:
    with app.app_context():
        db.create_all()


print("APP ID:", id(app))
if __name__ == "__main__":
   
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)