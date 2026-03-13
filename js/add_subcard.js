import { debug } from "./utils.js";
// add_subcard.js
export function addSubcard(category,
                     title,
                     image_link,
                     audio_link=null,
                     platform_link=null,
                     description=''
){
    if (!image_link){
        image_link = '../images/buttercup.jpg'
    }
    const base = document.querySelector(".three_songs_per_row");
    if (!base){
        return;
    }

    base.insertAdjacentHTML('beforeend', htmlStructure({
        title: title, 
        category: category,
        image: image_link,
        audio: audio_link,
        platform: platform_link ,
        description
    }))
}

function addExistingSubcard(category,
                     title,
                     image_link,
                     audio_link=null,
                     platform_link=null,
                     description=''
){

    const base = document.querySelector(".three_songs_per_row");
    if (!base){
        return;
    }

    base.insertAdjacentHTML('beforeend', htmlStructure({
        title: title, 
        category: category,
        image: image_link,
        audio: audio_link,
        platform: platform_link ,
        description
    }))
}



function htmlStructure(data){
    const { title, category, image, audio, platform, description } = data;
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
    try{
        const response = await fetch(`http://127.0.0.1:5000/card/get/${shortId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { "Content-Type": 'application/json' }
        });
        const data = await response.json();
        if (response.ok && data.MESSAGE){
        
            const u = data.CARDS;
            
            const home = data.HOME;
            debug("HOME");
            debug(home);
        

            if (data.OWNER === false){
            const editBtn = document.querySelector(".edit-btn");
            const addBtn = document.querySelector(".add-btn");
            if (editBtn) editBtn.style.display = 'none';
            if (addBtn) addBtn.style.display = 'none';
        }
            addHeaderMiniText(home.header, home.miniText);

            for (var i = 0; i < u.length; i++){
                const current_subCard = u[i];
                const current_title = current_subCard.title;
                const current_category = current_subCard.category;  
                const current_imageLink = current_subCard.image;
                const current_audioLink = current_subCard.audio;
                const current_platformLink = current_subCard.platform;
                const current_cardDes = current_subCard.description;
              
               
            addExistingSubcard(
                current_category,
                current_title,
                current_imageLink,
                current_audioLink,
                current_platformLink,
                current_cardDes

            );}
        } 
        else {
            console.error(("User or Card not found:", data.ERROR));
        }
    } catch (e){
        console.error("Failed to load data:", e);
    }
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


    const response = await fetch(`http://127.0.0.1:5000/card/get/${viewingCardId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    if (response.ok && data.MESSAGE){
        const cards = data.CARD;
        const home = data.HOME;
        debug("HOME");
        debug(home);
       

        addHeaderMiniText(home.header, home.miniText);
        for (var i = 0; i < cards.length; i++){
            const c = cards[i];
            addSubcard(c.title, 
                        c.category, 
                        c.image,
                        c.platform);
        }
    }}


    lucide.createIcons();

})