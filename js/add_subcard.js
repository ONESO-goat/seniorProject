import { debug, p } from "./utils.js";

import { buildArtCard, initArtCards } from './art_card.js';
// add_subcard.js
export function addSubcard(category,
                     title,
                     image_link,
                     audio_link=null,
                     platform_link=null,
                     description='',
                     type,
                     id
){
    
    const base = document.querySelector(".three_songs_per_row");
    if (!base){
        return;
    }

    if (type === 'code' && !description){
        description = `${title} <br> written in ${category}`;
    } /*else if (type === 'art' && !image_link){
        return;
    }*/
    base.insertAdjacentHTML('beforeend', htmlStructure({
        title: title, 
        category: category,
        image: image_link,
        audio: audio_link,
        platform: platform_link ,
        description,
        type,
        id: id
    }))
    
    const newCard = base.lastElementChild;
    
    console.log("data-subcard-id on element:"+ newCard.dataset.subcardId);
    debug(`NEW CARD: ${newCard}\n`);
    const subcardId = newCard.dataset.subcardId || newCard.id;
    debug(`SUBCARD ID: ${subcardId ? subcardId : 'Id not found'}\n`);
    attachDeleteButton(newCard, subcardId);
    if (type === 'art' || type === 'photography'){
        initArtCards();
}
}


function htmlStructure(data){
    const { title, category, image, audio, platform, description, type, id } = data;
     if (type === 'art' || type === 'photography' ||
        category === 'paint' || category === 'surrealism' ||
        category === 'vintage' || category === 'doodle' ||
        category === 'ai' || category === '3d' ||
        category === 'abstract' || category === 'realism' ||
        category === 'comic' || category === 'game' ) {

        return buildArtCard({ title: title, category: category, image, description, id: id });
    }
    

    var html;
    if (type === 'music'){
    debug("========HTML IS MUSIC========");
    // description = the link to the song
    html = `
<div class="song_item" data-subcard-id="${id}">
    <div class="song_cover">
        <div class='category' style='display: none;'>${category}</div>
        <a ${description ? `href="${description}" target='_blank'` : ''}>
            <img ${image ? `src="${image}"` : ''}>
        </a>
    </div>
    
        <audio class="preview-audio" ${audio ? `src="${audio}"` : ''}></audio>
    
    <div class="song_title">${title}<br><span>${category}</span></div>
</div>`
} else if (type === 'article'){
    debug("========HTML IS ARTICLE========");
    html =  `
<div class="song_item"  data-subcard-id="${id}">
    <div class="song_cover">
        <div class='category' style='display: none;'>${category}</div>
        <a ${platform ? `href="${platform}"` : 'href=../html/article_template.html'}>
            <img ${image ? `src="${image}"` : ''}>
        </a>
       
    </div>

    <audio class="preview-audio" ${audio ? `src="${audio}"` : ''}></audio>
    
    <div class="song_title">${title}</div>
</div>`

}else if (type === 'code'){
    debug("========HTML IS CODE========");

    // category = coding language
    html =  `
<div class="song_item" data-subcard-id="${id}">
    <div class="song_cover">
        <div class='category' style='display: none;'>${category}</div>
         
        <img ${image ? `src="${image}"` : ''}>
        <div class="quote_overlay">
            ${description}
        </div>
        
       
    </div>

    <audio class="preview-audio" ${audio ? `src="${audio}"` : ''}></audio>
    
    <div class="song_title">${title}<br><span>${category}</span></div>
</div>`

}else if (type === 'art'){
    debug("========HTML IS ART========");

    
    html =  `
<div class="song_item" data-subcard-id="${id || ''}">
    <div class="song_cover">
        <div class='category' style='display: none;'>${category}</div>
         
        <img ${image ? `src="${image}"` : ''}>
        <div class="quote_overlay">
            ${description}
        </div>
        
       
    </div>

    <div class="song_title">${title}<br><span>${category}</span></div>
</div>`

}else if (type === 'photography'){
    debug("========HTML IS PHOTOGRAPHY========");

    
    html =  `
<div class="song_item" data-subcard-id="${id}">
    <div class="song_cover">
        <div class='category' style='display: none;'>${category}</div>
         
        <img ${image ? `src="${image}"` : ''}>
        <div class="quote_overlay">
            ${description}
        </div>
        
       
    </div>

    <div class="song_title">${title}<br><span>${category}</span></div>
</div>`

}else {
    debug("========HTML IS OTHER WHICH ISNT GOOD========");
    html =  `
<div class="song_item" data-subcard-id="${id}">
    <div class="song_cover">
        <div class='category' style='display: none;'>${category}</div>
        <a ${platform ? `href="${platform}" target='_blank'` : ''}>
            <img ${image ? `src="${image}"` : ''}>
        </a>
        <div class="quote_overlay">${description}</div>
    </div>
    
        <audio class="preview-audio" ${audio ? `src="${audio}"` : ''}></audio>
    
    <div class="song_title">${title}</div>
</div>
`
}
return html;
}


