// Update the footer text with the current year and author information
document.getElementById("footer-text").innerHTML = `© ${new Date().getFullYear()} By Sérgio F. Paim, All Rights Reserved`;

// Open modal
function openModal() {
    document.getElementById("myModal").style.display = "flex";
}

// Close modal
function closeModal() {
    document.getElementById("myModal").style.display = "none";
    stopSong();
}

// Close modal if the user clicks outside of it
window.onclick = function (event) {
    if (event.target === document.getElementById("myModal")) {
        closeModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {

    let isPlaying = false;
    let currentTimeouts = [];

    // Initialize the synth
    const synth = new Tone.Synth().toDestination();

    // Start the audio context with the user's first interaction
    document.body.addEventListener('click', async () => {
        if (Tone.context.state !== 'running') {
            await Tone.start();
            console.log('Audio context started');
        }
    }, { once: true });

    // Recording variables
    let isRecording = false;
    let recordedNotes = [];
    // Use a Map to track the start time of each pressed note.
    let activeNotes = new Map();

    // Add event listeners for each piano key
    document.querySelectorAll('.piano-key').forEach(key => {
        const note = key.getAttribute('data-note');

        key.addEventListener('mousedown', () => {
            stopSong();

            // Start the note and record the time it was pressed
            synth.triggerAttack(note);
            activeNotes.set(note, Date.now());
        });

        key.addEventListener('mouseup', () => {
            if (activeNotes.has(note)) {
                const startTime = activeNotes.get(note);
                const duration = Date.now() - startTime;
                synth.triggerRelease();
                // Only record the note if recording is active
                if (isRecording) {
                    recordedNotes.push({ note, time: startTime, duration });
                }
                activeNotes.delete(note);
            }
        });

        key.addEventListener('mouseleave', () => {
            if (activeNotes.has(note)) {
                // Ensure that the note is stopped (and recorded) if the user moves the mouse away
                key.dispatchEvent(new Event('mouseup'));
            }
        });
    });

    function playSong(song) {
        if (isPlaying)
            stopSong();

        isPlaying = true;
        let time = 0;

        currentTimeouts = song.map(noteObj => {
            const timeoutId = setTimeout(() => {
                synth.triggerAttackRelease(noteObj.note, "8n");
            }, time);
            time += noteObj.duration;
            return timeoutId;
        });

        // Reset isPlaying after the song finishes
        setTimeout(() => {
            isPlaying = false;
        }, time);
    }

    // Function to playback recorded notes using their actual pressed duration
    function playRecording(notes) {
        if (isPlaying)
            stopSong();

        if (notes.length === 0) return;

        isPlaying = true;
        const startTime = notes[0].time;
        notes.forEach(({ note, time, duration }) => {
            const delay = time - startTime;
            const attackTimeout = setTimeout(() => {
                synth.triggerAttack(note);
                const releaseTimeout = setTimeout(() => {
                    synth.triggerRelease();
                }, duration);
                currentTimeouts.push(releaseTimeout);
            }, delay);
            currentTimeouts.push(attackTimeout);
        });

        // Reset isPlaying after the song finishes
        setTimeout(() => {
            isPlaying = false;
        }, time);
    }


    function stopSong() {
        currentTimeouts.forEach(clearTimeout);
        currentTimeouts = [];
        isPlaying = false;
        synth.triggerRelease();
    }

    window.stopSong = stopSong;

    window.playSongHappyBirthday = function () {
        const songParabens = [
            { note: "C4", duration: 500 },
            { note: "C4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "C4", duration: 500 },
            { note: "F4", duration: 500 },
            { note: "E4", duration: 750 },

            { note: "C4", duration: 500 },
            { note: "C4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "C4", duration: 500 },
            { note: "G4", duration: 500 },
            { note: "F4", duration: 750 },

            { note: "C4", duration: 500 },
            { note: "C4", duration: 500 },
            { note: "C5", duration: 500 },
            { note: "A4", duration: 500 },
            { note: "F4", duration: 500 },
            { note: "E4", duration: 500 },
            { note: "D4", duration: 750 },

            { note: "A#4", duration: 500 },
            { note: "A#4", duration: 500 },
            { note: "A4", duration: 500 },
            { note: "F4", duration: 500 },
            { note: "G4", duration: 500 },
            { note: "F4", duration: 750 }
        ];
        playSong(songParabens);
    };

    window.playSongDoremi = function () {
        const songDoremi = [
            { note: "C4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "E4", duration: 350 },
            { note: "F4", duration: 650 },
            { note: "F4", duration: 350 },
            { note: "F4", duration: 750 },

            { note: "C4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "C4", duration: 350 },
            { note: "D4", duration: 650 },
            { note: "D4", duration: 350 },
            { note: "D4", duration: 750 },

            { note: "C4", duration: 500 },
            { note: "G4", duration: 500 },
            { note: "F4", duration: 350 },
            { note: "E4", duration: 650 },
            { note: "E4", duration: 350 },
            { note: "E4", duration: 750 },

            { note: "C4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "E4", duration: 350 },
            { note: "F4", duration: 650 },
            { note: "F4", duration: 350 },
            { note: "F4", duration: 750 }
        ];
        playSong(songDoremi);
    };

    // Handle recording and playback functionality
    const recordButton = document.getElementById("record-btn");
    const playRecordingButton = document.getElementById("play-recording");

    // Start/stop recording when the record button is clicked
    recordButton.addEventListener("click", function () {
        if (!isRecording) {
            recordedNotes = [];
            isRecording = true;
            recordButton.innerHTML = '<i class="fa-solid fa-stop" style="font-size: 24px; color: red;"></i>';
        } else {
            isRecording = false;
            recordButton.innerHTML = '<i class="fa-solid fa-record-vinyl" style="font-size: 24px;"></i>';
            playRecordingButton.disabled = recordedNotes.length === 0;
        }
    });

    // Play the recorded notes when the play button is clicked
    playRecordingButton.addEventListener("click", function () {
        if (recordedNotes.length === 0) return;
        playRecording(recordedNotes);
    });
});
