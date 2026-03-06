
changeText()
setInterval(changeText, 3500)

function changeText(){
    var changing_text = ["WELCOME!", "LET'S GET STARTED", "WHAT'S YOUR NAME?"];

    let index = 0;

    const changeID = document.getElementById("welcome_text");

    changeID.textContent = changing_text[index % changing_text.length];
    var current = textContent.toLowerCase();
    if (current == "what's your name?"){
        var search = document.getElementById("grab_name");
        if (search){
            var name_check = validateName(search);
            if (!name_check || name_check == false){
                nameError();
            }
            const user_name = search;
            saveAndAdd(user_name);
        }

    }
    index++;
    
}

function saveAndAdd(username){
    
    if(username == false){
        return;
    }

    return username; // Sends it to python
}
function validateName(name){
    if (name == null || ! name){
        return false;
    }
    if (!name.instanceof(String) || name.instanceof(String) == false){
        return false;
    }

    name = name.toLowerCase().trim();
    var invalidNames = ['bad name'];

    if (name == ''){
        window.onerror = function(message, source, lineno, colno, error){
            const errorLog = document.getElementById('error-log');
            errorLog.innerHTML += `<p>Error: ${message} at ${source}`;
            return true;
        }
        return false;
    }
    if (name in invalidNames){
        return false;
    }
    return true;
}

saveAndAdd();