function addHeaderMiniText(header, miniText){
    debug("INSIDE addHeaderMiniText")
    const AddHeader = document.querySelector(".user_music_title");
    const AddMiniText = document.getElementById("mini_description_text");
    if (!AddHeader || !AddMiniText){
        console.error("Header and MiniText missing");
    }
    AddHeader.textContent = header;
    AddMiniText.textContent = miniText;
}


export async function loadCardById(shortId){
    const base = document.querySelector(".three_songs_per_row");
    base.innerHTML = '';
    base.style.textAlign = 'center';
            
    try{
        const response = await fetch(`/card/get/${shortId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { "Content-Type": 'application/json' }
        });
        const data = await response.json();
        p(`MESSAGE ${data.MESSAGE}`);
        if (response.ok && data.MESSAGE && !data.EMPTY){
            console.log(data.EMPTY);
            const u = data.CARDS;
            p('CARDS');
            console.log(u);
            const home = data.HOME;
            p('HOME');
            console.log(home);
            
        if (data.OWNER === false){
            
            debug("NOT OWNER")
            const likeBtn = document.getElementById("like-btn");
            const editBtn = document.querySelector(".edit-btn");
            const addBtn = document.querySelector(".add-btn");
            if (editBtn) editBtn.style.display = 'none';
            if (addBtn) addBtn.style.display = 'none';
            if (likeBtn) likeBtn.style.display = 'block';
            

        } else{
            const likeBtn = document.getElementById("like-btn");
            if (likeBtn) likeBtn.style.display = 'none';

        }
            addHeaderMiniText(home.header, home.miniText);
            p(`HEADER ${home.header}`);
            for (var i = 0; i < u.length; i++){
                const current_subCard = u[i];
                const current_id = current_subCard.id;
                const current_title = current_subCard.title;
                const current_category = current_subCard.category;  
                const current_imageLink = current_subCard.image;
                const current_audioLink = current_subCard.audio;
                const current_platformLink = current_subCard.platform;
                const current_cardDes = current_subCard.description;
                const current_type = current_subCard.content_type;
                debug(`CURRENT ID: ${current_id}`);
              
               console.log("SUBCARD ID:", current_subCard.id, "FULL OBJECT:", current_subCard);
            addSubcard(
                current_category,
                current_title,
                current_imageLink,
                current_audioLink,
                current_platformLink,
                current_cardDes, 
                current_type,
                current_id

            );}
        } else if(data.EMPTY){
            
            addHeaderMiniText(data.HOME.header, data.HOME.miniText);

            
            console.log("WE ARE EMPTY");
            const base = document.querySelector(".three_songs_per_row");
            base.style.textAlign = 'center';
            base.style.justifyContent = 'center';
            base.style.display = 'flex';
            
            
            base.innerHTML = '<h1>Card doesnt contain any content</h1>';
            
    
        }
        else {
            console.error(("User or Card not found:", data.ERROR));
        }
    } catch (e){
        console.error("Failed to load data:", e);
    }
}


// add_subcard.js

// --- DELETE BUTTON ---

function attachDeleteButton(element, subcardId) {
    // element is the .song_item or .art-item div
    // subcardId is the shortId stored on the element

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "subcard-delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.title = "Delete this piece";

    deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        // stopPropagation is important for art cards —
        // without it the click would also trigger the lightbox open

        const confirmed = confirm("Delete this piece? This cannot be undone.");
        if (!confirmed) return;

        try {
            const response = await fetch("/subcard/remove", {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subcard_id: subcardId })
            });

            const data = await response.json();

            if (response.ok && data.MESSAGE) {
                // Animate out then remove from DOM
                element.style.transition = "opacity 0.3s, transform 0.3s";
                element.style.opacity = "0";
                element.style.transform = "scale(0.85)";
                // Brief fade-out so the deletion feels intentional
                // rather than just blinking out of existence

                setTimeout(() => element.remove(), 300);
            } else {
                alert(data.ERROR || "Could not delete.");
            }

        } catch (err) {
            alert("Server unreachable.");
            console.error(err);
        }
    });

    element.appendChild(deleteBtn);
}

document.addEventListener("DOMContentLoaded", async () =>{

    const params = new URLSearchParams(window.location.search);

    const viewingCardId = params.get("card");
    debug("VIEWING CARD");
    debug(viewingCardId)

    if (viewingCardId){
        debug("Found ID")
        loadCardById(viewingCardId);
    } else {


    const response = await fetch(`/card/get/${viewingCardId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    p(`MESSAGE: ${data.MESSAGE}`);
    if (response.ok && data.MESSAGE){
        const cards = data.CARD;
        const home = data.HOME;
        debug("HOME the one im looking for");
        debug(home);
        debug("AFTER")
        debug(`HEADER ${home.header} MINI-TEXT ${home.miniText}`);
       

        addHeaderMiniText(home.header, home.miniText);
        for (var i = 0; i < cards.length; i++){
            const c = cards[i];
            addSubcard(c.category, 
                        c.title, 
                
                        c.image,
                        c.audio,
                        c.platform);
        }
    }}


    lucide.createIcons();

})