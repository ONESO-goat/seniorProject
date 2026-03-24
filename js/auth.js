

document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll('.nav-input');
    const usernameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = document.querySelector(".login-submit");

    if (!loginButton) {
        console.error("Login button not found");
        return;
    }

    loginButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Please fill both username and password");
            return;
        }

        try {
            const response = await fetch("/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username: username, password: password })
            });

            // ✅ await before using data
            const data = await response.json();
            console.log("FULL SERVER RESPONSE:", data);

            if (response.ok && data.MESSAGE) {
                // ✅ Clear old user's card data
                localStorage.removeItem("pf_CardTitle");
                localStorage.removeItem("pf_CardDescription");
                localStorage.removeItem("pf_CardCategory");
                localStorage.removeItem("pf_CardShortId");

                // ✅ Store new user's data
                localStorage.setItem("pf_username", data.DETAILS.username);
                localStorage.setItem("pf_shortid",  data.DETAILS.shortId);
                localStorage.setItem("pf_email",    data.DETAILS.email);
                localStorage.setItem("pf_role",     data.DETAILS.role);

                window.location.href = "../html/template.html";

            } else {
                alert("Login failed: " + (data.ERROR || "Unknown error"));
            }

        } catch (error) {
            // ✅ catch handles network failures
            alert("Could not reach server. Is Flask running?");
            console.error(error);
        }
    });
});