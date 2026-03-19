    // edit_subcard.js
    
    const p = console.log
    const editBtn = document.querySelector(".edit-btn");

    const errorField = document.getElementById("error-check");

    const headerText = document.querySelector(".user_music_title");

    const headerTextArea = document.getElementById("header-textarea");

    const miniText = document.getElementById("mini_description_text");

    const miniTextArea = document.getElementById("text-textarea");

    const editBtnText = editBtn.querySelector("span");
    p(miniTextArea)
    
    p(miniTextArea)
    let isEditing = false;
    if (!editBtn || !miniText || !headerText) {
        console.error("Missing elements! EditBtn: " + editBtn + " MiniText: " + miniText + ' Header: ' + headerText);
        
    }
    editBtn.addEventListener("click", async () => {
        if (!isEditing) {
            // --- ENTERING EDIT MODE ---
            isEditing = true;
            editBtnText.textContent = "Save";
            
            // Sync current text to the input
            headerTextArea.value = headerText.textContent;
            miniTextArea.value = miniText.textContent;
            
            
            // Swap visibility
            headerText.style.display = "none";
            headerTextArea.style.display = "block";
            miniText.style.display = "none";
            miniTextArea.style.display = "block";

            headerTextArea.focus();
        } else {
            // --- SAVING CHANGES ---
            const updatedMiniText = miniTextArea.value;
            const updatedHeaderText = headerTextArea.value;


           
try{
            const params = new URLSearchParams(window.location.search);

            const Id = params.get("card");

            if (!Id){
                console.error("Error grabbign card id");
                return;
            }

             const response = await fetch('http://127.0.0.1:5000/card/edit', { 
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    header: updatedHeaderText,
                    miniText: updatedMiniText,
                    cardId: Id
                })
             });

             const data = await response.json();
             if (response.ok && data.MESSAGE){
                const updated = data.SET;

                headerText.textContent = updated['header'];
                miniText.textContent = updated['miniText'];
                
                //if(headerText) headerText.textContent = updatedHeaderText;
                //if(headerText) headerText.style.display = "block";
                //if(miniText) miniText.style.display = "block";

                headerText.style.display = "block";
                headerTextArea.style.display = "none";
                miniText.style.display = "block";
                miniTextArea.style.display = "none";


                editBtnText.textContent = "Edit";
                isEditing = false;

                lucide.createIcons();
             } else {
                
                p(errorField);
                errorField.style.display = 'block';
                errorField.textContent = data.ERROR;
                console.error(data.ERROR || "Failed to save.");

            }} catch (e){
                console.error(e);
             }


            
        }
    });
    lucide.createIcons();