

function appendToMainScreen(username, action_word, followerCount, short_id){
    const page = document.getElementById("user-section");
    if (!page){
        alert();
        return;
    }
    try{
    let html = structure(username, action_word, followerCount, short_id);
    page.insertAdjacentHTML("beforeend", html);
    } catch (e){
        alert("Error occured when processing main page.");
        console.log(e);
    }
}

function structure(name, actWord, follow_count, shortId){


    let structure = `
    
    <a href="../html/template.html?user=${shortId}" class="profile-card color-override">
            <div class="card-cover"></div>
                <div class="card-content">
                    <img src="../images/betterPantho.png" class="card-avatar">
                    <h3>${name.toUpperCase()}</h3>
                    <p>${actWord}</p>
                    <div class="card-stats">
                        <span><strong id='follower-count'>${follow_count}</strong> followers</span>
                    </div>
                </div>
            </a>`
        return structure;
}
document.addEventListener("DOMContentLoaded", async (e) =>{
    const response = await fetch("http://127.0.0.1:5000/auth", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials:'include'
    });

    const data = await response.json();
    try{
    if (response.ok && data.MESSAGE){
        const stuff = data.STUFF;
        for (let i = 0; i<stuff.length; i++){
            const current = stuff[i];

            const name = current['username'];

            const actionWord = current['actionWord'];

            const folowers = current['followers'];

            const shortId = current['shortId'];

            appendToMainScreen(name, actionWord, folowers, shortId);
    }} else {
        alert("ERROR while getting data for front page.");
    } }
    catch{
        console.log(data.ERROR || 'Server crash occured.'); 
        return;
    }
})