# ASCIICAM 

ASCIICam is a web application that transforms your camera feed into real-time ASCII art. It converts video input into text characters, creating a unique visual experience reminiscent of early computer art.

## Features

- **Real-time ASCII Conversion**: Instantly transforms your camera feed into ASCII art
- **Camera Switching**: Toggle between front and rear cameras
- **Screenshot Capability**: Capture and save your ASCII art creations as PNG images
- **Responsive Design**: Works on both mobile and desktop devices
- **Dark Mode**: Sleek black background with white text for optimal contrast
- **Convert from Gallery**:Choose any image from gallery and covert it into ASCII 

## How It Works

ASCIICAM uses your device's camera to capture video frames, which are then processed in real-time. Each pixel's brightness is mapped to a corresponding ASCII character, with brighter areas represented by denser characters and darker areas by spaces.

The application uses a carefully selected set of ASCII characters to represent different brightness levels:
```
' ', '.', ',', '-', '~', '+', '=', 'o', 'a', '#', '%', '8', '@'
```
(From darkest to brightest)

## Usage

1. **Grant Camera Access**: When prompted, allow ASCIICam to access your camera
2. **Switch Cameras**: Use the camera icon button (bottom left) to toggle between front and rear cameras
3. **Capture Images**: Click the capture button (bottom right) to save your current ASCII art view as a PNG image
4. **Adjust Positioning**: Move closer or further from the camera to change the level of detail

## Technical Details

- Built with vanilla HTML
- Uses the HTML5 Canvas API for image processing
- Implements the MediaDevices API for camera access
- Optimized for performance with efficient pixel sampling

## Browser Compatibility

ASCIICAM works best on modern browsers that support the MediaDevices API:
- Chrome (desktop and mobile)
- Firefox (desktop and mobile)
- Safari (iOS 11+ and macOS)
- Edge (Chromium-based)

## Privacy

ASCIICAM processes all video data locally in your browser. No images or video are transmitted to any server.

## Installation

Simply host the HTML file on any web server, or open it directly in a browser. No build process or dependencies required.

## License

ASCIICAM is open source and free to use, modify, and distribute.

## Credits

Developed with Claude Sonnet 3.7 and a passion for retro computing aesthetics.
