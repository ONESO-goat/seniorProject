document.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener('click', ()=>{

        const role = btn.dataset.role;
        console.log(role);
        localStorage.setItem("pf_loginRoleOption", role);
        window.location.href = `../login_signin/signin.html?role=${role}`;
    })
});