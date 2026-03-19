// follow.js
import { debug } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {

    const followBtn = document.getElementById("follow-btn");
    if (!followBtn) return;
   
    const params = new URLSearchParams(window.location.search);
    const viewingUserId = params.get("user");
    // Read the ?user= from the URL
    // This tells us whose page we're on

    if (!viewingUserId) {
        // No ?user= means this is the logged-in user's OWN page
        // You can't follow yourself — keep button hidden and stop
        return;
    }

    // Show the button now that we know it's someone else's page
    followBtn.style.display = "block";

    // --- CHECK IF ALREADY FOLLOWING ON PAGE LOAD ---
    // We need to know whether to show a filled or empty star immediately
    try {
        const response = await fetch(`http://127.0.0.1:5000/user/follow/check/${viewingUserId}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (response.ok && data.FOLLOWING === true) {
            followBtn.classList.add("following");
            // Adds the CSS class that fills the star pink
        }

    } catch (e) {
        console.error("Could not check follow status:", e);
    }

    // --- CLICK HANDLER ---
    followBtn.addEventListener("click", async () => {

        // Immediately toggle visually before the server responds
        // This makes the UI feel instant — we'll revert if server fails
        const wasFollowing = followBtn.classList.contains("following");
        followBtn.classList.toggle("following");

        // Trigger the pop animation
        followBtn.classList.add("pop");
        setTimeout(() => followBtn.classList.remove("pop"), 300);
        // 300ms matches the CSS transition duration, then removes the class

        try {
            const response = await fetch(`http://127.0.0.1:5000/user/follow/${viewingUserId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if (!response.ok || data.ERROR) {
                // Server rejected it — revert the visual change
                if (wasFollowing) {
                    followBtn.classList.add("following");
                } else {
                    followBtn.classList.remove("following");
                }
                console.error("Follow failed:", data.ERROR);
            }

        } catch (e) {
            // Network failure — revert
            if (wasFollowing) {
                followBtn.classList.add("following");
            } else {
                followBtn.classList.remove("following");
            }
            console.error("Server unreachable:", e);
        }
    });
});