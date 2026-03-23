// like.js
import { debug } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {

    debug("LIKE BUTTON");
    const likeBtn = document.getElementById("like-btn");
    if (!likeBtn) {debug('NO LIKE BUTTON'); return;
   }
    const params = new URLSearchParams(window.location.search);
    const viewingCardId = params.get("card");
    // Read the ?card= from the URL
 
    if (!viewingCardId) {
        // No ?card= means this is the logged-in user's OWN page
        // You can't follow yourself — keep button hidden and stop
        debug("DURING LIKE PROCESS, USER ID NOT FOUND");
        return;
    }

    // --- CHECK IF ALREADY FOLLOWING ON PAGE LOAD ---
    // We need to know whether to show a filled or empty star immediately
    try {
        const response = await fetch(`http://127.0.0.1:5000/card/like/check/${viewingCardId}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (response.ok && data.LIKES === true) {
            likeBtn.classList.add("liking");
            
            // Adds the CSS class that fills the star pink
        }

    } catch (e) {
        console.error("Could not check like status:", e);
    }

    // --- CLICK HANDLER ---
    likeBtn.addEventListener("click", async () => {

        // Immediately toggle visually before the server responds
        // This makes the UI feel instant — we'll revert if server fails
        const wasLiked = likeBtn.classList.contains("liking");
        likeBtn.classList.toggle("liking");

        // Trigger the pop animation
        likeBtn.classList.add("pop");
        setTimeout(() => likeBtn.classList.remove("pop"), 300);
        // 300ms matches the CSS transition duration, then removes the class

        try {
            const response = await fetch(`http://127.0.0.1:5000/card/like/${viewingCardId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if (!response.ok || data.ERROR) {
                // Server rejected it — revert the visual change
                if (wasLiked) {
                    likeBtn.classList.add("liking");
                } else {
                    likeBtn.classList.remove("liking");
                }
                console.error("Like failed:", data.ERROR);
            }

        } catch (e) {
            // Network failure — revert
            if (wasLiked) {
                likeBtn.classList.add("liking");
            } else {
                likeBtn.classList.remove("liking");
            }
            console.error("Server unreachable:", e);
        }
    });
});