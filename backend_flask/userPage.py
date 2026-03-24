# userPage.py

from backend_flask.config import app
from flask import request, session, jsonify
from backend_flask.validate_content import validate_descripton, validate_action_word



@app.route("/page/edit", methods=["PATCH"])
def change_user_page():
    if "user_id" not in session:
        return jsonify
    
    data = request.get_json()
    if not data:
        return jsonify({'ERROR': "There was an error when grabbing json data"}), 400
    


    action_word = data.get("action_word")

    # The scholar, The creator, The speaker

    description = data.get("description")

    image = data.get("image")

    valid, error = validate_descripton(description)
    if not valid:
        return jsonify({"ERROR": error}), 400
    
    valid, error = validate_action_word(action_word)
    if not valid:
        return jsonify({"EROOR": error}), 400
    if len(action_word) > 10:
        return jsonify({"ERROR":"action word is too long, please shorten"})
    
    return jsonify({"CHANGES": {
        'description': description,
        'action_word': action_word,
        'image': image if image else ''
    }})




