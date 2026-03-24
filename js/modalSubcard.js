// modalSubcard.js
import { addSubcard } from './add_subcard.js'
import { debug } from './utils.js'
// --- GRAB ELEMENTS ---

// modalSubcard.js — add this block alongside your existing modal logic

// Grab the new elements

// IMAGES
const fileInput      = document.getElementById("art-file-input");
const uploadBtn      = document.getElementById("image-upload-btn");
const artPreview     = document.getElementById("art-preview");
const uploadArea     = document.getElementById("image-upload-area");
const uploadHint     = document.getElementById("image-upload-hint");

// This variable holds the base64 string of the selected image
// It's declared at module scope so the submit handler can read it
let selectedImageBase64 = null;

// Clicking the button OR the dashed area opens the file picker
if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
        fileInput.click();
        // fileInput is hidden — .click() programmatically opens
        // the OS file browser / camera roll
    });
}

if (uploadArea) {
    uploadArea.addEventListener("click", (e) => {
        // Only trigger if they didn't click the button itself
        // (button has its own listener above, avoid double-firing)
        if (e.target !== uploadBtn) {
            fileInput.click();
        }
    });
}

// When the user picks a file
if (fileInput) {
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        // files[0] is the first selected file
        // accept="image/*" on the input means only images appear in the picker

        if (!file) return;

        // FileReader is a built-in browser API that reads file contents
        const reader = new FileReader();

        reader.onload = (e) => {
            // e.target.result is the full base64 string
            // looks like: "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
            selectedImageBase64 = e.target.result;

            // Show the preview image
            artPreview.src = selectedImageBase64;
            artPreview.style.display = "block";

            // Update the hint text to show the filename
            uploadHint.textContent = file.name;

            // Add the has-image class to shrink the dashed border area
            uploadArea.classList.add("has-image");
        };

        // This is what actually starts the read — without this line nothing happens
        reader.readAsDataURL(file);
    });
}



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

     selectedImageBase64 = null;
    if (artPreview) {
        artPreview.src = "";
        artPreview.style.display = "none";
    }
    if (uploadHint) uploadHint.textContent = "No image selected";
    if (uploadArea) uploadArea.classList.remove("has-image");
    if (fileInput)  fileInput.value = "";

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
    var type;
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

        if (category){
            const cata = await fetch("/category/get",{
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stuff: category
                })
            })
            const d = await cata.json();
            type = d.TYPE;
        }
        if (!selectedImageBase64 && type === 'art' || !selectedImageBase64 && type === 'photography') {
            setMessage("Please select an image.");
            return;
        }

        const response = await fetch("/subcard/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            
            body: JSON.stringify({
                title: title,
                category: category,
                description: description,
                card_id: currentCardShortId,
                image: selectedImageBase64
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
            debug(data);
            debug(category);
            debug(title);
            debug(description);
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




