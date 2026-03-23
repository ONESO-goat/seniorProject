// add_users_to_screen.js

export function appendToMainScreen(username, action_word, followerCount, short_id){
    const section = document.getElementById("user-section");
    if (section) section.style.display = '';
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
export async function discovery() {

    const s = ` <a href="../html/my_page.html" class="profile-card color-override">
                <div class="card-cover"></div>
                <div class="card-content">
                    <img src="../images/betterPantho.png" class="card-avatar">
                    <h3>Julius Cylien</h3>
                    <p>Digital God</p>
                    <div class="card-stats">
                        <span><strong id="follower-count">206M</strong> followers</span>
                    </div>
                </div>
            </a>`
    const firstAdd = document.getElementById("user-section");
firstAdd.insertAdjacentHTML('afterbegin',s);
    

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
    }}
