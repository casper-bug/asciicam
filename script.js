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

// Inverted ASCII characters (lightest to darkest)
const asciiChars = " .:-=+*#%@";

function processVideo() {
    function render() {
        const width = 80; // Increased width for better detail
        const height = 40; // Increased height for better clarity
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;

        let asciiImage = "";
        for (let i = 0; i < imageData.length; i += 4) {
            const brightness = (imageData[i] * 0.3 + imageData[i + 1] * 0.59 + imageData[i + 2] * 0.11);
            const charIndex = asciiChars.length - 1 - Math.floor((brightness / 255) * (asciiChars.length - 1)); // Inverted mapping
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
    captureCanvas.width = window.innerWidth - 40;
    captureCanvas.height = lines.length * lineHeight;
    
    // Draw ASCII text on canvas
    captureCtx.fillStyle = "black"; // Inverted background
    captureCtx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
    captureCtx.fillStyle = "white"; // Inverted text color
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
