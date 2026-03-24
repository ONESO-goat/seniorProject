# main_page_routes.py

from backend_flask.config import app, db
from flask import jsonify, request, session
from datetime import datetime, date
import uuid
from sqlalchemy import desc
from sqlalchemy import or_, func
from werkzeug.security import check_password_hash
from  backend_flask.validate_user_info import username_check, aboutMe_des, password_check, description_check, hash_password
from backend_flask.validate_content import validate_action_word
from backend_flask.models import Users,Card, Follow

ERROR = "ERROR"
MESSAGE = "MESSAGE"
ID = 'ID'

@app.route("/users/points/get", methods=["GET"])
def get_users_points_ranked():
    box = []
    
    try:
        users = Users.query.order_by(desc(Users.points)).all()

        for i, user in enumerate(users, start=1):
            box.append({
                'rank': i,
                'username': user.username,
                "id": user.id,
                'actionWord': user.action_word,
                "joined_at": str(user.member_at),
                "email": user.email,
                "projects": user.content,
                'followers': user.followers,
                'points': user.points,
                'shortId': f'{user.username.lower()}{str(user.id)[:8]}'
            })

        return jsonify({"MESSAGE": 'SUCCESS', 'STUFF': box}), 200
    
    except Exception as e:
        return jsonify({"ERROR": "Unknown error when getting user data", "details": str(e)}), 500
    





@app.route("/user/following/get", methods=["GET"])
def get_users_following():
    box = []
    
    if "user_id" not in session:
        return jsonify({"MESSAGE": 'SUCCESS', 'FOLLOWING': False}), 200
    
    the_user = Users.query.filter_by(id=session['user_id']).first()
    if not the_user:
        return jsonify({"ERROR": "User not found"}), 404
    
    following = Follow.query.filter_by(follower_id=the_user.id).all()

    if not following:
        return jsonify({"MESSAGE": 'SUCCESS', 'FOLLOWING': False}), 200
    

    try:
        results = db.session.query(Follow, Users).join(
            Users, Follow.following_id == Users.id
        ).filter(Follow.follower_id == the_user.id).all()

        for data, current_user in results:
            box.append({
                'username': current_user.username,
                "id": current_user.id,
                'actionWord': current_user.action_word,
                "joined_at": str(current_user.member_at),
                "email": current_user.email,
                "projects": current_user.content,
                'followers': current_user.followers,
                'are_friends': bool(data.friends),
                'points': current_user.points,
                'shortId': current_user.short_id
            })

        return jsonify({"MESSAGE": "SUCCESS", 'FOLLOWING': True, "STUFF": box}), 200

    except Exception as e:
        return jsonify({"ERROR": "Unknown error", "details": str(e)}), 500  


@app.route("/user/friends/get", methods=["GET"])
def get_friends():
    box = []
    
    if "user_id" not in session:
        return
    
    the_user = Users.query.filter_by(id=session['user_id']).first()
    if not the_user:
        return 
    
    following = Follow.query.filter_by(following_id=the_user.id).all()

    if not following:
        return jsonify({"MESSAGE": 'SUCCESS', 'FOLLOWING': False, 'SET': None}), 200
    following = True
    try:
        results = db.session.query(Follow, Users).join(
            Users, Follow.following_id == Users.id
        ).filter(Follow.follower_id == the_user.id, Follow.friends == True).all()

        for data, current_user in results:
            box.append({
                'username': current_user.username,
                "id": current_user.id,
                'actionWord': current_user.action_word,
                "joined_at": str(current_user.member_at),
                "email": current_user.email,
                "projects": current_user.content,
                'followers': current_user.followers,
                'are_friends': bool(data.friends),
                'points': current_user.points,
                'shortId': current_user.short_id
            })

        if len(box) == 0:
            following = False
        return jsonify({"MESSAGE": "SUCCESS", 'FOLLOWING': following, "STUFF": box}), 200

    except Exception as e:
        return jsonify({"ERROR": "Unknown error", "details": str(e)}), 500  



