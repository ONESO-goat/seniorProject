// modalSubcard.js
import { addSubcard } from './add_subcard.js'
import { debug } from './utils.js'
// --- GRAB ELEMENTS ---

const addBtn = document.querySelector(".add-btn");
// The + button already in your template.html

const modal = document.getElementById("subcard-modal");
// The whole overlay div

const closeBtn = document.getElementById("modal-close");
const cancelBtn = document.getElementById("modal-cancel");
// Both close the modal — wired up separately but do the same thing

const submitBtn = document.getElementById("modal-submit");
// The "Create Card" button

const titleInput = document.getElementById("card-title");
const categoryInput = document.getElementById("card-category");
const descInput = document.getElementById("card-description");
// The three form fields

const modalMessage = document.getElementById("modal-message");
// The small error/success text line at the bottom of the form


// --- HELPER FUNCTIONS ---

function openModal() {
    modal.classList.add("active");
    // Adding "active" triggers the CSS opacity and translateY transitions
    // making the overlay fade in and the box slide up
    titleInput.focus();
    // Automatically puts the cursor in the title field — small UX detail
}

function closeModal() {
    modal.classList.remove("active");
    // Removing "active" reverses the CSS transitions — fades out

    // Clear all fields so next time the modal opens it's fresh
    titleInput.value = "";
    categoryInput.value = "";
    descInput.value = "";
    modalMessage.textContent = "";
    modalMessage.className = "modal-message";
}

function setMessage(text, isSuccess = false) {
    // isSuccess is a parameter with a default value of false
    // If you call setMessage("done!", true) it goes green
    // If you call setMessage("error") it stays red (default)
    modalMessage.textContent = text;
    modalMessage.className = isSuccess ? "modal-message success" : "modal-message";
    // The ternary operator: condition ? valueIfTrue : valueIfFalse
}


// --- EVENT LISTENERS ---
if (addBtn){
addBtn.addEventListener("click", () => {
    openModal();
});}
// + button opens the modal

if(closeBtn){
closeBtn.addEventListener("click", () => {
    closeModal();
});}

if (cancelBtn){
cancelBtn.addEventListener("click", () => {
    closeModal();
});}
// Both close buttons call the same closeModal function

if (modal){
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});}
// Clicking the dark OVERLAY (not the white box) also closes it.
// e.target is what was actually clicked.
// If the user clicks the white box, e.target is modal-box, not modal-overlay,
// so the condition is false and the modal stays open. Only clicking the
// dark background itself passes the check.


// --- SUBMIT ---
if (submitBtn){
submitBtn.addEventListener("click", async () => {

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const description = descInput.value.trim();

    if (!title) {
        setMessage("Please enter a title.");
        return;
    }

    if (!category) {
        setMessage("Please choose a category.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating...";



    try {
        const params = new URLSearchParams(window.location.search);

        const currentCardShortId = params.get("card");
        debug("CURRENT CARD ID;")
        debug(currentCardShortId);
        debug(category);
        if (!currentCardShortId){
            console.error("ID NOT FOUND IN URL.")
            return;

        }

        const response = await fetch("http://127.0.0.1:5000/subcard/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            
            body: JSON.stringify({
                title: title,
                category: category,
                description: description,
                card_id: currentCardShortId
            })
        });

        const data = await response.json();

        if (response.ok && data.MESSAGE) {
            setMessage("Card created!", true);
            // true = success = green text
            const shortId = data.ID; 
            console.log(`SHORTID: ${shortId}`);
            localStorage.setItem("pf_SubcardDescription", description);
            localStorage.setItem("pf_SubcardTitle", title);
            localStorage.setItem("pf_SubcardCategory", category);
            localStorage.setItem("pf_SubcardShortId", shortId);
            
            setTimeout(() => {
                addSubcard(title, description, category, data.ID);
                closeModal();
            }, 800);
            // Brief pause so user sees the success message before modal closes

        } else {
            setMessage(data.ERROR || "Something went wrong.");
        }

    } catch (error) {
     
        setMessage("Could not reach server.");
        console.error(error);

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Create Card";
    }
});}