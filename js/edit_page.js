// edit_page.js
import { addDeleteButtons, removeDeleteButtons } from "./delete_card.js";

function addDesAction(des, action){

    const a = document.getElementById("action_word");
    const d = document.getElementById('template-description');
    if (a && d) {
        a.textContent=action;
        d.textContent=des;
    } 
}



document.addEventListener("DOMContentLoaded", async () =>{

    
    const action = document.getElementById("action_word");
    const fdes = document.getElementById('template-description');
    action.innerHTML = '';
    fdes.innerHTML = '';
        if (action && fdes) {
            try {
                const response = await fetch("/user/template/get", {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (response.ok && data.MESSAGE) {
                    const sEt = data.SET;
                    const des = sEt['description'];
                    const actionWord = sEt['action_word'];
                    addDesAction(des, actionWord);
                } else {
                    console.error("Error fetching template_data:", data.ERROR);
                }
            } catch (e) {
                console.error("Fetch failed:", e);
            }
        }











    const editBtn = document.querySelector('.edit-btn');

    const editBtnText = editBtn.querySelector("span");

    const current_des = document.getElementById("template-description");

    const des_textaera = document.getElementById("description-textarea");

    const current_actionWord = document.getElementById("action_word");

    const actionWord_textaera = document.getElementById("actionWord-textarea");

    let isEditing = false;
        if (!editBtn || ! current_actionWord || ! current_des) {
        console.error("Missing elements! EditBtn:", editBtn, "ActionWord:", current_actionWord, 'Description:', current_des);
        return; 
    }

    editBtn.addEventListener("click", async () => {
        if (!isEditing) {
            // --- ENTERING EDIT MODE ---
            isEditing = true;
            editBtnText.textContent = "Save";
            
            // Sync current text to the input
            des_textaera.value = current_des.textContent;
            actionWord_textaera.value = current_actionWord.textContent;
            
            
            // Swap visibility
            addDeleteButtons();
            current_des.style.display = "none";
            current_actionWord.style.display = 'none';
            actionWord_textaera.style.display = "block";
            des_textaera.style.display = 'block';
            //actionWord_textaera.focus();
            //let actionFocus = true;
            //let desFocus = false;
            /*document.addEventListener('keydown', function(event){
                if(event.key === 'Enter' && actionWord_textaera.focus()){
                    des_textaera.focus();
                    actionFocus = false;
                    desFocus = true;
                } else if (event.key === 'ArrowDown' && actionFocus){
                    des_textaera.focus();
                    actionFocus = false;
                    desFocus = true;
                } else if (event.key === 'ArrowUp' && desFocus){
                    actionWord_textaera.focus();
                    actionFocus = true;
                    desFocus = false;
                }

            

            
            })*/
        

        } else{
            removeDeleteButtons();
            const updated_actionWord = actionWord_textaera.value;
            const updated_des = des_textaera.value; 
            /*if (updated_des === current_des && updated_actionWord === current_actionWord){
                isEditing = false;

                current_des.style.display = "block";
                current_actionWord.style.display = 'block';
                actionWord_textaera.style.display = "none";
                des_textaera.style.display = 'none';
                    
                current_actionWord.textContent = action_word;
                
                current_des.textContent = des;

                editBtnText.textContent = "Edit";
                

                lucide.createIcons();
                
                return;
            }*/
        try{
            const response = await fetch("/user/frontpage/edit", {
                method: 'PATCH',
                credentials: 'include',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    actionWord: updated_actionWord,
                    description: updated_des
                                })
            })
            const data = await response.json();

            if(response.ok && data.MESSAGE){

                const set = data.SET;

                const action_word = set['actionWord'];
                const des = set['description'];

                current_des.style.display = "block";
                current_actionWord.style.display = 'block';
                actionWord_textaera.style.display = "none";
                des_textaera.style.display = 'none';
                    

                current_actionWord.textContent = action_word;
                current_des.textContent = des;

                
                editBtnText.textContent = "Edit";
                isEditing = false;

                lucide.createIcons();

            } else {
                alert(data.ERROR || "Failed to save.");
                console.log(`unexpected error when processing about: ${data.ERROR}`)
             }} 
             catch(e){
                console.error(e);
             }
        }})

    const back_button = document.querySelector('.back-btn');
    let m = console.log;

    m("INSIDE DOCUMENT CHECK LOOKING FOR BACK");
    back_button.addEventListener("click", async () => {
        m("BACK WAS PUSHED!!!!");
        try{
        const get_id = await fetch('/user/get/id', {
            method: 'GET', 
            credentials: 'include', 
            headers: { "Content-Type": 'application/json'}
        })

        const d = await get_id.json();
        m(d);
        if (d.MESSAGE && get_id.ok){
            const set = d.SET;
            localStorage.setItem("pf_same_user_shortId", set.short);
        } else{
            console.error(data.ERROR || "Error when getting user id.");
        }} catch (e){
            console.error(`Server crash getting user id: ${e}`);
        }
        
    })
    lucide.createIcons();
})