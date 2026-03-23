// mainPageRole.js


document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener('click', ()=>{
        
        console.log(btn);
        const role = btn.dataset.page;
        
        localStorage.setItem("pf_mainPageOption", role.toLowerCase());

        
        window.location.href = `../html/main.html?page=${role}`;
        btn.className ='nav-item active';
    })
});