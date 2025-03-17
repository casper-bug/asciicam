const video = document.getElementById('video');
const asciiContainer = document.getElementById('ascii');
const captureCanvas = document.getElementById('captureCanvas');
const captureCtx = captureCanvas.getContext('2d');

// Start the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then((stream) => {
    video.srcObject = stream;
    video.play();
    processVideo();
}).catch((err) => console.error("Camera Error:", err));

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// ASCII characters from darkest to lightest for improved visibility
const asciiChars = "@%#WMBX&8O0QZ*o+=-:. ";

function processVideo() {
    function render() {
        const width = Math.floor(window.innerWidth / 5);  // Increased resolution
        const height = Math.floor(window.innerHeight / 10);
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;

        let asciiImage = "";
        for (let i = 0; i < imageData.length; i += 4) {
            const brightness = (imageData[i] * 0.3 + imageData[i + 1] * 0.59 + imageData[i + 2] * 0.11); // Better grayscale conversion
            const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
            asciiImage += asciiChars[charIndex] + " ";
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
    captureCanvas.width = window.innerWidth - 40;  // Adjust for margin
    captureCanvas.height = lines.length * lineHeight;
    
    // Draw ASCII text on canvas
    captureCtx.fillStyle = "white";
    captureCtx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
    captureCtx.fillStyle = "black";
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
