# post_routes.py

from flask import session, jsonify, request
from  backend_flask.config import app, db
import uuid
from backend_flask.validate_user_info import dup_cardCategory
from  backend_flask.validate_content import  validate_writingTitle,validate_mini_description, validate_header, validate_SubcardDescripton, check_category,validate_genre,validate_descripton,reached_max, validate_title, validate_category
from  backend_flask.models import Users, Card, content_in_card, Card_Likes
from datetime import date, datetime 


@app.route("/card", methods=['GET'])
def get_routes():
    data = []
    posts = Card.query.all()
    for post in posts:
        data.append({
            'creator':post.founder.username if post.founder else None,
            'title':post.title,
            'amount_of_content_inside':post.amount_of_content_inside,
        })
    print(f"DATA: {data}")
    return jsonify({"MESSAGE": data}), 200

@app.route("/card/create", methods=["POST"])
def create_card():
    if 'user_id' not in session:
        return jsonify({"ERROR": "Not logged in."}), 401
    
    data = request.get_json()

    if not data:
        return jsonify({"ERROR": "No data sent"}), 400

    
    title = data.get('title', '')
    description = data.get('description', '')
    category = data.get('category', '')
    
    if not title or not category:
        return jsonify({"ERROR": f"Missing {'title' if category else 'category' if title else 'title and category'}."}), 400
    
    valid, error = validate_title(title) 
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    
    valid, error = validate_descripton(description)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    valid, error = validate_category(category)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    valid, error = reached_max(session['user_id'])
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    
    valid, error = dup_cardCategory(userId=session['user_id'], category=category)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": 'Error grabbing user.'}), 400
    
    if category == 'music':
        header = 'My catalog'
        mini_text = 'Check out my music!'

    elif category == 'article':
        header = 'My gallery'
        mini_text = 'Check out my research!'

    elif category == 'code':
        header = 'My projects'
        mini_text = 'Check out my work!'

    elif category == 'art':
        header = 'My Artwork'
        mini_text = 'Check out my pieces!'

    elif category == 'photography':
        header = 'My captures'
        mini_text = 'Check out my shots!'
                            
    else:
        header = 'My work'
        mini_text = 'Check out my work!'
    
    
    Id = str(uuid.uuid4())
    title = title.strip().replace(' ', '')
    shortId: str = f'{title[:4]}{Id[:8]}'
    new_card = Card(
    id=Id,
    header=header,
    mini_description=mini_text,
    founder_id=session['user_id'],
    founder_shortId=user.short_id,
    title=title,
    shortId=shortId,
    category=category,
    amount_of_content_inside=0,
    description=description
)
    try:
        cc = user.used_categories
        cc += f' {category}'
        user.used_categories = cc
    
        db.session.add(new_card)
        db.session.commit()
        return jsonify({
            "MESSAGE":"New card successfully created inside portfilio.", 
            "ID": shortId}), 201
    except Exception as e:
        return jsonify({"ERROR": f"Unexpected error when creating new card inside portfilio: {str(e)}"}),500


    
