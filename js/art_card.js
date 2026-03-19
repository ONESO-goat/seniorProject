// art_card.js

// --- GRAB LIGHTBOX ELEMENTS ---
const lightbox       = document.getElementById("art-lightbox");
const lightboxPanel  = document.getElementById("lightbox-panel");
const lightboxImage  = document.getElementById("lightbox-image");
const lightboxTitle  = document.getElementById("lightbox-title");
const lightboxStyle  = document.getElementById("lightbox-style");
const lightboxDesc   = document.getElementById("lightbox-desc-text");
const lightboxClose  = document.getElementById("lightbox-close");
const lightboxFlip   = document.getElementById("lightbox-flip");

// Tracks whether we're showing the description or the image
let isFlipped = false;


// --- OPEN LIGHTBOX ---
// Called when a card is clicked — receives that card's data
function openLightbox(title, style, description, imageSrc) {

    // Populate the lightbox with this card's data
    lightboxImage.src  = imageSrc || '../images/betterPantho.png';
    lightboxTitle.textContent    = title || 'Untitled';
    lightboxStyle.textContent    = style || '';
    lightboxDesc.textContent     = description || 'No description provided.';

    // Always start on the image side, not the description
    isFlipped = false;
    lightboxPanel.classList.remove("flipped");
    lightboxFlip.textContent = "Show Description";

    // Show the overlay
    lightbox.classList.add("active");

    // Prevent the page from scrolling while lightbox is open
    document.body.style.overflow = "hidden";
}


// --- CLOSE LIGHTBOX ---
function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    // Restore normal scrolling
}


// --- FLIP between image and description ---
if (lightboxFlip){
    
    lightboxFlip.addEventListener("click", () => {
    isFlipped = !isFlipped;
    // Toggle the boolean each click

    lightboxPanel.classList.toggle("flipped", isFlipped);
    // classList.toggle(class, force) — if force is true it adds,
    // if false it removes. Cleaner than if/else here.

    lightboxFlip.textContent = isFlipped ? "Show Image" : "Show Description";
    // Update button label to reflect what clicking it will do next
});
}

// --- CLOSE on X button ---
if (lightboxClose){lightboxClose.addEventListener("click", closeLightbox);}


// --- CLOSE when clicking the dark background ---
if (lightbox){lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
    // Same pattern as the card modal — only closes if you click
    // the overlay itself, not the panel inside it
});
}

// --- CLOSE with Escape key ---
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeLightbox();
    }
});


// --- BUILD ART CARD HTML ---
// Called by add_subcard.js when rendering art pieces
export function buildArtCard(data) {
    const { title, category, image, description, id } = data;

    return `
<div class="art-item"
     data-title="${title || ''}"
     data-style="${category || ''}"
     data-description="${description || ''}"
     data-image="${image || ''}"
     id="${id || ''}">
    <img src="${image || '../images/betterPantho.png'}" alt="${title || 'Art piece'}">
    <div class="art-item-title">${title || 'Untitled'}</div>
</div>`;
}
// We store the card data as data-* attributes on the element itself.
// When clicked, JS reads them back out to populate the lightbox.
// This avoids needing a separate JS data store.


// --- ATTACH CLICK LISTENERS TO ALL ART CARDS ---
// Called after cards are added to the DOM
export function initArtCards() {
    const cards = document.querySelectorAll(".art-item");

    cards.forEach(card => {
        // Avoid attaching duplicate listeners if called multiple times
        if (card.dataset.initialized) return;
        card.dataset.initialized = "true";

        card.addEventListener("click", () => {
            const title       = card.dataset.title;
            const style       = card.dataset.style;
            const description = card.dataset.description;
            const image       = card.dataset.image;

            openLightbox(title, style, description, image);
        });
    });
}