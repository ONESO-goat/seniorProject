# run.py

from backend_flask.config import app, db
from flask import send_from_directory


# THIS IS THE KEY LINE - Import routes so Flask knows about them!
import backend_flask.user_routes
import backend_flask.post_routes
import backend_flask.main_page_routes


@app.route('/')
def home():
    return send_from_directory('login_signin', 'index.html')

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

with app.app_context():
    db.create_all()


print("APP ID:", id(app))
if __name__ == "__main__":
    print("\n🚀 Starting server on http://127.0.0.1:5000")
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.rule} {rule.methods}")
    app.run(debug=True, port=5000)