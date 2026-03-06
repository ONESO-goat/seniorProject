import { createUserCardbase } from "./account.js";
// auth.js

document.addEventListener("DOMContentLoaded", ()=> {
    const inputs = document.querySelectorAll('.nav-input');
    const usernameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = document.querySelector(".login-submit");

    loginButton.addEventListener("click", ()=> {
        console.log(`${usernameInput}`);
        console.log(`${usernameInput.value}`);
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (!username || !password){
            alert("Please fill both username and password");
            return;
        }

        fetch("http://127.0.0.1:5000/auth/login", {
                method: 'POST',
                headers: {'Content-Type': "application/json"},
                credentials:'include',
                body: JSON.stringify({"username": username, "password": password})
            }) 
        .then(response => response.json())
        .then(data => {
           console.log("FULL SERVER RESPONSE:", data);
            if (data.MESSAGE) {
                localStorage.setItem("pf_username", data.DETAILS.username);
                localStorage.setItem("pf_shortid",  data.DETAILS.shortId);
                localStorage.setItem("pf_email",    data.DETAILS.email);
                localStorage.setItem("pf_role",     data.DETAILS.role);


                window.location.href = "../html/template.html";

              
                
            } else if (data.ERROR) {
                alert("Login failed: " + data.ERROR);
            }
        })
        .catch(error => {
            alert("Could not reach server. Is Flask running?");
            console.error(error);
        });



    

    });
    

});




function _trash(){
    const choice = document.querySelectorAll(".option-btn");
        
        choice.forEach((button) => {
            button.addEventListener("click", () => {
            const role = choice.trim();

            window.location.href = `../login_signin/signup.html?role=${encodeURIComponent(role)}`});

        });
}