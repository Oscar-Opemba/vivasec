# VivaSec - Unified Privacy Super-App

VivaSec is a comprehensive privacy operating system that consolidates all aspects of personal digital privacy into a single, intuitive application. It provides end-to-end encryption, real-time threat detection, and actionable privacy insights across messaging, browsing, VPN, email, and password management.

## Features

### 🔐 Core Privacy Modules

**VivaChat - Secure Messaging**
- End-to-end encrypted text, voice, and video messages
- Self-destructing messages with timer controls
- Screenshot detection and alerts
- Spam and phishing detection
- Message revocation system

**VivaSurf - Privacy Browser**
- Built-in tracker and ad blocking
- Anti-fingerprinting protection
- HTTPS enforcement and secure DNS
- Real-time malicious site alerts
- Privacy-focused browsing experience

**VivaConnect - VPN Integration**
- One-tap global VPN connection
- No-log policy with transparent infrastructure
- Automatic Wi-Fi protection
- Smart server routing for optimal speed
- Real-time connection status and data usage tracking

**VivaMail - Secure Email**
- End-to-end encrypted email with secure attachments
- Phishing and spam detection with automatic quarantine
- Anonymous email aliases and disposable addresses
- Email threat indicators and security analysis

**VivaVault - Password Manager**
- Zero-knowledge password vault with AES-256 encryption
- Advanced password generator with strength indicators
- Breach monitoring and alerts
- Weak password detection and audit
- Autofill integration across platforms

### 📊 Unified Dashboard

- **Central Privacy Score (CPS)**: Real-time privacy health indicator
- **Module Status Indicators**: Quick view of all protection modules
- **Actionable Recommendations**: One-tap fixes for security vulnerabilities
- **Real-Time Alerts**: Immediate notifications for suspicious activity and threats
- **Privacy Metrics**: Historical tracking of privacy improvements

### 🎮 Gamification System

- Privacy streaks with daily check-ins
- Achievement badges for privacy milestones
- Progress visualization and leaderboards
- Streak animations and celebrations
- Reward system to encourage consistent privacy practices

### ⚙️ Settings & Preferences

- **Account Management**: Profile editing, data export, account deletion
- **Privacy Preferences**: Module-specific toggles and controls
- **Notification Settings**: Granular alert configuration by priority level
- **Security Settings**: Master password, 2FA, biometric login, session management
- **Data Collection**: Analytics and crash report preferences

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Backend**: Express.js with tRPC
- **Database**: MySQL/TiDB with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Authentication**: Manus OAuth
- **Encryption**: TweetNaCl.js for E2EE (ready for integration)
- **Storage**: S3-compatible object storage

## Installation

### Prerequisites

- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 8.0+ or TiDB

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vivasec.git
   cd vivasec
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   - `DATABASE_URL`: MySQL connection string
   - `JWT_SECRET`: Session signing secret
   - `VITE_APP_ID`: Manus OAuth application ID
   - `OAUTH_SERVER_URL`: Manus OAuth backend URL
   - `VITE_OAUTH_PORTAL_URL`: Manus login portal URL

4. **Initialize database**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

## Development

### Project Structure

```
vivasec/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components for each module
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and helpers
│   │   └── contexts/      # React contexts
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database query helpers
│   └── _core/             # Framework core
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── storage/               # S3 storage helpers
```

### Building Features

1. **Update database schema** in `drizzle/schema.ts`
2. **Run migrations**: `pnpm db:push`
3. **Add query helpers** in `server/db.ts`
4. **Create tRPC procedures** in `server/routers.ts`
5. **Build UI** in `client/src/pages/` using shadcn/ui components
6. **Connect UI to API** using `trpc.*.useQuery/useMutation` hooks
7. **Write tests** in `server/*.test.ts` using Vitest

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## Deployment

### Mobile Deployment

VivaSec is optimized for mobile deployment using React Native or web-based mobile frameworks:

1. **Build for production**
   ```bash
   pnpm build
   ```

2. **Deploy to mobile platforms**
   - iOS: Use React Native or web wrapper
   - Android: Use React Native or web wrapper
   - Web: Deploy to any Node.js hosting platform

### Docker Deployment

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Security Considerations

- All sensitive data is encrypted end-to-end
- No plain-text passwords are stored
- Session tokens are signed with JWT
- Database connections use SSL/TLS
- Regular security audits recommended
- Open-source core libraries for transparency

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact: support@vivasec.app
- Documentation: https://docs.vivasec.app

## Roadmap

- [ ] Cross-platform mobile app (iOS/Android)
- [ ] Advanced encryption protocols (Signal Protocol integration)
- [ ] Decentralized messaging network
- [ ] AI-powered threat detection
- [ ] Browser extensions for all major browsers
- [ ] Hardware security key support
- [ ] Open-source audit and certification

## Acknowledgments

VivaSec is built with privacy-first principles and incorporates best practices from leading privacy and security organizations.

---

**Privacy is a right. VivaSec makes it simple.**
