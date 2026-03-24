# user_routes.py

from backend_flask.config import app, db
from flask import jsonify, request, session
from datetime import datetime, date
import uuid
from sqlalchemy import or_, func
from werkzeug.security import check_password_hash
from  backend_flask.validate_user_info import _check_friendship, username_check, aboutMe_des, password_check, description_check, hash_password
from backend_flask.validate_content import validate_action_word
from backend_flask.models import Users,Card, Follow

ERROR = "ERROR"
MESSAGE = "MESSAGE"
ID = 'ID'

@app.route("/auth", methods=["GET"])
def get_Users():
    box = []
    
    try:
        users = Users.query.all()
        for user in users:
            box.append({
                'username': user.username,
                "id":user.id,
                'actionWord': user.action_word,
                "joined_at": str(user.member_at),
                "email": user.email,
                "projects": user.content,
                'followers': user.followers,
                'points': user.points,
                'shortId': f'{user.username.lower()}{user.id[:8]}'
            })
        print(f"DATA: {box}")
        return jsonify({"MESSAGE": 'SUCCESS', 'STUFF': box}), 200
    
    except Exception as e:
        return jsonify({ERROR: "Unknown error when getting user data", "details": str(e)}), 500
    

@app.route("/auth/signup", methods=["POST"])
def create_user():
    print("✅ SIGNUP ROUTE HIT")
    data = request.get_json()
    print(f"📥 Received data: {data}")

    if not data:
        return jsonify({ERROR: "There was an error when grabbing json data"}), 400
    
    username = data.get("username")
    email = data.get("email") or None
    password = data.get("password")
    role = data.get("role")

    if not username or not password or not role:
        return jsonify({ERROR: "Please insert required information."}), 400
    
    usernameLower = username.lower()
    valid, message = username_check(username)
    if not valid:
        return jsonify({ERROR: message}), 400
    
    valid, message = password_check(password)
    if not valid:
        return jsonify({ERROR: message}), 400
    
    if email:
        existing_email = Users.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({ERROR: f"Email is already being used in databse: {email}"}), 409
 
    encrypt = hash_password(password)
    userId = str(uuid.uuid4())

    print("Before creating user........")
    short_id=f"{usernameLower}{userId[:8]}"
    
    
    description = ''
    action_word = ''
    if (role == 'Business'):
        action_word = 'The Worker'
        description = f'Hey I am {username}, I love to expand my networks and wish to understand the business world further.'

    elif (role == 'Personal'):
        action_word = "The Creator"
        description = f'Hey I am {username}, I love to create and get along with many kinds of people.'
        
    elif (role == 'Education'):
        action_word = "The Scholar"
        description = f'Hey I am {username}, I love to expand my knowledge and wish to learn more about my interest.'
    else:
        print(" X ---- HIT ELSE, ROLE NOT FOUND -----")
        action_word = 'The Founder'
        description = f"Hi I'm {username.capitalize()} love building and expanding my skills in the world."


    new_user = Users(
        id=userId,
        role=role,
        username=username,
        action_word=action_word,
        following_list='',
        used_categories='',
        description=description,
        short_id=short_id,
        points=0,
        followers=0,
        password=encrypt,
        email=email,
        member_at=date.today(),
        about_me=f'Hi, my name is {username.capitalize()}! A fun fact about me is...'
    )
    


    try:
        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = str(new_user.id)
        session['username'] = new_user.username
        session.permanent = True
        print(f"User added to session: {new_user.username}.")
        return jsonify({'MESSAGE': f"({datetime.today()}) NEW USER CREATED: {new_user}", 
                        "username": new_user.username,
                        'DETAILS':{
                            'username': new_user.username,
                            'role': new_user.role,
                            'joined':new_user.member_at,
                            'shortId': new_user.short_id,
                            'email': new_user.email
                            }}), 200
    except Exception as e:
        db.session.rollback()
        print("Failure")
        return jsonify({ERROR: f"Unexpected error: {e}"}), 500

