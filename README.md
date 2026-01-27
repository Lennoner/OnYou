# OnYou - Self-Discovery Platform

OnYou is a Next.js-based self-discovery platform that helps users understand themselves better through self-reflection surveys and peer feedback.

## Features

- 🧭 **Self-Discovery Survey**: Answer reflective questions about your past, present, and future
- 📊 **Radar Chart Visualization**: See your strengths across 6 dimensions
- 👥 **Peer Feedback**: Get insights from friends about how they perceive you
- 🌍 **Universe View**: Visual network map of your relationships
- 💌 **Letters**: Send encouraging messages to friends
- 🔗 **Invite System**: Share feedback requests via unique codes

## Tech Stack

- **Framework**: Next.js 14.1.0 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Framer Motion, Recharts
- **Notifications**: Sonner (toast notifications)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/OnYou.git
cd OnYou

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
GOOGLE_CLIENT_ID=""  # Optional
GOOGLE_CLIENT_SECRET=""  # Optional
NODE_ENV="development"
```

## Project Structure

```
OnYou/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── discover/       # Self-discovery page
│   │   ├── universe/       # Relationship map
│   │   └── friends/        # Friends management
│   ├── components/         # React components
│   ├── lib/                # Utilities and helpers
│   │   ├── api-response.ts # Standardized API responses
│   │   ├── validation.ts   # Input validation & sanitization
│   │   └── auth.ts         # NextAuth configuration
│   ├── types/              # TypeScript type definitions
│   └── constants/          # Shared constants
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Seed data
├── docs/                   # Documentation
│   └── API.md             # API documentation
└── __tests__/             # Test files
```

## API Documentation

See [docs/API.md](docs/API.md) for complete API documentation.

### Quick API Overview

- `GET /api/user` - Get user profile
- `POST /api/discover` - Submit self-survey
- `GET /api/discover` - Get survey results with peer feedback
- `GET /api/friends` - Get friends list
- `POST /api/feedback` - Submit peer feedback (guest)
- `POST /api/friends/feedback` - Submit peer feedback (registered)
- `POST /api/invites` - Create invite code
- `POST /api/letters` - Send letter

All endpoints return standardized JSON responses:

```json
{
  "success": true|false,
  "data": { /* response data */ },
  "error": { "code": "ERROR_CODE", "message": "..." }
}
```

## Database Schema

Key models:
- `User` - User accounts
- `SurveyResponse` - Self-discovery survey results
- `PeerFeedback` - Feedback from friends
- `FriendConnection` - Friend relationships with metadata
- `Invite` - Invite codes for feedback
- `Letter` - Messages between users

## Security Features

- ✅ Session-based authentication (NextAuth)
- ✅ Rate limiting on all endpoints
- ✅ Input validation and sanitization
- ✅ XSS prevention
- ✅ SQL injection protection (Prisma)
- ✅ CSRF protection (NextAuth)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npx tsc --noEmit

# Format code
npm run format
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

See [__tests__/README.md](__tests__/README.md) for testing guide.

## Recent Updates

### Phase 7 Complete (Latest)
- ✅ All 42 identified issues resolved
- ✅ 8 API endpoints standardized with consistent response format
- ✅ Rate limiting implemented on all endpoints
- ✅ Comprehensive input validation
- ✅ XSS prevention with HTML sanitization
- ✅ 15 database indexes for performance
- ✅ Type-safe codebase (0 TypeScript errors)

### What's New
- Standardized API response format across all endpoints
- Rate limiting to prevent abuse (in-memory, Redis recommended for production)
- Input validation utilities (`validateScores`, `validateSurveyAnswers`, etc.)
- Centralized error handling with ApiErrors helpers
- Database performance optimization with strategic indexes

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Start:**

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` (from Supabase)
   - `NEXTAUTH_URL` (your Vercel domain)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
4. Deploy!

**Environment Variables Required:**
```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-generated-secret"
```

For complete deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- GitHub Issues: [github.com/your-username/OnYou/issues](https://github.com/your-username/OnYou/issues)
- Email: support@onyou.app

## Acknowledgments

- Design inspired by modern self-discovery platforms
- Built with Next.js, Prisma, and Tailwind CSS
- Korean language support throughout

---

Made with ❤️ for better self-understanding
