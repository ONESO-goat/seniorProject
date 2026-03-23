// edit_subcard.js — wrap everything in DOMContentLoaded
// and check the card owner first

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get("card");

    if (!cardId) return;

    // ✅ Check ownership before touching any buttons
    try {
        const response = await fetch(`http://127.0.0.1:5000/card/get/${cardId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        // ✅ If not owner, hide edit btn and stop entirely
        if (!data.OWNER) {
            console.log("THE USER IS NOT THE OWNER OF THIS CARD.")
            const likeBtn = document.getElementById("like-btn");
            const editBtn = document.querySelector(".edit-btn");
            const addBtn  = document.querySelector(".add-btn");
            if (addBtn) addBtn.style.display = 'none';
            if (editBtn) editBtn.style.display = 'none';
            if (likeBtn) likeBtn.style.display = 'block';
            return; // ← stops the rest of edit_subcard.js from running
        }

    } catch (e) {
        console.error("Ownership check failed:", e);
        return;
    }

    // Only reach here if OWNER === true
    const likeBtn = document.getElementById("like-btn");
    const editBtn = document.querySelector(".edit-btn");
    if (!editBtn || !likeBtn) return;
    likeBtn.style.display = 'none';


    const errorField   = document.getElementById("error-check");
    const headerText   = document.querySelector(".user_music_title");
    const headerTextArea = document.getElementById("header-textarea");
    const miniText     = document.getElementById("mini_description_text");
    const miniTextArea = document.getElementById("text-textarea");
    const editBtnText  = editBtn.querySelector("span");

    let isEditing = false;

    editBtn.addEventListener("click", async () => {
        if (!isEditing) {
            isEditing = true;
            editBtnText.textContent = "Save";
            headerTextArea.value = headerText.textContent;
            miniTextArea.value = miniText.textContent;
            headerText.style.display = "none";
            headerTextArea.style.display = "block";
            miniText.style.display = "none";
            miniTextArea.style.display = "block";
            headerTextArea.focus();

        } else {
            const updatedMiniText = miniTextArea.value;
            const updatedHeaderText = headerTextArea.value;
            const Id = params.get("card");
            if (!Id) { console.error("Card id missing"); return; }

            try {
                const response = await fetch('http://127.0.0.1:5000/card/edit', {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        header: updatedHeaderText,
                        miniText: updatedMiniText,
                        cardId: Id
                    })
                });
                const data = await response.json();

                if (response.ok && data.MESSAGE) {
                    const updated = data.SET;
                    headerText.textContent = updated['header'];
                    miniText.textContent = updated['miniText'];
                    headerText.style.display = "block";
                    headerTextArea.style.display = "none";
                    miniText.style.display = "block";
                    miniTextArea.style.display = "none";
                    editBtnText.textContent = "Edit";
                    isEditing = false;
                    lucide.createIcons();
                } else {
                    if (errorField) {
                        errorField.style.display = 'block';
                        errorField.textContent = data.ERROR;
                    }
                    console.error(data.ERROR || "Failed to save.");
                }
            } catch (e) {
                console.error(e);
            }
        }
    });

    lucide.createIcons();
});