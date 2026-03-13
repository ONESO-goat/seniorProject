// accounts.js
import {p, debug} from './utils.js';

import './cards.js';

var step = 0;

export function createUserCardbase(username, 
                                    id, 
                                    email, 
                                    role) {
   
    debug(username);
    debug(id);
    debug(role);
    if (!username || !id || !role) {
        p("Didnt pass username or id check.");
        return;
    }


    const nameTemplate = document.querySelector(".the_user");
    
    const action_word = document.querySelector(".My_title");

    const current_user_des = document.getElementById('template-description');

    const recap = document.querySelector(".recap"); 
    
    
    const cardDescription = document.querySelector(".main_description_of_section");
    
    const boxName = document.querySelector(".name_of_boxes");
    
    document.title = `PanthoFlow - ${username}`;
    
    if (nameTemplate) {
        nameTemplate.textContent = username;
        
    }
    
    if (recap) {
       
        if (email){
        const emailLink = recap.querySelector(".user-links");
        emailLink.textContent = email;
       

        } 
        if (id){
           
            const idBox = recap.querySelector(".user-id");
            idBox.textContent = id;
           
        }

    }


    if (cardDescription && boxName){
        
        if (role == 'Business'){
        boxName.innerHTML = '<h1>My Work</h1>'
        cardDescription.innerHTML = 'Come see my best work!';

    } else if (role == 'Personal'){
        boxName.innerHTML = '<h1>Life</h1>'
        cardDescription.innerHTML = 'Come see my exciting life!';
    } else if (role == 'Education'){
        boxName.innerHTML = '<h1>Studies</h1>'
        cardDescription.innerHTML = "Come see what I've been learning about!";
    } else {
        debug(" X ---- HIT ELSE, ROLE NOT FOUND -----")
        boxName.innerHTML = '<h1>Stuff</h1>'
        cardDescription.innerHTML = "Come see what I've been working on!";}
    }


        
    
    localStorage.setItem("pf_username", username);
    
}



export function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}




document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    debug(`PARAMS ${params}`);


    const viewingUserId = params.get("user");

    debug(`ID FOR VIEWING ${viewingUserId}`);

    if (viewingUserId){
        debug("VIEWING USER ID STARTED")
        loadUserById(viewingUserId);
        return;
    } else{
    const username = localStorage.getItem("pf_username");
    const shortid  = localStorage.getItem("pf_shortid");
    const email    = localStorage.getItem("pf_email");
    const role     = localStorage.getItem("pf_role");

    if (!username || !shortid) {
        window.location.href = "../login_signin/index.html";
        return;
    }

    createUserCardbase(username, shortid, email, role);
    
    lucide.createIcons();
}});

async function loadUserById(shortId){
    try{
        const response = await fetch(`http://127.0.0.1:5000/user/get/${shortId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { "Content-Type": 'application/type' }
        });
        const data = await response.json();
        if (response.ok && data.MESSAGE){
        
            const u = data.USER;
            console.log(u);

            debug(u.username);
            debug(u.shortId);
            debug(u.email);

            if (data.OWNER === false){
 
                const editBtn = document.querySelector(".edit-btn");
                const addBtn = document.querySelector(".add-btn");
                if (editBtn) editBtn.style.display = 'none';
                if (addBtn) addBtn.style.display = 'none';
        }

            const test = u['action_word'];
            debug(`test['action_word'] ${test}`)
            
            createExistingUserCardbase(u.username, 
                               shortId, 
                               u.email, 
                               u.role, 
                               test, 
                               u.page_description);
        } 
        else {
            console.error(("User not found:", data.ERROR));
        }
    } catch (e){
        console.error("Failed to load user:", e);
    }
}



export function createExistingUserCardbase(
                                    sp_username, 
                                    sp_id, 
                                    sp_email, 
                                    sp_role, 
                                    chosen_action_word, 
                                    sp_des) {
   
    debug(sp_username);
    debug(sp_id);
    debug(sp_role);
    if (!sp_username || !sp_id || !sp_role) {
        p("Didnt pass username or id check.");
        return;
    }


    const nameTemplate = document.querySelector(".the_user");
    
    const user_action_word = document.querySelector(".My_title");

    const _user_des = document.getElementById('template-description');

    const recap = document.querySelector(".recap"); 
    
    
    const cardDescription = document.querySelector(".main_description_of_section");
    
    const boxName = document.querySelector(".name_of_boxes");
    
    document.title = `PanthoFlow - ${sp_username}`;
    
    if (nameTemplate) {
        nameTemplate.textContent = sp_username.toUpperCase();
        
    }
    
    if (recap) {
       
        if (sp_email){
        const emailLink = recap.querySelector(".user-links");
        emailLink.textContent = sp_email;
       

        } 
        if (sp_id){
           
            const idBox = recap.querySelector(".user-id");
            idBox.textContent = sp_id;
           
        }

    }
    debug(`ACTION AND DES CHECK; ACTION: ${chosen_action_word}, DESCRIPTION: ${sp_des}`);
    if (user_action_word){
        debug("ACTION WORD FOUND");
        user_action_word.innerHTML = chosen_action_word;
    } 
    if (_user_des){
        debug("DESCRIPTION FOUND");
        _user_des.innerHTML = sp_des;
    }     
    
    localStorage.setItem("pf_username", sp_username);
    
}
