// add_card.js



const p = console.log;
const list_ = [];
export function addingCard(title, description, category, id, image_link = null) {
    if (!title || !category) return;

    const sections = document.querySelector(".different_sections");
    if (!sections) return;

    // Just append the one new card — no list needed
    sections.insertAdjacentHTML("beforeend", buildCardHTML({
        title, description, category, shortId: id, image: image_link
    }));
}




function buildCardHTML(data) {
    const { title, description, category, shortId, image } = data;
    let what;
    if (category === 'music'){
        what = 'music';
    } else if (category === 'article'){
        what = 'article';
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

    // Step 1 — try to load cards from Flask (the real source of truth)
    try {
        const response = await fetch("http://127.0.0.1:5000/user/card/get", {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok && data.CARDS && data.CARDS.length > 0) {
            appendToScreen(data.CARDS);
            p("Cards loaded from server.");
            return;  // done — don't fall through to localStorage
        }

    } catch (error) {
        p("Could not fetch cards from server:", error);
    }

    // Step 2 — fallback: if Flask had nothing or failed, check localStorage
    // This handles the case right after creation before a page reload
    const title    = localStorage.getItem("pf_CardTitle");
    const des      = localStorage.getItem("pf_CardDescription");
    const category = localStorage.getItem("pf_CardCategory");
    const sId      = localStorage.getItem("pf_CardShortId");

    if (title && category && sId) {
        addingCard(title, des, category, sId);
        p("Card loaded from localStorage fallback.");
    }
    lucide.createIcons();
});