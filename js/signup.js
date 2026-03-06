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
        const email = emailInput.value.trim();
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

        // --- STEP 4: Send to Flask ---
        fetch("http://127.0.0.1:5000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                role: selectedRole
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(" ============ [DEBUG] FULL SERVER RESPONSE:", data, "=============");
            if (data.MESSAGE) {
                // Success — show green message then redirect
                formMessage.textContent = "Account created! Redirecting...";

                formMessage.classList.add("success");

                localStorage.setItem("pf_username", data.DETAILS.username);
                localStorage.setItem("pf_shortid", data.DETAILS.shortId);
                localStorage.setItem("pf_email",   data.DETAILS.email);
                localStorage.setItem("pf_role",    data.DETAILS.role);

                console.log(response.status);
                console.log(response.ok);
                console.log(response.status);
                console.log(response.ok);
                
                setTimeout(async () => { // Added async in case you need to parse response.json()
    console.log("Status Code:", response.status);
    console.log("Response OK:", response.ok);

    if (response.ok) {
        console.log("Redirecting to template...");
        window.location.href = "../html/template.html";
    } else {
        // This is the most important part for debugging!
        const errorText = await response.text(); 
        console.error(`Redirect failed. Server said: ${response.status} - ${errorText}`);
        
        // Optional: Alert yourself so you don't miss it in the console
        alert("Sign-up failed! Check the console for details.");
    }
}, 1200);



            } else if (data.ERROR) {
                // Show Flask's error message in red
                formMessage.textContent = data.ERROR;
            }
        })
        .catch(error => {
            formMessage.textContent = "Could not reach server. Is Flask running?";
            console.error(error);
        });
    });
    
});