@app.route('/auth/login', methods=["POST"])
def login():
    print("✅ LOGIN ROUTE HIT")
    data = request.get_json()
    if not data:
        return jsonify({"ERROR": 'Data is not found.'}), 400

    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"ERROR": "Username or passsword aren't filled."}), 401
    usernameLower = username.lower()

    user = Users.query.filter(func.lower(Users.username) == usernameLower,).first()

    if not user:
        return jsonify({"ERROR": f"User doesn't exist: {username}."}), 409
    
    attempts = session.get('login_attempts', 0)
    if attempts >= 8:
        return jsonify({"ERROR": "Too many attempts. Try later."}), 429
    
    check = check_password_hash(user.password, password)
    if not check:
        session['login_attempts'] = attempts + 1

        return jsonify({"ERROR": "Username or password are incorrect."}), 400
    
    
    try:

        user.status = 'online'
        db.session.commit()

        session['user_id'] = str(user.id)
        session['username'] = user.username
        session.permanent = True
        session['login_attempts'] = 0
        
        print(f"✅ Login successful: {user.short_id}")
        print(f"✅ Session set: {dict(session)}")
        
        return jsonify({"MESSAGE": f"Welcome back, {user.username}!",
                        "DETAILS": {
                            'username': user.username,
                            'description': user.description,
                            'email': user.email,
                            'cards': [card.to_dict() for card in user.page_content],
                            'role': user.role,
                            'followers': user.followers,
                            'points': user.points,
                            'shortId':user.short_id
                            }}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"ERROR": f"Unexplained error occured when logging user ({user}) in: {e}"}), 500
            
    
@app.route('/auth/logout', methods=['POST'])
def logout():
    if 'user_id' not in session:
        return jsonify({"ERROR": "User not logged into session."}), 401
    
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": "User not found."}), 404
    try:
        user.status = 'offline'
        db.session.commit()
        session.clear()
        return jsonify({"MESSAGE": "Logged out successfully"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"ERROR": "Logout failed"}), 500

@app.route("/user/card/get", methods=["GET"])
def get_user_cards():
    cards_list = []
    if "user_id" not in session:
        return jsonify({"ERROR": "User is not logged in or not in session."}), 400
    
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": "User doesn't exist."}), 404
    

    
    
    cards = Card.query.filter_by(founder_id=user.id).all()
    if not cards:
        return jsonify({"MESSAGE": "User doesnt have cards.", "CARDS": [], 'EMPTY': True}),200
    
    empty = False

    for card in cards:
        cards_list.append({
            'shortId': card.shortId, 
            'title': card.title,
            'description': card.description,
            'category': card.category,
            'image': None   # card has no image column yet either
        })

    
    if len(cards_list) == 0:
        empty = True
        cards_list = []
    try:
        return jsonify({"MESSAGE": 'SUCCESS', "CARDS": cards_list, 'EMPTY': empty}), 200
    except Exception as e:
        return jsonify({"ERROR": "Unexpected error while grabbing cards.", "DETAILS": str(e)}), 500

@app.route("/user/aboutme/get", methods=["GET"])
def get_aboutMe():
    if "user_id" not in session:
        return jsonify({"ERROR": "User not logged in."}), 401
    
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": "User doesnt exist."}), 404
    return jsonify({"MESSAGE": "SUCCESS", 'ABOUT': user.about_me}), 200

