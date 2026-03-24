#models.py

from  backend_flask.config import db
from datetime import datetime, date
import uuid
from sqlalchemy.dialects.sqlite import TEXT


class Users(db.Model):
    __tablename__ = "Portflow_users"

    id = db.Column(TEXT,primary_key=True, default=lambda: str(uuid.uuid4()))

    username = db.Column(db.String(120), nullable=False, unique=True)

    following_list = db.Column(db.Text, nullable=True, default='')

    liked_cards_list = db.Column(db.Text, nullable=True, default='')

    status = db.Column(db.String(100), nullable=True, default='online')

    action_word = db.Column(db.String(40), nullable=True)

    description = db.Column(db.String(200), nullable=True)

    password = db.Column(TEXT,  nullable=False)

    short_id = db.Column(db.String(130), nullable=False, unique=True)

    role = db.Column(db.String(50), nullable=False)

    points = db.Column(db.Integer, default=0)

    followers = db.Column(db.Integer, default=0)

    email = db.Column(db.String(200), unique=True, nullable=True)

    content = db.Column(TEXT)

    used_categories = db.Column(db.String(600), nullable=True, default='')

    member_at = db.Column(db.Date, nullable=False, default=date.today)

    about_me = db.Column(db.String(300), nullable=True, default='')

    page_content = db.relationship("Card", backref="user", lazy=True)




    def toLower(self):
        return self.username.lower()



class Card(db.Model):
    __tablename__ = "cards"

    id = db.Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))

    founder_id = db.Column(TEXT, db.ForeignKey("Portflow_users.id"), nullable=False)
    
    founder_shortId = db.Column(TEXT, nullable=False)

    
    title = db.Column(db.String(60), nullable=False, default="New Box")

    shortId = db.Column(db.String(20), nullable=False)
    
    category = db.Column(db.String(60), nullable=False)

    likes = db.Column(db.Integer, nullable=True, default=0)

    description= db.Column(db.String(120), nullable=True, default="description")

    header = db.Column(db.String(120), nullable=True, default="Fun Stuff!")

    mini_description = db.Column(db.String(120), nullable=True, default="describe the purpose of this card.")

    created_at= db.Column(db.Date, nullable=False, default=date.today)

    amount_of_content_inside = db.Column(db.Integer, nullable=True, default=0)

    image = db.Column(db.String(300), nullable=True, default='../images/betterPantho.png')

    founder = db.relationship("Users", backref="users_content", lazy=True)

    content = db.relationship("content_in_card", backref='sub_content', lazy=True)

   
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "shortId": self.shortId,
            'header': self.header,
            'content': self.content,
            'image':self.image,
            'amount_of_content_inside': self.amount_of_content_inside,
            'mini_description': self.mini_description
        }

class content_in_card(db.Model):


    __tablename__ = 'sub_content'


    id = db.Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))

    title = db.Column(db.String(200), default='Card')

    category = db.Column(db.String(100), nullable=False)

    description = db.Column(db.String(400))

    audio_link = db.Column(TEXT, nullable=True)

    image_link = db.Column(TEXT, nullable=True)

    shortId = db.Column(db.String(60), nullable=False)
    
    platform_link = db.Column(TEXT, nullable=True)

    founder_id = db.Column(TEXT, nullable=False, unique=False)


    origin_card_id = db.Column(TEXT, db.ForeignKey("cards.id"), nullable=False, unique=False)

    origin_card_shortId = db.Column(TEXT)

    content = db.Column(TEXT, nullable=True)

    content_type = db.Column(db.String(30), nullable=False)

    date_added = db.Column(db.Date, nullable=False, default=date.today)


    card = db.relationship("Card", backref="home", lazy=True)


class Follow(db.Model):

    __tablename__ = 'follows'

    id = db.Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))

    follower_id = db.Column(TEXT,nullable=False, unique=False)

    following_id = db.Column(TEXT,nullable=False, unique=False)

    mutuals = db.Column(db.Boolean, nullable=True)

    friends = db.Column(db.Boolean, unique=False, nullable=True)

    date_added = db.Column(db.Date, nullable=True, unique=False, default=date.today)

class Card_Likes(db.Model):
    __tablename__ = 'likedcards'

    id = db.Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))

    card_being_followed = db.Column(TEXT,nullable=False, unique=False)

    that_cards_owner_id = db.Column(TEXT,nullable=False, unique=False)

    that_cards_owner_shortId = db.Column(TEXT,nullable=False, unique=False)

    follower_id = db.Column(TEXT,nullable=False, unique=False)

class Classrooms(db.Model):

    __tablename__ = 'classrooms'

    #founder_id = db.Column(TEXT, db.ForeignKey("Portflow_users.id"), nullable=False)
    

    id = db.Column(TEXT, primary_key=True, default=lambda: str(uuid.uuid4()))
 
    student_count = db.Column(db.Integer, nullable=True, default=0)

    admins = db.Column(TEXT)

    status = db.Column(db.String(100), nullable=True, default='active')


if __name__ == "__main__":
    pass