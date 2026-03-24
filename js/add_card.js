// add_card.js



const p = console.log;
const list_ = [];

export function addingCard(title, description, category, id, image_link = null) {
    if (!title || !category) {p('TITLE OR CATEGORY NOT FOUND.'); return;}
    p('insdie addingCard');
    p("Title: " + title + ", description: " + description + ", id: " + id);

    const sections = document.querySelector(".different_sections");
    

    if (!sections) return;
   

    // Just append the one new card — no list needed
    sections.insertAdjacentHTML("beforeend", buildCardHTML({
        title, description, category, shortId: id, image: image_link
    }));
}




function buildCardHTML(data) {
    const { title, description, category, shortId, image } = data;
    var what;
    if (category === 'music'){
        what = 'music';
    } else if (category === 'article'){
        what = 'article';
    } else if (category === 'code'){
        what = 'code';
    } else if (category === 'art'){
        what = 'art';
    } else if (category === 'photography'){
        what = 'photography';
    } else {
        what = 'other';
    }
    return `
<div class="card-item" id="${shortId}">
    <div class="name_of_boxes"><h1>${title.toUpperCase()}</h1></div>
    <div class="boxes">
        <div class="article_left">
            <a href="../html/new_page_${what}.html?card=${shortId}" class="card_link">
                <img class="article_image" src="${image ? image : '../images/betterPantho.png'}">
                <div class="mini_description_under_photo">${category.toLowerCase()}</div>
            </a>
        </div>
        <div class="main_description_of_section">
            ${description ? description : 'New Card'}
        </div>
    </div>
</div>`;
}

function appendToScreen(userCards) {
    const sections = document.querySelector(".different_sections");
    if (!sections) return;

    sections.innerHTML = "";  // clear first to avoid duplicates

    for (let i = 0; i < userCards.length; i++) {
        sections.insertAdjacentHTML("beforeend", buildCardHTML(userCards[i]));
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const viewingUserId = params.get("user");

    if (viewingUserId) {
        // We're on someone else's profile — account.js handles their cards
        // add_card.js should do nothing here
        lucide.createIcons();
        return;
    }
    const sections = document.querySelector(".different_sections");
            
    sections.innerHTML = '';
    
    sections.style.textAlign = 'center';

    try {
        const response = await fetch("/user/card/get", {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        console.log(`DATA ${data.CARDS}`);
        if (response.ok && data.CARDS && !data.EMPTY) {
            console.log(data.CARDS);
            appendToScreen(data.CARDS);
            p("Cards loaded from server.");
            //return;  // done — don't fall through to localStorage
        } else if (data.EMPTY || data.CARDS === undefined){
            console.log("[USER TEMPLATE] WE ARE EMPTY");
            //const sections = document.querySelector(".different_sections");
            
            sections.insertAdjacentHTML('afterbegin', '<h1>User doesnt have any cards</h1>');
            return;
        }

    } catch (error) {
        p("Could not fetch cards from server:", error);
    }

     const justCreated = localStorage.getItem("pf_justCreatedCard");
    if (justCreated) {
        const title    = localStorage.getItem("pf_CardTitle");
        const des      = localStorage.getItem("pf_CardDescription");
        const category = localStorage.getItem("pf_CardCategory");
        const sId      = localStorage.getItem("pf_CardShortId");
        if (title && category && sId) {
            addingCard(title, des, category, sId);
        }
        localStorage.removeItem("pf_justCreatedCard");
    lucide.createIcons();
}});