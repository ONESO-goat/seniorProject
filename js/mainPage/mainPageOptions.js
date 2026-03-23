// mainPageOptions.js

import { discovery, appendToMainScreen } from './add_users_to_screen.js';

export async function leaderBoard() {
    const section = document.getElementById("user-section");
    if (!section) return;

    // Clear whatever was there before (e.g. discovery cards)
    section.innerHTML = '';

    // Override the grid layout for this view
    // user-grid CSS uses grid with auto-fill columns — we replace it
    // with our own flex container instead
    section.style.display = 'block';

    try {
        const response = await fetch("http://127.0.0.1:5000/users/points/get", {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok && data.MESSAGE) {
            const users = data.STUFF;

            // Create the vertical container
            const list = document.createElement("div");
            list.className = "leaderboard-list";

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const rank = user.rank;   // Flask already calculated this

                // Determine which rank class to apply
                // rank-1, rank-2, rank-3 get special gold/silver/bronze styles
                // everyone else gets the base style
                let rankClass = '';
                if (rank === 1) rankClass = 'rank-1';
                else if (rank === 2) rankClass = 'rank-2';
                else if (rank === 3) rankClass = 'rank-3';

                // Medal emoji for top 3 — small touch that makes it feel polished
                let rankDisplay;
                if (rank === 1) rankDisplay = '🥇';
                else if (rank === 2) rankDisplay = '🥈';
                else if (rank === 3) rankDisplay = '🥉';
                else rankDisplay = `#${rank}`;

                const card = document.createElement("a");
                card.className = `lb-card ${rankClass}`;
                card.href = `../html/template.html?user=${user.shortId}`;

                card.innerHTML = `
                    <div class="lb-rank">${rankDisplay}</div>
                    <img class="lb-avatar" src="../images/betterPantho.png" alt="${user.username}">
                    <div class="lb-info">
                        <h3>${user.username}</h3>
                        <p>${user.actionWord || 'PanthoFlow member'}</p>
                    </div>
                    <div class="lb-points">${user.points} pts</div>
                `;

                list.appendChild(card);
            }

            section.appendChild(list);

        } else {
            section.innerHTML = '<p style="color:#b2bec3; padding:20px;">Could not load leaderboard.</p>';
            console.error(data.ERROR || "Error loading leaderboard");
        }

    } catch (e) {
        section.innerHTML = '<p style="color:#b2bec3; padding:20px;">Server unreachable.</p>';
        console.error(e);
    }
}

export async function following(){ 
     try{
        const response = await fetch("http://127.0.0.1:5000/user/following/get", {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'}

        })

        const data = await response.json();
        if (data.MESSAGE && response.ok){
            if (data.FOLLOWING === false){
                const section = document.getElementById("user-section");
                section.style.textAlign = 'center';
                section.style.display = 'flex';
                section.style.justifyContent = 'center';
                section.style.marginTop = '110px';
                section.innerHTML = '<h1> You arent following anyone </h1>';
            }
            const stuff = data.STUFF;
            for (var i = 0; i<stuff.length;i++){
                const current = stuff[i];
                const currentUsername = current['username'];
                const currentActionWord= current['actionWord'];
                const currentFollowerCount = current['followers'];
                const currentShortId = current['shortId'];

                appendToMainScreen(currentUsername, currentActionWord, currentFollowerCount, currentShortId);
            }
        
        } else {
            console.error(data.ERROR || "Error while processing leaderboard");

        }
    }
    catch (e){
        console.error(e);
    }

}

export async function friends(){ 
    
    try{
        const response = await fetch("http://127.0.0.1:5000/user/friends/get", {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'}

        })

        

        const data = await response.json();

        const stuff = data.STUFF;
        console.log(`STUFF ${stuff}`);

        if (data.MESSAGE && response.ok){
            if (data.FOLLOWING === false || !stuff){
                const section = document.getElementById("user-section");
                section.style.textAlign = 'center';
                section.style.display = 'flex';
                section.style.justifyContent = 'center';
                 section.style.marginTop = '110px';
                section.innerHTML = '<h1> You dont have friends :(</h1>';
                return;
            }

          
            for (var i = 0; i<stuff.length;i++){
                const current = stuff[i];
                const currentUsername = current['username'];
                const currentActionWord= current['actionWord'];
                const currentFollowerCount = current['followers'];
                const currentShortId = current['shortId'];

                appendToMainScreen(currentUsername, currentActionWord, currentFollowerCount, currentShortId);
            }
        
        } else {
            console.error(data.ERROR || "Error while processing leaderboard");

        }
    }
    catch (e){
        console.error(e);
    }


}

export async function updates(){ 
    const section = document.getElementById("updateText");
    
    var updateText = `<div><h1 style='letter-height: 1.5;'>
    
    <p>PanthoFlow V1.0:</p><br>

    <p>3/20/26, 6:00 pm</p>

    <p>Version 1 of PanthoFlow is finally here, though it might never see a day online,
    it's refreshing completeing a project fully till the end.</p>

    <p>PanthoFlow, creator Julius Cylien, created PanthoFlow
    as an senior project in high school. Orginally a simple portfilio, Julius decided
    to expand PanthoFlow into a Full Stack project, getting inspiration from other
    creative induced markets like Canva. PanthoFlow's main objective is to allow
    crators, scholars, or those who need a platform to showcase their work a easy
    and creative experience to do so.</p></h1></div>

`
section.style.display = 'block';
section.innerHTML = updateText;
}

export async function classroomsANDgroups(){ 
    
    const section = document.getElementById("user-section");
    section.style.textAlign = 'center';
    section.style.display = 'flex';
    section.style.justifyContent = 'center';
    section.style.marginTop = '100px';
    section.innerHTML = '<h1 style="font-size: 100px;"> Coming Soon</h1>';
}





document.addEventListener("DOMContentLoaded", ()=>{

    

    const pageHeader = document.getElementById("page-header");

    const page = localStorage.getItem('pf_mainPageOption');

    const allBtns = document.querySelectorAll('.nav-item');

    /*for (var i = 0; i<allBtns.length; i++){
        const testing = allBtns[i];
        if (testing.dataset.page.toLowerCase() === page){
            console.log("MATCH");
            testing.className = 'nav-item active';
        }
    }*/


    console.log(page);

    const params = new URLSearchParams(window.location.search);

    const option = params.get("page");

    if (!params || !pageHeader) return;

    pageHeader.textContent = option;

    const options = {
        'leaderboard': leaderBoard,
        'following': following,
        'friends': friends,
        'updates': updates,
        'discovery': discovery,
        'classrooms': classroomsANDgroups
    }

    if (!option) return;

    const fn = options[option.toLowerCase()];


    allBtns.forEach(btn => 
        btn.dataset.page.toLowerCase() === page && 
        (btn.className = 'nav-item active')
    );

    if (fn) fn();
    else {
        allBtns.forEach(btn => 
        btn.dataset.page.toLowerCase() === 'discovery' && 
        (btn.className = 'nav-item active')
    );
        discovery();
    }
    
})