# validate_content.py

from typing import Tuple, Protocol
from  backend_flask.forbidden import FORBIDDEN_CONTENT
from backend_flask.models import Users, Card
from  backend_flask.types_pantho import VALID_TYPES

class image(Protocol):
    pass



def validate_descripton(content: str) -> Tuple[bool,str]:

    content = content.lower().strip()
    
    if len(content) == 0 or len(content) > 250:
        return False, f'Description falls outside valid range (1-250): {len(content)}'
    for char in content.split():
        if char in FORBIDDEN_CONTENT:
            return False, f'Description hold unvalid content: {char}'
    
    return True, 'Description is valid and ready to be published.'

def validate_SubcardDescripton(content: str) -> Tuple[bool,str]:

    content = content.lower().strip()
    
    if len(content) > 400:
        return False, f'Description falls outside valid range (400): {len(content)}'
    for char in content.split():
        if char in FORBIDDEN_CONTENT:
            return False, f'Description hold unvalid content: {char}'
    
    return True, 'Description is valid and ready to be published.'

def validate_descripton_onPage(content: str) -> Tuple[bool,str]:

    content = content.lower().strip()
    
    if len(content) == 0 or len(content) > 125:
        return False, f'Description falls outside valid range (1-125): {len(content)}'
    for char in content.split():
        if char in FORBIDDEN_CONTENT:
            return False, f'Description hold unvalid content: {char}'
    
    return True, 'Description is valid and ready to be published.'


def validate_title(content: str) -> Tuple[bool,str]:
    content = content.lower().strip()
    
    if len(content) > 20 or len(content) == 0:
        return False, f'Action word falls outside valid range (1-10): {len(content)}'
    
    for char in content.split():
        if char in FORBIDDEN_CONTENT:
            return False, f'Action word hold unvalid content: {char}'
    
    return True, 'valid'

def validate_writingTitle(content: str) -> Tuple[bool,str]:
    content = content.lower().strip()
    
    if len(content) > 300 or len(content) == 0:
        return False, f'Action word falls outside valid range (1-300): {len(content)}'
    
    for char in content.split():
        if char in FORBIDDEN_CONTENT:
            return False, f'Action word hold unvalid content: {char}'
    
    return True, 'valid'

def reached_max(userId):
    user = Users.query.filter_by(id=userId).first()
    if not user:
        return False, 'User not found error.'

    cards = Card.query.filter_by(founder_id=user.id).all()
    
    if len(cards) >= 10:
        return False, 'Max amount of cards, free space by deleting cards you dont need.'
    return True, 'valid'
    

    

def validate_action_word(content: str) -> Tuple[bool,str]:
    content = content.lower().strip()
    
    if len(content) > 35 or len(content) == 0:
        return False, f'Title falls outside valid range (1-35): {len(content)}'
    
    for char in content.split():
        if char in FORBIDDEN_CONTENT:
            return False, f'Title hold unvalid content: {char}'
    
    return True, 'valid'
def validate_pic(pic: object | image):
    pass

def validate_category(category: str):
    category = category.lower().strip()
    if category not in VALID_TYPES:
        return False, f"Category isn't valid: {category}"
    
    if category in FORBIDDEN_CONTENT:
        return False, "Category contains invalid content, anymore offenses may lead to an account suspenation."
    
    return True, 'Category is ready for publish.'

def check_category(c):
    c = c.lower().strip()
    music = ['hip-hop', 
                        'rap', 
                        'pop', 
                        'indie', 
                        'other', 
                        'rock', 
                        'metal', 
                        'dance', 
                        'jazz', 
                        'punk', 
                        'trap']
    
    articles = ['non-fiction', 
                        'fiction', 
                        'sci-fi', 
                        'action', 
                        'poet', 
                        'poem', 
                        'biography', 
                        'manga',
                        'comic'
                        ]
    
    code = ['python', 
                        'c', 
                        'c++', 
                        'java', 
                        'web', 
                        'javascript', 
                        'full', 
                        'rust',
                        ]
    
    art = ['paint', 
                        'vintage', 
                        'doodle', 
                        'ai', 
                        '3d', 
                        'realism', 
                        'comic', 
                        'rust',
                        'surrealism',
                        'abstract'
                        ]
    
    photos = ['personal',
                        'business',
                        'education'
                        ]
        
        
    if c in music: return 'music'

    elif c in articles: return 'article'

    elif c in code: return 'code'

    elif c in art: return 'art'

    elif c in photos: return 'photography'

    else: return 'other'
    

