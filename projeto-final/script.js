// Update the footer text with the current year and author information
document.getElementById("footer-text").innerHTML = `© ${new Date().getFullYear()} By Sérgio F. Paim, All Rights Reserved`;

// Open modal
function openModal() {
    document.getElementById("myModal").style.display = "flex";
}

// Close modal
function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

// Close modal if the user clicks outside of it
window.onclick = function (event) {
    if (event.target === document.getElementById("myModal")) {
        closeModal();
    }
}

// Wait until the DOM is fully loaded before initializing the audio context
document.addEventListener('DOMContentLoaded', () => {
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

    // Add event listeners for each piano key
    document.querySelectorAll('.piano-key').forEach(key => {
        key.addEventListener('click', () => {
            const note = key.getAttribute('data-note');
            synth.triggerAttackRelease(note, "8n");

            // Record the note if recording is active
            if (isRecording) {
                recordedNotes.push({ note, time: Date.now() });
            }
        });
    });

    // Function to play a sequence of notes from an array of { note, duration }
    function playSong(song) {
        let time = 0;
        song.forEach(noteObj => {
            setTimeout(() => {
                synth.triggerAttackRelease(noteObj.note, "8n");
            }, time);
            time += noteObj.duration;
        });
    }

    // Example 1: "Mary Had a Little Lamb" (simplified)
    window.playSong1 = function () {
        const song1 = [
            { note: "E4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "C4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "E4", duration: 500 },
            { note: "E4", duration: 500 },
            { note: "E4", duration: 750 },
            { note: "D4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "D4", duration: 750 },
            { note: "E4", duration: 500 },
            { note: "G4", duration: 500 },
            { note: "G4", duration: 750 }
        ];
        playSong(song1);
    }

    // Example 2: "Ode to Joy" (simplified)
    window.playSong2 = function () {
        const song2 = [
            { note: "E4", duration: 500 },
            { note: "E4", duration: 500 },
            { note: "F4", duration: 500 },
            { note: "G4", duration: 500 },
            { note: "G4", duration: 500 },
            { note: "F4", duration: 500 },
            { note: "E4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "C4", duration: 500 },
            { note: "C4", duration: 500 },
            { note: "D4", duration: 500 },
            { note: "E4", duration: 500 },
            { note: "E4", duration: 750 },
            { note: "D4", duration: 750 },
            { note: "D4", duration: 750 }
        ];
        playSong(song2);
    }

    // Handle recording and playback functionality
    const recordButton = document.getElementById("record-btn");
    const playRecordingButton = document.getElementById("play-recording");

    // Start/stop recording when the record button is clicked
    recordButton.addEventListener("click", function () {
        if (!isRecording) {
            recordedNotes = [];
            isRecording = true;
            // Change icon to "Stop" and apply highlight (e.g., red color)
            recordButton.innerHTML = '<i class="fa-solid fa-stop" style="font-size: 24px; color: red;"></i>';
        } else {
            isRecording = false;
            // Change back to the original recording icon
            recordButton.innerHTML = '<i class="fa-solid fa-record-vinyl" style="font-size: 24px;"></i>';
            playRecordingButton.disabled = recordedNotes.length === 0;
        }
    });

    // Play the recorded notes when the play button is clicked
    playRecordingButton.addEventListener("click", function () {
        if (recordedNotes.length === 0) return;

        let startTime = recordedNotes[0].time;

        recordedNotes.forEach(({ note, time }) => {
            let delay = time - startTime;
            setTimeout(() => {
                synth.triggerAttackRelease(note, "8n");
            }, delay);
        });
    });
});