@app.route("/user/aboutme/edit", methods=["PATCH", "OPTIONS"])
def edit_aboutMe():

    if request.method == "OPTIONS":
        return "", 200
    
    if "user_id" not in session:
        return jsonify({"ERROR": "User not in session"}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"ERROR": "json couldnt be located."}), 400
    
    description = data.get('description', '')
    valid, error = aboutMe_des(description)
    if not valid:
        return jsonify({"ERROR": error}), 400
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": "User doesnt exist."}), 404
    try:
        user.about_me = description
        db.session.commit()
        return jsonify({"MESSAGE": "SUCCESS", "ABOUT": user.about_me}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Update error: {e}") 
        return jsonify({"ERROR": "Internal server error"}), 500
    











@app.route("/user/template/get", methods=["GET"])
def get_templateData():
    if "user_id" not in session:
        return jsonify({"ERROR": "User not logged in."}), 401
    
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": "User doesnt exist."}), 404
    return jsonify({"MESSAGE": "SUCCESS", 
                    'SET': {"action_word": user.action_word,
                            'description': user.description}}), 200

@app.route("/user/frontpage/edit", methods=["PATCH", "OPTIONS"])
def add_templateData():

    if request.method == "OPTIONS":
        return "", 200
    
    if "user_id" not in session:
        return jsonify({"ERROR": "User not in session"}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"ERROR": "json couldnt be located."}), 400
    
    description = data.get('description', '')
    actionWord = data.get("actionWord", '')

    valid, error = aboutMe_des(description)
    if not valid:
        return jsonify({"ERROR": error}), 400
    valid, error = validate_action_word(actionWord)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": "User doesnt exist."}), 404
    try:
        user.description = description
        user.action_word = actionWord
        db.session.commit()
        return jsonify({"MESSAGE": "SUCCESS", 
                        "SET": {'actionWord': user.action_word, 
                                'description': user.description}}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Update error: {e}") 
        return jsonify({"ERROR": "Internal server error"}), 500

@app.route("/user/get/<short_id>", methods=["GET"])
def get_certain_user(short_id):
    #id_fragment = short_id[:8]
    user = Users.query.filter_by(short_id=short_id).first() 
    if not user:
        return jsonify({"ERROR": "User doesn't exist."}), 404
    
    owner_check = False

    if user.id == session['user_id']:
        owner_check = True

    user_content = Card.query.filter_by(founder_shortId=short_id).all()
    
    empty = False
    stuff = []
    if user_content:
        for content in user_content:
            stuff.append({
                'id': content.id,
                'title': content.title,
                'category': content.category,
                'shortId': content.shortId,
                'header': content.header,
                'description': content.description,
                'mini_description': content.mini_description,
                'founder_id': content.founder_id,
                'image': content.image,
                'created': content.created_at 
            })
    

    if len(stuff) == 0:
        empty = True

    return jsonify({"MESSAGE": "SUCCESS",
                    "USER":{
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                        'shortId': short_id,
                        'action_word': user.action_word,
                        'page_description': user.description,
                        'about_me': user.about_me,
                        'followers': user.followers,
                        'points': user.points
                    },
                    'CARDS': stuff,
                    'OWNER': owner_check, 
                    'EMPTY': empty}), 200

@app.route("/user/get/id", methods=['GET'])
def get_id_from_user():
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": 'User doesnt exist'}), 404
    return jsonify({"MESSAGE": 'SUCCESS', 'SET':{
                                                'ID': user.id, 
                                                'SHORT':user.short_id}}), 200


@app.route("/user/aboutme/get/<short_id>", methods=['GET'])
def aboutmeGet(short_id):
    if not short_id:
        return jsonify({"ERROR": 'ID was not found.'}), 400
    
    user = Users.query.filter_by(short_id=short_id).first()
    if not user:
        return jsonify({"ERROR": 'User doesnt exist'}), 404
    
    owner = False
    if user.id == session['user_id']:
        owner = True

    return jsonify({"MESSAGE": "SUCCESS", 'ABOUT': user.about_me, 'OWNER': owner}), 200


@app.route("/user/follow/<short_id>", methods=['PATCH'])
def follow_user(short_id):
    if "user_id" not in session:
        return jsonify({"ERROR":"User not logged in."}), 401
    
    if not short_id:
        return jsonify({"ERROR": "No user id found during following process"}), 400
    
    user_being_followed = Users.query.filter_by(short_id=short_id).first()
    if not user_being_followed:
       return jsonify({"ERROR":"User not found."}), 400
    
    if user_being_followed.id == session['user_id']:
        return jsonify({"ERROR": 'Cannot follow yourself.'}),400
    
    user_whos_following = Users.query.filter_by(id=session['user_id']).first()
    if not user_whos_following:
        return jsonify({"ERROR":"User not found."}), 400
    existing = Follow.query.filter_by(
        follower_id=session['user_id'],
        following_id=user_being_followed.id
    ).first()

    try:
        if existing:
            c = f' {user_being_followed.id}'
            user_whos_following.following_list = user_whos_following.following_list.replace(c, '')
            user_being_followed.followers -= 1
            db.session.delete(existing)
            db.session.commit()
            return jsonify({"MESSAGE":"Unfollowed", 'FOLLOWING': False}), 200
        
        else:
        
            c = f' {user_being_followed.id}'
            
            user_whos_following.following_list += c
            user_being_followed.followers += 1 
            new_follow = Follow(
                follower_id=session['user_id'],
                following_id=user_being_followed.id
            )
            db.session.add(new_follow)
            _check_friendship(userId=session['user_id'], otherUserId=user_being_followed.id)
            db.session.commit()
            return jsonify({"MESSAGE":f"User ({user_whos_following.username}) successfully follows {user_being_followed.username}", 'FOLLOWING': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"ERROR":f"Unexpected server error during following process: {e}"}), 500



@app.route("/user/follow/check/<short_id>", methods=['GET'])
def check_follow(short_id):
    if "user_id" not in session:
        return jsonify({"FOLLOWING":False}), 200
    
    if not short_id:
        return jsonify({"ERROR": "No user id found during following process"}), 400
    
    target = Users.query.filter_by(short_id=short_id).first()
    
    if not target:
       return jsonify({"ERROR":"User not found."}), 404
    
    exist = Follow.query.filter_by(
        follower_id=session['user_id'],
        following_id=target.id
    ).first()

    return jsonify({"FOLLOWING": exist is not None}), 200
    

if __name__ == '__main__':
    get_user_cards()