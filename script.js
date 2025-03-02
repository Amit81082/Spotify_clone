console.log("Welcome to Spotify 🎵");

// Initialize Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let nextBtn = document.getElementById('next');
let prevBtn = document.getElementById('previous');

let songs = [
    {songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
    {songName: "DEAF KEV - Invincible [NCS Release]-320k", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
    {songName: "Janji - Heroes Tonight [NCS Release]", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
    {songName: "Rabba - Salam-e-Ishq", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
    {songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
    {songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/8.mp3", coverPath: "covers/8.jpg"},
    {songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/9.mp3", coverPath: "covers/9.jpg"},
    {songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/10.mp3", coverPath: "covers/10.jpg"},
];
songs.push({
    songName: "Ae Dil Hai Mushkil",
    filePath: "songs/11.mp3",
    coverPath: "covers/11.jpg"
});


// Update song list UI
songItems.forEach((element, i) => {
    element.querySelector("img").src = songs[i].coverPath;
    element.querySelector(".songName").innerText = songs[i].songName;
});

// Function to play a song
const playSong = (index) => {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    updatePlayPauseUI(true);
};

// Function to update play/pause UI
const updatePlayPauseUI = (isPlaying) => {
    if (isPlaying) {
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
        gif.style.opacity = 0;
    }
};

// Handle play/pause button click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
    updatePlayPauseUI(!audioElement.paused);
});

// Update seek bar as song plays
audioElement.addEventListener('timeupdate', () => {
    myProgressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
});

// Seek bar change event
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// Reset all play buttons
const resetAllPlays = () => {
    document.querySelectorAll('.songItemPlay').forEach((element) => {
        element.classList.replace('fa-pause-circle', 'fa-play-circle');
    });
};

// Play song when clicking on a song item
document.querySelectorAll('.songItemPlay').forEach((element, i) => {
    element.addEventListener('click', (e) => {
        if (songIndex === i && !audioElement.paused) {
            audioElement.pause();
            updatePlayPauseUI(false);
            e.target.classList.replace('fa-pause-circle', 'fa-play-circle');
        } else {
            resetAllPlays();
            playSong(i);
            e.target.classList.replace('fa-play-circle', 'fa-pause-circle');
        }
    });
});

// Handle next button click
nextBtn.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    playSong(songIndex);
});

// Handle previous button click
prevBtn.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playSong(songIndex);
});

// Auto-play next song when current song ends
audioElement.addEventListener('ended', () => {
    nextBtn.click();
});


// 🕒 Show Current & Total Song Time
const songTime = document.getElementById('songTime'); // HTML me <span> hona chahiye

const updateSongTime = () => {
    if (isNaN(audioElement.duration)) return; // Ensure duration is valid

    let current = formatTime(audioElement.currentTime);
    let total = formatTime(audioElement.duration);
    songTime.innerText = `${current} / ${total}`;
};

// Ensure metadata is loaded before fetching duration
audioElement.addEventListener('loadedmetadata', updateSongTime);

// Update time as song plays
audioElement.addEventListener('timeupdate', updateSongTime);

// // Format time function (MM:SS)
// const formatTime = (time) => {
//     let min = Math.floor(time / 60);
//     let sec = Math.floor(time % 60);
//     return `${min}:${sec < 10 ? '0' + sec : sec}`;
// };


// ⏳ Format Time in MM:SS
const formatTime = (time) => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
};

// 🔄 Update Song Time on Play & Seek
audioElement.addEventListener('timeupdate', updateSongTime);

// 🎲 Shuffle Functionality
let shuffleBtn = document.getElementById('shuffle'); // HTML me ek shuffle button hona chahiye

shuffleBtn.addEventListener('click', () => {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === songIndex); // Ensure different song plays
    playSong(randomIndex);
});

// 🔁 Loop Functionality
let loopBtn = document.getElementById('loop'); // HTML me ek loop button add karna hoga
let isLooping = false;

loopBtn.addEventListener('click', () => {
    isLooping = !isLooping;
    loopBtn.classList.toggle('active', isLooping);
});

// ✅ Auto-play Next or Loop Current Song
audioElement.addEventListener('ended', () => {
    if (isLooping) {
        playSong(songIndex); // Repeat Same Song
    } else {
        nextBtn.click(); // Play Next Song
    }
});
