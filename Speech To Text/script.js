function startListening() {
    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        console.error('Speech recognition is not supported in this browser.');
        return;
    }

    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log('Speech recognition started.');
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        document.getElementById('userSaid').textContent = result;

        // Send the result to your Flask backend for processing
        fetch('/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: result }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data);
            // Handle the response from the server here if needed.
        })
        .catch(error => {
            console.error('Error sending data to server:', error);
        });
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
        console.log('Speech recognition ended.');
    };

    recognition.start();
}