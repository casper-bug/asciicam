const video = document.getElementById('video');
const asciiContainer = document.getElementById('ascii');
const captureCanvas = document.getElementById('captureCanvas');
const captureCtx = captureCanvas.getContext('2d');

// Start the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
        processVideo();
    })
    .catch((err) => console.error("Camera Error:", err));

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Inverted ASCII characters (darker areas = lighter characters, bright areas = dark characters)
const asciiChars = "@%#*+=-:. ";  // Order adjusted for correct inversion

function processVideo() {
    function render() {
        const width = 100;  // Higher width for better clarity
        const height = 50;  // Higher height for more detail
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;

        let asciiImage = "";
        for (let i = 0; i < imageData.length; i += 4) {
            const brightness = (imageData[i] * 0.3 + imageData[i + 1] * 0.59 + imageData[i + 2] * 0.11);
            const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1)); // Correct inversion
            asciiImage += asciiChars[asciiChars.length - 1 - charIndex] + " "; // Inverting character selection
            if ((i / 4) % width === width - 1) asciiImage += "\n";
        }

        asciiContainer.textContent = asciiImage;
        requestAnimationFrame(render);
    }

    render();
}

// Capture ASCII output and download as PNG
function captureAscii() {
    const text = asciiContainer.textContent;
    const lines = text.split("\n");

    // Set canvas size for better scaling
    const fontSize = 14;
    const lineHeight = fontSize * 1.2;
    captureCanvas.width = window.innerWidth - 40;
    captureCanvas.height = lines.length * lineHeight;

    // Draw ASCII text on canvas (inverted colors)
    captureCtx.fillStyle = "black"; // Background
    captureCtx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
    captureCtx.fillStyle = "white"; // Text color
    captureCtx.font = `${fontSize}px monospace`;

    lines.forEach((line, index) => {
        captureCtx.fillText(line, 10, (index + 1) * lineHeight);
    });

    // Download as PNG
    const link = document.createElement('a');
    link.download = 'ascii-art.png';
    link.href = captureCanvas.toDataURL('image/png');
    link.click();
}
