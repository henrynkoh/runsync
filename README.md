# RunSync

RunSync is a web application that helps runners improve their cadence with real-time feedback, music synchronization, and personalized training programs.

## Features

- **Real-time Cadence Tracking**: Monitor your steps per minute (SPM) in real-time
- **Music Synchronization**: Train with a metronome that syncs to your target cadence
- **Personalized Training**: Choose from beginner, intermediate, or advanced programs
- **Progressive Web App**: Install and use offline on iOS devices

## Installation Instructions for iPhone Testing

### For iPhone Users

1. Connect to the same WiFi network as the host device.
2. Open Safari on your iPhone and go to the URL provided by the host (e.g., http://192.168.1.123:8080).
3. Try out the app in the browser first to make sure it works.
4. To install it as an app on your home screen:
   - Tap the Share button at the bottom of the screen (square with an arrow pointing up).
   - Scroll down and tap "Add to Home Screen".
   - You can rename the app if you wish, then tap "Add" in the top right corner.
5. The RunSync app will now appear on your home screen like a native app!

### For Developers

1. Clone the repository:
   ```
   git clone git@github.com:henrynkoh/runsync.git
   cd runsync
   ```

2. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```

3. Build the application:
   ```
   npm run build
   ```

4. Serve the app for testing:
   ```
   npm run serve
   ```

5. The app will be available at http://localhost:8080 and your local network IP address.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **UI**: Tailwind CSS, Framer Motion
- **Audio**: Tone.js for metronome and audio synchronization
- **PWA**: Service Worker for offline functionality

## Development

- Run the development server: `npm run dev`
- Build the production version: `npm run build`
- Serve the production build: `npm run serve`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by TrailMix, Weav Run, and Quick Steps
- Thanks to the Next.js and React communities
- Special thanks to all contributors

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/runsync](https://github.com/yourusername/runsync) 