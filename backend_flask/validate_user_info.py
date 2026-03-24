# validate_user_info.py

from backend_flask.config import db
from  backend_flask.models import Users, Card, Follow
from  backend_flask.forbidden import INVALID_WORDS_
from werkzeug.security import generate_password_hash
import re
from sqlalchemy import func



def password_check(password: str):
    if not password:
        return False, f"[password_check] Invalid data: {password}"
    
    if len(password) < 8 or len(password) > 120:
        return False, "Password falls outside valid range of 8 to 120 characters"
    

    return True, "Password is valid for production"


def username_check(username: str):
    username = username.lower()
    if not username:
        return False, f"[username_check] Invalid data: {username}"
    
    if len(username) < 3 or len(username) > 60:
        return False, "username falls outside valid range of 3 to 60 characters"
    
    
    check_ = Users.query.filter(func.lower(Users.username) == username.lower()).first()
    if check_:
        return False, f"User already inside the platform: {username}"

    for pattern in INVALID_WORDS_ :
        match = _search(pattern, username)
        if match:
            return False, f"Description holds invalid information: {match.group(1)}"
    
    return True, f"Username valid for production: {username}"



def dup_cardCategory(userId, category):
    

    user = Users.query.filter_by(id=userId).first()
    if not user:
        return False, 'User doesnt exist'
    
    data = _recheck_categories(userId=userId)

    if data['CHANGES']:
        user.used_categories = data['STATUS']
        db.session.commit()
        return True, 'valid'
    
    used = user.used_categories
    if category in used.split():
        return False, 'Already have a card under this category'
    return True, 'valid'



def aboutMe_des(des: str):
    des_lower = des.lower()
    for i in des_lower.split():
        if i in INVALID_WORDS_:
            return False, f"Description holds invalid content: {i}"
        
    if len(des_lower) > 600 or len(des_lower) <= 0:
        return False, f"Description falls outside valid range (1-600): {len(des_lower)}."
    
    return True, "Description valid."
    
def font_change(font, username):
    if not font or not username:
        return
    
    user = Users.query.filter_by(username=username).first()
    if not user:
        return
    
    user.introduction_font = font

def description_check(description: str):
    if not description:
        return False, f"[description_check] Invalid data: {description}"
    
    for pattern in INVALID_WORDS_:
        match = _search(pattern, description)
        if match:
            return False, f"Description holds invalid information: {match.group(1)}"
    return True, "Description is valid"
    
def _recheck_categories(userId) -> dict:
    """Double check if category is being used by User. If a category is found 
    that is not inside user's used categories, remove.
    """
    import copy
    user = Users.query.filter_by(id=userId).first()
    if not user:
        return {'CHANGES': False, 'STATUS': 'User not found'}
    used_categories = []
    exist = Card.query.filter_by(founder_id=user.id).all()
    if not exist: return {'CHANGES': False, 'STATUS': 'User doesnt have cards'}

    for c in exist:
        used_categories.append(c.category)

    user_set = user.used_categories

    user_set_copy = copy.deepcopy(user_set)

    for cate in user_set.split():
        if cate not in used_categories:
            user_set_copy = user_set_copy.replace(cate, '')
    
    if user_set != user_set_copy:
        return {'CHANGES': True, 'STATUS': user_set_copy}
    else:
        return {'CHANGES': False, 'STATUS': 'No changes'}

def _check_friendship(userId, otherUserId):
    if not userId or not otherUserId:
        return False, 'Users id not provided'
    
    user1 = Users.query.filter_by(id=userId).first()
    user2 = Users.query.filter_by(id=otherUserId).first()
    if not user1 or not user2:
        return False, 'A user wasnt found inside database.'
    
    check1 = Follow.query.filter_by(follower_id=userId, following_id=otherUserId).first()

    if not check1:
        return False, 'User1 doesnt follow user2'
    
    
    check2 = Follow.query.filter_by(follower_id=otherUserId, following_id=userId).first()

    if not check2:
        return False, 'User2 doesnt follow user1'
    
    if check1.friends == True and check2.friends:
        return True, 'Users are friends already'
    
    check1.friends = True
    check2.friends = True
    db.session.commit()
    return True, 'Users follow eachother and are now friends inside the system.'

    

def hash_password(password):
    return generate_password_hash(password)

def _search(pattern: str, text):
    return re.search(pattern, text, re.IGNORECASE)