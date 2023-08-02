let mediaRecorder;
let audioChunks = [];
let recognitionInProgress = false;

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resultDiv = document.getElementById('result');

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = handleAudioData;
            mediaRecorder.start();
            recognitionInProgress = true;
            updateButtonStates();
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
            alert('Error accessing microphone. Please grant microphone permissions.');
        });
}

function handleAudioData(event) {
    if (event.data.size > 0) {
        audioChunks.push(event.data);
    }
}

function stopRecording() {
    if (recognitionInProgress) {
        mediaRecorder.stop();
        recognitionInProgress = false;
        updateButtonStates();
        processAudio();
    }
}

function processAudio() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audioFile', audioBlob);

    fetch('/recognize', {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'audio/wav'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.metadata) {
            const songTitle = data.metadata.title;
            const artist = data.metadata.artist;
            const album = data.metadata.album;
            resultDiv.innerHTML = `<strong>Title:</strong> ${songTitle}<br><strong>Artist:</strong> ${artist}<br><strong>Album:</strong> ${album}`;
        } else {
            alert('Song not recognized.');
        }
    })
    .catch(error => {
        console.error('Error during recognition:', error);
        alert('Error occurred during recognition.');
    });
}

function updateButtonStates() {
    startButton.disabled = recognitionInProgress;
    stopButton.disabled = !recognitionInProgress;
}
