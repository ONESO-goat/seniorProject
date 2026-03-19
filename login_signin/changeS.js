//changeS.js

const loginRole = localStorage.getItem("pf_loginRoleOption");
const p = console.log;
p(loginRole);

document.querySelectorAll(".option-btn").forEach(btn => {
    if (loginRole){

        const url = new URL(window.location);
        url.searchParams.set("role", loginRole);
        window.history.pushState({}, "", url);


        // show form
        document.getElementById("role-tag").textContent = loginRole;
        document.getElementById("signup-form").classList.add("visible");
        localStorage.setItem("pf_userChoice", loginRole);
        } else {
    btn.addEventListener("click", () => {
        
        const role = btn.dataset.role;

        // change URL without reload
        const url = new URL(window.location);
        url.searchParams.set("role", role);
        window.history.pushState({}, "", url);

        // show form
        document.getElementById("role-tag").textContent = role;
        document.getElementById("signup-form").classList.add("visible");
    })}})
        


