document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".logout");

    logoutButton.addEventListener("click", ()=>{
        fetch("http://127.0.0.1:5000/auth/logout", {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            credentials:"include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.MESSAGE) {
                
                window.location.href = "../login_signin/index.html";
            } else if (data.ERROR) {
                alert("logout failed: " + data.ERROR);
            }
        })
        .catch(error => {
            alert("Could not reach server. Is Flask running?");
            console.error(error);
        });
    })
})