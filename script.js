const video = document.getElementById('video');
const asciiContainer = document.getElementById('ascii');
const captureCanvas = document.getElementById('captureCanvas');
const captureCtx = captureCanvas.getContext('2d');
const switchCameraBtn = document.getElementById('switchCamera');
const captureBtn = document.getElementById('captureBtn');

let stream = null;
let facingMode = "environment"; // Default to back camera on mobile
let paused = false;

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Set up event listeners
    captureBtn.addEventListener('click', captureAscii);
    switchCameraBtn.addEventListener('click', toggleCamera);
    
    // Check if multiple cameras are available
    checkCameraAvailability();
    
    // Start camera with initial settings
    startCamera();
    
    // Handle window resize
    window.addEventListener('resize', adjustResolution);
}

// Check if device has multiple cameras
function checkCameraAvailability() {
    if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoInputs = devices.filter(device => device.kind === 'videoinput');
                if (videoInputs.length > 1) {
                    switchCameraBtn.style.display = 'block';
                }
            })
            .catch(err => console.error("Error checking cameras:", err));
    }
}

// Toggle between front and back cameras
function toggleCamera() {
    facingMode = facingMode === "environment" ? "user" : "environment";
    
    // Stop current stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    // Start new camera
    startCamera();
}

// Start camera with current settings
function startCamera() {
    // Clear any previous content
    asciiContainer.textContent = "Starting camera...";
    
    const constraints = {
        video: { 
            facingMode: facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
        }
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
        .then((videoStream) => {
            stream = videoStream;
            video.srcObject = stream;
            
            // iOS Safari needs a play promise handling
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        processVideo();
                    })
                    .catch(err => {
                        console.error("Playback failed:", err);
                        asciiContainer.textContent = "Camera error. Please check permissions and try again.";
                    });
            }
        })
        .catch((err) => {
            console.error("Camera Error:", err);
            asciiContainer.textContent = "Cannot access camera. Please check permissions and try again.";
        });
}

// Calculate optimal resolution based on screen size
function calculateResolution() {
    // Base resolution on available space
    const containerWidth = asciiContainer.clientWidth;
    const containerHeight = asciiContainer.clientHeight;
    
    // Calculate characters that can fit
    let charWidth = 5;
    let charHeight = 10;
    
    // Adjust for mobile
    if (window.innerWidth <= 768) {
        charWidth = 6;
        charHeight = 12;
    }
    
    // Calculate cells that can fit in the container
    const width = Math.floor(containerWidth / charWidth);
    const height = Math.floor(containerHeight / charHeight);
    
    return { width, height };
}

// Adjust resolution on resize
function adjustResolution() {
    if (stream) {
        // No need to restart the camera, just let the next frame use the new resolution
        const resolution = calculateResolution();
        canvas.width = resolution.width;
        canvas.height = resolution.height;
    }
}

// Set up the processing canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// ASCII characters from darkest to lightest with better contrast
const asciiChars = "@%#*+=-:. ";

function processVideo() {
    const resolution = calculateResolution();
    canvas.width = resolution.width;
    canvas.height = resolution.height;
    
    function render() {
        if (!stream) return; // Stop if stream is no longer available
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let asciiImage = "";
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                
                // Better grayscale conversion based on human perception
                const brightness = (
                    imageData[index] * 0.299 + 
                    imageData[index + 1] * 0.587 + 
                    imageData[index + 2] * 0.114
                ); 
                
                const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
                asciiImage += asciiChars[charIndex];
            }
            asciiImage += "\n";
        }

        asciiContainer.textContent = asciiImage;
        
        // Continue the rendering loop
        if (!paused) {
            requestAnimationFrame(render);
        }
    }

    render();
}

// Capture ASCII output and download as PNG
function captureAscii() {
    const text = asciiContainer.textContent;
    const lines = text.split("\n");
    
    // Pause rendering temporarily to avoid performance issues during capture
    paused = true;
    
    // Set canvas size based on text dimensions
    const fontSize = window.innerWidth > 768 ? 14 : 10;
    const lineHeight = fontSize * 1.2;
    
    // Calculate required width based on longest line
    const longestLine = lines.reduce((max, line) => Math.max(max, line.
