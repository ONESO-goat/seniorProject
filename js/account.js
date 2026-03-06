// accounts.js
import {p, debug} from './utils.js';

var step = 0;

export function createUserCardbase(username, id, email, role) {
    p(" ============= Inside CreateCardBase ====================");
    debug(username);
    debug(id);
    debug(role);
    if (!username || !id || !role) {
        p("Didnt pass username or id check.")
        return;
    }
    p("Passes username and ID check.");

    const nameTemplate = document.querySelector(".the_user");
    
    const recap = document.querySelector("recap");  
    
    const cardDescription = document.querySelector(".main_description_of_section");
    
    const boxName = document.querySelector(".name_of_boxes");
    
    document.title = `PanthoFlow - ${username}`;
    p("New document title set and evverythign else above set.");
    if (nameTemplate) {
        nameTemplate.textContent = username;
        debug("nameTemplate set ✓");
    }
    
    if (recap) {
        debug("recap set ✓");
        if (email){
        const emailLink = recap.querySelector(".user-links");
        emailLink.textContent = email;
        p("email set ✓")

        } 
        if (id){
            p("id found ✓")
            const idBox = recap.querySelector(".user-id");
            idBox.textContent = id;
            p("id set ✓")
        }

    }

    if (cardDescription && boxName){
        p("DOUBLE CHECKS SET ✓")
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

        
    debug("Creating about me ✓");
    createAboutme(username);
    debug("about me set ✓");
}

export function createAboutme(username) {
    const name = capitalizeName(username);
    p("INSIDE ABOUIT ME AND NAME SET")
    const Hi = document.querySelector(".more_of_me");
    if (Hi) {
        Hi.innerHTML = `<p>Hi, my name is ${name}!</p>`;
    }
}

export function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}




document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("pf_username");
    const shortid  = localStorage.getItem("pf_shortid");
    const email    = localStorage.getItem("pf_email");
    const role     = localStorage.getItem("pf_role");

    if (!username || !shortid) {
        window.location.href = "../login_signin/index.html";
        return;
    }

    createUserCardbase(username, shortid, email, role);
});