@app.route('/card/remove', methods=["DELETE"])
def delete_card():
    if 'user_id' not in session:
        return jsonify({"ERROR": "Not logged in"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"ERROR": "No data"}), 400

    card_id = data.get('card_id')
    if not card_id:
        return jsonify({"ERROR": "card_id missing"}), 400
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": "User not found"}), 404
    # ✅ Query by shortId since that's what JS sends
    card = Card.query.filter_by(shortId=card_id, founder_id=session['user_id']).first()
    if not card:
        return jsonify({"ERROR": "Card not found or not yours"}), 404

    try:
        card_category = f' {card.category}'
        subcards = content_in_card.query.filter_by(origin_card_id=card.id, founder_id=session['user_id']).all()
        for card in subcards:
            db.session.delete(card)
        user.used_categories = user.used_categories.replace(card_category, '')
        db.session.delete(card)
        db.session.commit()
        return jsonify({"MESSAGE": "Card deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"ERROR": str(e)}), 500
    


@app.route("/card/edit/<int:card_id>", methods=["PATCH"])
def edit_card(card_id):
    # 1. Check Session
    if 'user_id' not in session:
        return jsonify({"ERROR": "Unauthorized"}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"ERROR": "No data provided"}), 400
    
    # 2. Extract Data
    # outside
    updated_title = data.get("new_titleAboveCard")
    updated_description = data.get("new_description")

    # inner
    updated_category = data.get("new_category")
    updated_header = data.get("new_header")
    updated_miniFacts = data.get("new_miniFacts") # Ensure this is handled in DB

    # 3. Validations (Ensure these return the error message too)
    valid, error = validate_title(updated_title)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    valid, error = validate_category(updated_category)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    valid, error = validate_descripton(updated_description)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    valid, error = validate_descripton(updated_header)
    if not valid:
        return jsonify({"ERROR": error}), 400
    

    # 4. Database Operation
    old_card = Card.query.filter_by(id=card_id, user_id=session['user_id']).first()
    if not old_card:
        return jsonify({"ERROR": "Card not found"}), 404
    
    try:
        old_card.title = updated_title
        old_card.description = updated_description
        old_card.category = updated_category
        old_card.header = updated_header
        # If miniFacts is a column in your Card model:
        # old_card.mini_facts = updated_miniFacts 

        db.session.commit()
        return jsonify({"MESSAGE": "Card updated successfully", "DETAILS": {"id": card_id}}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Update error: {e}") # Log the actual error for debugging
        return jsonify({"ERROR": "Internal server error"}), 500







@app.route("/card/get/<short_id>", methods=["GET"])
def get_certain_card(short_id):

    #id_fragment = short_id[:8]
    user = Users.query.filter_by(id=session['user_id']).first() 
    if not user:
        return jsonify({"ERROR": "User doesn't exist."}), 404
    
    card = Card.query.filter_by(shortId=short_id).first()
    if not card:
        return jsonify({"ERROR": "Card doesn't exist."}), 404
    
    owner_check = False
    if card.founder_id == session['user_id']:
        owner_check = True
    empty = False
    stuff = []
    content = card.content
    print(f"\n{content}\n"*3)

  
    for subcard in content:
        stuff.append({
            'id': subcard.id,
            'title': subcard.title,
            'category': subcard.category,
            'audio': subcard.audio_link,
            'description': subcard.description,
            'image': subcard.image_link,
            'platform': subcard.platform_link,
            'content_type': subcard.content_type
        
        })

    if len(stuff) == 0:
        empty = True

    return jsonify({"MESSAGE": "SUCCESS",
                    "HOME":{
                        'id': card.id,
                        'header': card.header,
                        'miniText': card.mini_description,
                        'title': card.title,
                        'category': card.category,
                        'shortId': short_id,
                        'description': card.description,
                        'image': card.image,
                        #'type': card.content_type,
                        
                    },
                    'CARDS': stuff,
                    'OWNER': owner_check,
                    'EMPTY': empty}), 200


@app.route("/card/get/id", methods=['GET'])
def get_id_from_card():
    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": 'User doesnt exist'}), 404
    return jsonify({"MESSAGE": 'SUCCESS', 'SET':{
                                                'ID': user.id, 
                                                'SHORT':user.short_id}}), 200

# ========================================================= #
# ================= CONTENT INSIDE CARD =================== #
# ========================================================= #
# inside post_routes.py


@app.route("/subcard", methods=['GET'])
def get_subCards():
    data = []
    posts = content_in_card.query.all()
    for post in posts:
        data.append({
    'id': post.id,
   # 'short_id': post.short_id,
    'title': post.title,
    'category': post.content_type,
    'description': post.description,
    'image': post.image_link,
    'audio': post.audio_link,
    'platform': post.platform_link,
})
    
    return jsonify({"MESSAGE": data}), 200




@app.route("/subcard/create", methods=["POST"])
def add_subcard():
    if 'user_id' not in session:
        return jsonify({"ERROR": "Not logged in."}), 401
    
    data = request.get_json()

    if not data:
        return jsonify({"ERROR": "No data sent"}), 400

    
    title = data.get('title', '')
    description = data.get('description', '')
    genre = data.get('genre', '')
    platform_link = data.get("platform", '')
    image_link = data.get("image", '')
    audio_link = data.get("audio", '')
    category = data.get('category')
    card_id = data.get('card_id', '')
    if not card_id:
        return jsonify({"ERROR": "card_id is required"}), 400

    if not title or not category:
        return jsonify({"ERROR": f"Missing {'title' if category else 'category' if title else 'title and category'}."}), 400
    

    valid, error = validate_writingTitle(title) 
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    
    valid, error = validate_SubcardDescripton(description)
    if not valid:
        return jsonify({"ERROR": error}), 400
    

    check = check_category(category)
    if check == 'music':
        valid, error = validate_genre(category, fitting=check)
        if not valid:
            return jsonify({"ERROR": error}), 400
        
    elif check == 'article':
        valid, error = validate_genre(category, fitting=check)
        if not valid:
            return jsonify({"ERROR": error}), 400
        
    elif check == 'code':
        valid, error = validate_genre(category, fitting=check)
        if not valid:
            return jsonify({"ERROR": error}), 400
        
    elif check == 'photography':
        valid, error = validate_genre(category, fitting=check)
        if not valid:
            return jsonify({"ERROR": error}), 400
        

    user = Users.query.filter_by(id=session['user_id']).first()
    if not user:
        return jsonify({"ERROR": 'Error grabbing user.'}), 400
    
    card = Card.query.filter_by(shortId=card_id, founder_id=session['user_id']).first()
    if not card:
        return jsonify({"ERROR": "Card not found or not yours"}), 404

    Id = str(uuid.uuid4())
    shortId: str = f'{card_id}?subcard={Id[:8]}'
    new_card = content_in_card(
    id=Id,
    title=title,
    founder_id=session['user_id'],
    origin_card_id=card.id,
    origin_card_shortId=card.shortId,
    shortId=shortId,
    content_type=check,
    category=category,
    image_link=image_link,
    platform_link=platform_link,
    audio_link=audio_link,
    description=description
)
    try:
 
        db.session.add(new_card)
        db.session.commit()
        return jsonify({
            "MESSAGE":"Subcard successfully created inside portfilio.", 
            "SHORTID": shortId,
            "ID": Id}), 201
    except Exception as e:
        return jsonify({"ERROR": f"Unexpected error when creating new card inside portfilio: {str(e)}"}),500



@app.route("/card/edit", methods=['PATCH'])
def edit_card_page():
    if "user_id" not in session:
        return jsonify({"ERROR": 'User is not inside the session'}), 400
    

    data = request.get_json()
    if not data:
        return jsonify({"ERROR": 'Data couldnt be found.'}), 400
    
    header = data.get("header", '')
    mini_text = data.get("miniText", '')
    card_id = data.get("cardId", '')

    if not card_id:
        return jsonify({"ERROR": 'card id not found from request.'}), 400


    valid, error = validate_header(header)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    valid, error = validate_mini_description(mini_text)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    card = Card.query.filter_by(shortId=card_id).first()
    if not card:
        return jsonify({"ERROR": 'Card doesnt exist.'}), 404
    

    try:
        card.header = header
        card.mini_description = mini_text 
        db.session.commit()
        return jsonify({"MESSAGE": 'SUCCESS', 'SET': {'header': header, 'miniText': mini_text, 'shortId': card_id}}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"ERROR": f'Server error: {e}'}), 500


@app.route("/subcard/remove", methods=["DELETE"])
def delete_subcard():
    if 'user_id' not in session:
        return jsonify({"ERROR": "Not logged in"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"ERROR": "No data sent"}), 400

    subcard_id = data.get('subcard_id')
    if not subcard_id:
        return jsonify({"ERROR": "subcard_id missing"}), 400

    # Find the subcard
    subcard = content_in_card.query.filter_by(id=subcard_id).first()
    if not subcard:
        return jsonify({"ERROR": "Subcard not found"}), 404

    # Verify the logged-in user owns the parent card
    parent_card = Card.query.filter_by(id=subcard.origin_card_id,
                                       founder_id=session['user_id']).first()
    if not parent_card:
        return jsonify({"ERROR": "Not authorized to delete this"}), 403
    # 403 means forbidden — the subcard exists but doesn't belong to them

    try:
        db.session.delete(subcard)
        db.session.commit()
        return jsonify({"MESSAGE": "Subcard deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"ERROR": str(e)}), 500
    






# ===============================================================
# ===================== LIKE CARDS ==============================
# ===============================================================


@app.route("/card/like/<short_id>", methods=['PATCH'])
def like_card(short_id):
    if "user_id" not in session:
        return jsonify({"ERROR":"User not logged in."}), 401
    
    if not short_id:
        return jsonify({"ERROR": "No user id found during following process"}), 400
    
    card_being_followed = Card.query.filter_by(shortId=short_id).first()
    if not card_being_followed:
       return jsonify({"ERROR":"Card not found."}), 400
    
    card_owner = Users.query.filter_by(id=card_being_followed.founder_id).first()
    if not card_owner:
        return jsonify({"ERROR": 'Card owner not found.'}),404
    
    
    if card_being_followed.founder_id == session['user_id']:
        return jsonify({"ERROR": 'Cannot follow yourself.'}),403
    
    user_whos_liking = Users.query.filter_by(id=session['user_id']).first()
    if not user_whos_liking:
        return jsonify({"ERROR":"User not found."}), 404
    existing = Card_Likes.query.filter_by(
        card_being_followed=card_being_followed.id,
        that_cards_owner_id=card_being_followed.founder_id,
        that_cards_owner_shortId=card_being_followed.founder_shortId,
        follower_id=session['user_id']
    ).first()

    try:
        if existing:
            c = f' {card_being_followed.id}'
            user_whos_liking.liked_cards_list = user_whos_liking.liked_cards_list.replace(c, '')
            card_owner.points -= 1
            db.session.delete(existing)
            db.session.commit()
            return jsonify({"MESSAGE":"Unliked", 'LIKED': False}), 200
        
        else:
        
            c = f' {card_being_followed.id}'
            
            user_whos_liking.liked_cards_list += c
            card_owner.points += 1
            new_like = Card_Likes(
        card_being_followed=card_being_followed.id,
        that_cards_owner_id=card_being_followed.founder_id,
        that_cards_owner_shortId=card_being_followed.founder_shortId,
        follower_id=session['user_id']
    )

            db.session.add(new_like)
            db.session.commit()
            return jsonify({"MESSAGE":f"({date.today()}) User ({user_whos_liking.username}) successfully likes the card '{card_being_followed.title}' by {card_owner.username}", 'LIKES': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"ERROR":f"Unexpected server error during following process: {e}"}), 500



@app.route("/card/like/check/<short_id>", methods=['GET'])
def check_like(short_id):
    if "user_id" not in session:
        return jsonify({"LIKES":False}), 200
    
    if not short_id:
        return jsonify({"ERROR": "No user id found during liking process"}), 400
    
    target = Card.query.filter_by(shortId=short_id).first()
    
    if not target:
       return jsonify({"ERROR":"User not found."}), 404
    
    exist = Card_Likes.query.filter_by(
        card_being_followed=target.id,
        that_cards_owner_id=target.founder_id,
        that_cards_owner_shortId=target.founder_shortId,
        follower_id=session['user_id']
    ).first()
    return jsonify({"LIKES": exist is not None}), 200
    



@app.route("/category/get", methods=['POST'])
def get_categories():
    data = request.get_json()
    if not data:
        return jsonify({"ERROR": 'Data is not found'}), 400
    
    category = data['stuff']
    the_type = check_category(category)
    return jsonify({"MESSAGE": 'SUCCESS', 'TYPE': the_type}), 200