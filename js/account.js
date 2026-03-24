// accounts.js
import {p, debug} from './utils.js';
import { addingCard } from './add_card.js';

import './cards.js';

var step = 0;

export function createUserCardbase(username, 
                                    id, 
                                    email, 
                                    role) {
   
    
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
        nameTemplate.textContent = capitalizeName(username);
        
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


        
    
    //localStorage.setItem("pf_username", username);
    
}



export function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}




document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
   
    const viewingUserId = params.get("user");

   
    if (viewingUserId){
        
        loadUserById(viewingUserId);
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
        const response = await fetch(`/user/get/${shortId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { "Content-Type": 'application/type' }
        });
        const data = await response.json();
        if (response.ok && data.MESSAGE){
        
            const u = data.USER;

            
            const aboutMeArea = document.querySelector('.learn_more_section');
            aboutMeArea.innerHTML = '';
            aboutMeArea.innerHTML = `<a class="learn_more" href="../html/aboutme_template.html?user=${shortId}">More about me ></a>`;

            const userCardsOnPage = data.CARDS;
            const sections = document.querySelector(".different_sections");
            sections.innerHTML = '';
            sections.style.textAlign = 'center';


           
            if (data.OWNER === false){
                
                
                const editBtn = document.querySelector(".edit-btn");
                const addBtn = document.querySelector(".add-btn");
                if (editBtn) editBtn.style.display = 'none';
                if (addBtn) addBtn.style.display = 'none';

                
            } else{
                const likeButton = document.getElementById("like-btn");
                const followBtn = document.getElementById('follow-btn');
                if (followBtn) followBtn.style.display = 'none';
                if (likeButton) likeButton.style.display = 'none';
            }

            const test = u['action_word'];
            
            createExistingUserCardbase(u.username, 
                               shortId, 
                               u.email, 
                               u.role, 
                               test, 
                               u.page_description);

            
            if (userCardsOnPage.length === 0){
               
                console.log("[USER TEMPLATE] WE ARE EMPTY");
                //const sections = document.querySelector(".different_sections");
                sections.insertAdjacentHTML('afterbegin', '<h1>User doesnt have any cards</h1>');
                return;
            }
            
    
            for (var i = 0; i<userCardsOnPage.length; i++){
                const c = userCardsOnPage[i];
                
                addingCard(c.title, c.description, c.category, c.shortId, c.image);
            }
            
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
        nameTemplate.textContent = capitalizeName(sp_username);
        
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
   
    if (user_action_word){
        user_action_word.innerHTML = '';
        user_action_word.innerHTML = chosen_action_word;
    } 
    if (_user_des){
        _user_des.innerHTML = '';
        _user_des.innerHTML = sp_des;
    }     
    
   
    
}










function addUserCards(subcardTitle, subcardDescription, subcardCategory, links, ){
    // links = {audio_link, platform_link, image_link, etc...}
    const { image, platform, audio } = links;

    var html;
    if (category === 'music'){
    html =  `
<div class="song_item">
    <div class="song_cover">
        <div class='category' style='display: none;'>${category}</div>
        <a ${platform ? `href="${platform}"` : ''}>
            <img ${`src="${image}"` ? image : ''}>
        </a>
    </div>
    
        <audio class="preview-audio" ${`src="${audio}"` ? audio : ''}></audio>
    
    <div class="song_title">${title}</div>
</div>
`} else if (category === 'article'){
    html =  `
<div class="song_item">
    <div class="song_cover">
        <div class='category' style='display: none;>${category}</div>
        <a href='../html/article_template.html' target="_blank">
            <img ${`src="${image}"` ? image : ''}>
        </a>
    </div>
    
    <div class="song_title">${title}</div>
</div>
`
}else {
    html =  `
<div class="song_item">
    <div class="song_cover">
        <div class='category' style='display: none;'>${category}</div>
        <a ${platform ? `href="${platform}"` : ''}>
            <img ${`src="${image}"` ? image : ''}>
        </a>
        <div class="quote_overlay">${description}</div>
    </div>
    
        <audio class="preview-audio" ${`src="${audio}"` ? audio : ''}></audio>
    
    <div class="song_title">${title}</div>
</div>
`
}
return html;
}