# run.py

from backend_flask.config import app, db

# THIS IS THE KEY LINE - Import routes so Flask knows about them!
import backend_flask.user_routes
import backend_flask.post_routes
import backend_flask.main_page_routes
with app.app_context():
    db.create_all()
print("APP ID:", id(app))
if __name__ == "__main__":
    print("\n🚀 Starting server on http://127.0.0.1:5000")
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.rule} {rule.methods}")
    app.run(debug=True, port=5000)