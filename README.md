# RunSync - Running Cadence Training App

RunSync is a Next.js application designed to help runners improve their running cadence (Steps Per Minute, SPM) through real-time tracking, music synchronization, and personalized training programs. The app combines features inspired by TrailMix, Weav Run, and Quick Steps, enhanced with modern web technologies.

## Features

- **Real-time Cadence Tracking**: Monitor your SPM in real-time with visual feedback
- **Music Synchronization**: Adjust music BPM to match your target cadence
- **Personalized Training**: Choose from beginner, intermediate, or advanced training programs
- **Progress Tracking**: Visualize your improvement over time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- Next.js 14.x
- TypeScript
- Tailwind CSS
- Tone.js for audio processing
- Recharts for data visualization
- Framer Motion for animations
- Auth0 for authentication
- n8n for workflow automation

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/runsync.git
   cd runsync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with required environment variables:
   ```
   NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
   NEXT_PUBLIC_AUTH0_CALLBACK_URL=http://localhost:3000/api/auth/callback
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
runsync/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── training/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   │       ├── CadenceTracker.tsx
│   │       ├── MusicPlayer.tsx
│   │       └── TrainingModule.tsx
│   ├── lib/
│   ├── styles/
│   └── types/
├── public/
└── package.json
```

## Development

- `npm run dev`: Start development server
- `npm run build`: Build production version
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by TrailMix, Weav Run, and Quick Steps
- Thanks to the Next.js and React communities
- Special thanks to all contributors

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/runsync](https://github.com/yourusername/runsync) 