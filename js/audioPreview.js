const songItems = document.querySelectorAll(".song_item");

songItems.forEach(item => {
    const audio = item.querySelector(".preview-audio");
    if (!audio) return;

    item.addEventListener("mouseenter", () => {
        audio.currentTime = 0;
        audio.volume = 0.7;
        audio.volume = 0;
audio.play();

let fade = setInterval(() => {
    if (audio.volume < 0.7) audio.volume += 0.05;
    else clearInterval(fade);
}, 50);
    });

    item.addEventListener("mouseleave", () => {
        audio.pause();
        audio.currentTime = 0;
    });
});
