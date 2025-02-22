// Open modal
function openModal() {
    document.getElementById("myModal").style.display = "flex";
}

// Close modal and clean up any active processes (song and key highlights)
function closeModal() {
    document.getElementById("myModal").style.display = "none";
    stopSong();
    clearKeyHighlights();
}

// Close modal if the user clicks outside of it
window.onclick = function (event) {
    if (event.target === document.getElementById("myModal")) {
        closeModal();
    }
}

// Highlights a piano key by adding the 'active' class
function highlightKey(note) {
    const key = document.querySelector(`.piano-key[data-note="${note}"]`);
    if (key) key.classList.add('active');
}

// Removes the highlight from a piano key by removing the 'active' class
function removeHighlightKey(note) {
    const key = document.querySelector(`.piano-key[data-note="${note}"]`);
    if (key) key.classList.remove('active');
}

// Clears all highlights from all piano keys
function clearKeyHighlights() {
    document.querySelectorAll('.piano-key').forEach(key => {
        key.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Variables to manage playback state and scheduled timeouts
    let isPlaying = false;
    let currentTimeouts = [];

    // Initialize the synth and connect it to the default audio output
    const synth = new Tone.Synth().toDestination();

    // Ensure the audio context is started on the first user interaction
    document.body.addEventListener('click', async () => {
        if (Tone.context.state !== 'running') {
            await Tone.start();
            console.log('Audio context started');
        }
    }, { once: true });

    // Recording state and data containers
    let isRecording = false;
    let recordedNotes = [];
    // Map to track the start time of each pressed note for duration calculation
    let activeNotes = new Map();

    // Add event listeners for each piano key to handle user interaction
    document.querySelectorAll('.piano-key').forEach(key => {
        // Retrieve the note associated with the key from its data attribute
        const note = key.getAttribute('data-note');

        // Function to handle starting a note (triggered by mouse/touch down)
        function startNote(event) {
            event.preventDefault(); // Prevents unintended behavior (e.g., mobile scrolling)
            clearKeyHighlights();   // Clear any previous key highlights
            stopSong();             // Stop any currently playing song
            highlightKey(note);     // Visually highlight the pressed key
            synth.triggerAttack(note); // Start playing the note
            activeNotes.set(note, Date.now()); // Record the time the note was pressed
        }

        // Function to handle stopping a note (triggered by mouse/touch up or leaving the key)
        function stopNote(event) {
            event.preventDefault();
            if (activeNotes.has(note)) {
                const startTime = activeNotes.get(note);
                const duration = Date.now() - startTime; // Calculate how long the note was held
                synth.triggerRelease();  // Stop playing the note
                removeHighlightKey(note); // Remove the visual highlight
                if (isRecording) {
                    // Save note, start time, and duration if recording is active
                    recordedNotes.push({ note, time: startTime, duration });
                }
                activeNotes.delete(note); // Remove the note from active tracking
            }
        }

        // Add mouse event listeners for desktop interactions
        key.addEventListener('mousedown', startNote);
        key.addEventListener('mouseup', stopNote);
        key.addEventListener('mouseleave', stopNote);

        // Add touch event listeners for mobile devices (with passive option disabled)
        key.addEventListener('touchstart', startNote, { passive: false });
        key.addEventListener('touchend', stopNote, { passive: false });
    });

    // Plays back a sequence of recorded notes using their recorded timings and durations
    function playRecording(notes) {
        clearKeyHighlights();

        if (isPlaying) stopSong();
        if (notes.length === 0) return; // Exit if there are no recorded notes

        isPlaying = true;
        const startTime = notes[0].time; // Use the first note's time as a reference

        notes.forEach(({ note, time, duration }) => {
            const delay = time - startTime; // Calculate delay for the note's attack

            // Schedule the note attack
            const attackTimeout = setTimeout(() => {
                synth.triggerAttack(note);
                highlightKey(note);

                // Schedule the note release after the note's duration
                const releaseTimeout = setTimeout(() => {
                    synth.triggerRelease();
                    removeHighlightKey(note);
                }, duration);

                currentTimeouts.push(releaseTimeout);
            }, delay);

            currentTimeouts.push(attackTimeout);
        });

        // Reset playback state after the last note is finished
        setTimeout(() => {
            isPlaying = false;
        }, notes[notes.length - 1].time - startTime + notes[notes.length - 1].duration);

        clearKeyHighlights();
    }

    // Plays a predefined song by scheduling note attacks and releases with a sustain multiplier
    function playSong(song, sustainMultiplier = 1.5) {
        clearKeyHighlights();
        if (isPlaying) stopSong();
        isPlaying = true;
        let cumulativeTime = 0; // Tracks total elapsed time for scheduling notes
        const timeouts = [];

        song.forEach(noteObj => {
            const { note, duration } = noteObj;
            // Schedule the note attack at the current cumulative time
            const attackTimeout = setTimeout(() => {
                synth.triggerAttack(note);
                highlightKey(note);
            }, cumulativeTime);
            timeouts.push(attackTimeout);

            // Calculate sustain duration and schedule note release
            const sustain = duration * sustainMultiplier;
            const releaseTimeout = setTimeout(() => {
                synth.triggerRelease();
                removeHighlightKey(note);
            }, cumulativeTime + sustain);
            timeouts.push(releaseTimeout);

            // Increment cumulative time by the note's original duration for rhythm
            cumulativeTime += duration;
        });

        // Save timeouts globally to allow cancellation if needed
        currentTimeouts = timeouts;

        // Set isPlaying to false after the last note has been released
        const lastNote = song[song.length - 1];
        const finalSustain = lastNote.duration * sustainMultiplier;
        setTimeout(() => {
            isPlaying = false;
        }, cumulativeTime - lastNote.duration + finalSustain);

        clearKeyHighlights();
    }

    // Stops the song playback by clearing all scheduled timeouts and resetting state
    function stopSong() {
        currentTimeouts.forEach(clearTimeout);
        currentTimeouts = [];
        isPlaying = false;
        synth.triggerRelease();
    }

    // Expose stopSong globally for external access (e.g., modal close)
    window.stopSong = stopSong;

    // Define and expose a function to play "Happy Birthday" using a predefined sequence of notes
    window.playSongHappyBirthday = function () {
        const songHappyBirthday = [
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
        playSong(songHappyBirthday, 1.5);
    };

    // Define and expose a function to play a "Do Re Mi" style song using a predefined note sequence
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
        playSong(songDoremi, 1.5);
    };

    // Handle recording and playback control elements
    const recordButton = document.getElementById("record-btn");
    const playRecordingButton = document.getElementById("play-recording");

    // Toggle recording mode when the record button is clicked
    recordButton.addEventListener("click", function () {
        if (!isRecording) {
            recordedNotes = [];         // Reset any previous recordings
            isRecording = true;           // Start recording
            recordButton.innerHTML = '<i class="fa-solid fa-stop" style="font-size: 24px; color: red;"></i>';
        } else {
            isRecording = false;          // Stop recording
            recordButton.innerHTML = '<i class="fa-solid fa-record-vinyl" style="font-size: 24px;"></i>';
            playRecordingButton.disabled = recordedNotes.length === 0; // Enable play button if there are recordings
        }
    });

    // Play back the recorded notes when the play button is clicked
    playRecordingButton.addEventListener("click", function () {
        if (recordedNotes.length === 0) return; // Do nothing if no notes were recorded
        playRecording(recordedNotes);
    });
});
