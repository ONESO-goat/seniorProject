// delete_page.js

export function addDeleteButtons() {
    const allCards = document.querySelectorAll(".card-item");

    allCards.forEach(card => {
        // Don't add a second X if one already exists on this card
        if (card.querySelector(".card-delete-btn")) return;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "card-delete-btn";
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Delete this card";

        deleteBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            // stopPropagation stops the click from triggering
            // the card link underneath the button

            const cardId = card.id;
            // card.id is the shortId set in buildCardHTML

            const confirmed = confirm("Delete this card? This cannot be undone.");
            if (!confirmed) return;

            try {
                const response = await fetch("http://127.0.0.1:5000/card/remove", {
                    method: "DELETE",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ card_id: cardId })
                });

                const data = await response.json();

                if (response.ok && data.MESSAGE) {
                    card.remove();
                    // removes it from the DOM instantly without a page reload
                } else {
                    alert(data.ERROR || "Could not delete card.");
                }

            } catch (e) {
                alert("Server unreachable.");
                console.error(e);
            }
        });

        card.appendChild(deleteBtn);
    });
}



export function addDeleteButtonsSubcards() {
    const allCards = document.querySelectorAll(".song_item");

    allCards.forEach(card => {
        // Don't add a second X if one already exists on this card
        if (card.querySelector(".card-delete-btn")) return;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "card-delete-btn";
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Delete this subcard";

        deleteBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            // stopPropagation stops the click from triggering
            // the card link underneath the button

            const cardId = card.id;
            // card.id is the shortId set in htmlStructure

            const confirmed = confirm("Delete this subcard? This cannot be undone.");
            if (!confirmed) return;

            try {
                const response = await fetch("http://127.0.0.1:5000/subcard/remove", {
                    method: "DELETE",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ card_id: cardId })
                });

                const data = await response.json();

                if (response.ok && data.MESSAGE) {
                    card.remove();
                    // removes it from the DOM instantly without a page reload
                } else {
                    alert(data.ERROR || "Could not delete subcard.");
                }

            } catch (e) {
                alert("Server unreachable.");
                console.error(e);
            }
        });

        card.appendChild(deleteBtn);
    });
}


export function removeDeleteButtons() {
    document.querySelectorAll(".card-delete-btn").forEach(btn => btn.remove());
}