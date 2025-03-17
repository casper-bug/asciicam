const video = document.getElementById('video');
const asciiContainer = document.getElementById('ascii');

// Start the camera
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.play();
    processVideo();
}).catch((err) => console.error("Camera Error:", err));

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// ASCII characters from light to dark
const asciiChars = " .:-=+*#%@";

function processVideo() {
    function render() {
        const width = Math.floor(window.innerWidth / 10); // Adjust resolution
        const height = Math.floor(window.innerHeight / 20);
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;

        let asciiImage = "";
        for (let i = 0; i < imageData.length; i += 4) {
            const brightness = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
            const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
            const asciiChar = asciiChars[charIndex];

            // Add optional color
            const color = `rgb(${imageData[i]}, ${imageData[i + 1]}, ${imageData[i + 2]})`;
            asciiImage += `<span style="color: ${color}">${asciiChar}</span>`;

            if ((i / 4) % width === width - 1) asciiImage += "<br>";
        }

        asciiContainer.innerHTML = asciiImage;
        requestAnimationFrame(render);
    }

    render();
}