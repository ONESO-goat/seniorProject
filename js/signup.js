//import { createUserCardbase } from "./account.js";
// signup.js

document.addEventListener("DOMContentLoaded", () => {

    // --- STEP 1: Grab all the elements we need ---
    const roleButtons = document.querySelectorAll(".option-btn");
    const signupForm = document.getElementById("signup-form");
    const roleTag = document.getElementById("role-tag");
    const usernameInput = document.getElementById("signup-username");
    const emailInput = document.getElementById("signup-email");
    const passwordInput = document.getElementById("signup-password");
    const createBtn = document.getElementById("create-btn");
    const formMessage = document.getElementById("form-message");

    // Stores whichever role the user clicked
    let selectedRole = "";

    // --- STEP 2: Role button click — reveal the form ---
    roleButtons.forEach((button) => {
        button.addEventListener("click", () => {
            
            // Remove the "active" highlight from all buttons first
            roleButtons.forEach(btn => btn.style.borderColor = "");

            // Highlight the one they just clicked
            button.style.borderColor = "#00c2cb";

            // Read the data-role attribute we put on each button in the HTML
            selectedRole = button.getAttribute("data-role");

            // Update the small tag above the form to show which role was chosen
            roleTag.textContent = selectedRole;

            // Show the form by adding the "visible" class (CSS handles the display)
            signupForm.classList.add("visible");

            // Smoothly scroll down so the form is in view
            signupForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    });

    // --- STEP 3: Create Account button click ---
    createBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Read what the user typed
        const username = usernameInput.value.trim();
        let signup_email = emailInput.value.trim();
        
        const password = passwordInput.value.trim();

        // Clear any previous message
        formMessage.textContent = "";
        formMessage.className = "form-message";

        // Basic front-end checks before even hitting the server
        if (!username) {
            formMessage.textContent = "Please enter a username.";
            return;
        }

        if (!password) {
            formMessage.textContent = "Please enter a password.";
            return;
        }

        if (password.length < 8) {
            formMessage.textContent = "Password must be at least 8 characters.";
            return;
        }
    const possibleUserChoice = localStorage.getItem("pf_userChoice");

 // --- STEP 4: Send to Flask (Updated for Debugging) ---
fetch("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
        username: username,
        email: signup_email,
        password: password,
        role: possibleUserChoice ? possibleUserChoice : selectedRole
    })
})
.then(async (response) => {
    // 1. Capture the status and 'ok' before we turn it into JSON
    const statusCode = response.status;
    const isOk = response.ok;
    const data = await response.json();

    if (isOk && data.MESSAGE) {
        // Success Logic
        formMessage.textContent = "Account created! Redirecting...";
        formMessage.classList.add("success");


        // Store data
        localStorage.setItem("pf_username", data.DETAILS.username);
        localStorage.setItem("pf_shortid", data.DETAILS.shortId);
        localStorage.setItem("pf_email",   data.DETAILS.email);
        localStorage.setItem("pf_role",    data.DETAILS.role);

        
        setTimeout(() => {
            
            window.location.href = "../html/template.html";
        }, 1);

    } else {
        // Error Logic
        formMessage.classList.remove("success");
        formMessage.textContent = data.ERROR || "Unknown error occurred.";
        console.error(`Sign-up failed. Server said: ${statusCode}`, data);
    }
})
.catch(error => {
    formMessage.textContent = "Could not reach server. Is Flask running?";
    console.error("Fetch Error:", error);
});
    });
    
});






function debug(s){
    console.log(`[DEBUG] ${s}\n`)
}