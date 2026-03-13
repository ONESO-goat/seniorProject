// aboutme.js
export function createAboutme(des) {

    const Hi = document.querySelector(".more_of_me");
    if (Hi) {
        Hi.textContent += des;
    }
}





document.addEventListener("DOMContentLoaded", async () => {
    //const username = localStorage.getItem("pf_username");
    //createAboutme(username);
    const Hi = document.querySelector(".more_of_me");
    if (Hi) {
        try {
            const response = await fetch("http://127.0.0.1:5000/user/aboutme/get", {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.MESSAGE) {
                createAboutme(data.ABOUT);
            } else {
                console.error("Error fetching about me:", data.ERROR);
            }
        } catch (e) {
            console.error("Fetch failed:", e);
        }
    }
 

    // EDIT BUTTON
    const editBtn = document.querySelector(".edit-btn");
    const current = document.querySelector(".more_of_me");
    const displayText = document.getElementById("display-text");
    const editInput = document.getElementById("edit-input");
    const editBtnText = editBtn.querySelector("span");

    let isEditing = false;
    if (!editBtn || ! displayText) {
        console.error("Missing elements! EditBtn:", editBtn, "MoreOfMe:", displayText);
        return; // Stop the script here so it doesn't crash on the 'style' line
    }
    editBtn.addEventListener("click", async () => {
        if (!isEditing) {
            // --- ENTERING EDIT MODE ---
            isEditing = true;
            editBtnText.textContent = "Save";
            
            // Sync current text to the input
            editInput.value = current.textContent;
            
            
            // Swap visibility
            displayText.style.display = "none";
            editInput.style.display = "block";
            editInput.focus();
        } else {
            // --- SAVING CHANGES ---
            const updatedText = editInput.value;
           

             const response = await fetch('http://127.0.0.1:5000/user/aboutme/edit', { 
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: updatedText
                })
             });

             if(!response){
                return;
             }
             const data = await response.json();
             if (!data){
                return;
             }

             if (response.ok && data.MESSAGE){
                const userDes = data.ABOUT;
                current.textContent = userDes;
                if(displayText) displayText.textContent = userDes;
                if(displayText) displayText.style.display = "block";
                editInput.style.display = "none";
                
                editBtnText.textContent = "Edit";
                isEditing = false;

                lucide.createIcons();
             } else {
                alert(data.ERROR || "Failed to save.");
                console.log(`unexpected error when processing about: ${data.ERROR}`)
             }


            
        }
    });
    lucide.createIcons();
});