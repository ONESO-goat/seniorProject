
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".logout");
    const pfp = document.getElementById('user-logo');
    const init = localStorage.getItem('pf_username');
    if (pfp){
        pfp.textContent = init;
    }

    logoutButton.addEventListener("click", ()=>{
        fetch("/auth/logout", {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            credentials:"include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.MESSAGE) {
                localStorage.clear();
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