def validate_genre(category: str, fitting):
    category = category.lower().strip()
    if fitting == 'music':
        valid_genres = ['hip-hop', 
                        'rap', 
                        'pop', 
                        'indie', 
                        'other', 
                        'rock', 
                        'metal', 
                        'dance', 
                        'jazz', 
                        'punk', 
                        'trap']
        if category not in valid_genres:
            return False, f"[genre] Category isn't valid: {category}"
        
        if category in FORBIDDEN_CONTENT:
            return False, "Category contains invalid content, anymore offenses may lead to an account suspenation."
        
        return True, 'Category is ready for publish.'
    
    elif fitting == 'article':
        valid_genres = ['non-fiction', 
                        'fiction', 
                        'sci-fi', 
                        'action', 
                        'poet', 
                        'poem', 
                        'biography', 
                        'comic',
                        'manga'
                        ]
        
        if category not in valid_genres:
            return False, f"[genre article] Category isn't valid: {category}"
        
        if category in FORBIDDEN_CONTENT:
            return False, "Category contains invalid content, anymore offenses may lead to an account suspenation."
        
        return True, 'Category is ready for publish.'
    
    elif fitting == 'code':
        valid_genres = ['python', 
                        'c', 
                        'c++', 
                        'java', 
                        'web', 
                        'javascript', 
                        'full', 
                        'rust',
                        ]
        
        if category not in valid_genres:
            return False, f"[genre article] Category isn't valid: {category}"
        
        if category in FORBIDDEN_CONTENT:
            return False, "Category contains invalid content, anymore offenses may lead to an account suspenation."
        
        return True, 'Category is ready for publish.'
    
    elif fitting == 'art':
        valid_genres = ['paint', 
                        'vintage', 
                        'doodle', 
                        'ai', 
                        '3d', 
                        'realism', 
                        'comic', 
                        'rust',
                        'surrealism',
                        'abstract'
                        ]
        
        if category not in valid_genres:
            return False, f"[genre art] Category isn't valid: {category}"
        
        if category in FORBIDDEN_CONTENT:
            return False, "Category contains invalid content, anymore offenses may lead to an account suspenation."
        
        return True, 'Category is ready for publish.'
    

    elif fitting == 'photography':
        valid_genres = ['personal',
                        'business',
                        'education'
                        ]
        
        if category not in valid_genres:
            return False, f"[genre photography] Category isn't valid: {category}"
        
        if category in FORBIDDEN_CONTENT:
            return False, "Category contains invalid content, anymore offenses may lead to an account suspenation."
        
        return True, 'Category is ready for publish.'
    
    else:
        valid_genres = ['other']

        if category not in valid_genres:
            return False, f"[OTHER] Category isn't valid: {category}"
        
        if category in FORBIDDEN_CONTENT:
            return False, "Category contains invalid content, anymore offenses may lead to an account suspenation."
        
        return True, 'Category is ready for publish.'
    



    


def validate_header(header):
    header = header.lower().strip()
    headerSplit = header.split()

    if header in FORBIDDEN_CONTENT or any(i in headerSplit for i in FORBIDDEN_CONTENT):
        return False, f'Holds invalid content: {header}'
    
    if len(headerSplit) > 4 or len(header) > 25:
        return False, 'Header is too big'
    
    return True, 'valid'

def validate_mini_description(des):
    des = des.lower().strip()
    DesSplit = des.split()

    if des in FORBIDDEN_CONTENT or any(i in DesSplit for i in FORBIDDEN_CONTENT):
        return False, f'Holds invalid content: {([i in DesSplit for i in FORBIDDEN_CONTENT])}'
    
    if len(des) > 60:
        return False, 'Mini description is too big'
    
    return True, 'valid'