# GoGevgelija Web Application

A modern web application for discovering Gevgelija, North Macedonia - built with Next.js 15 and migrated from the React Native mobile app.

## Overview

GoGevgelija Web is a tourism and local discovery platform that allows users to explore:
- **Listings**: Restaurants, hotels, attractions, and accommodations
- **Events**: Concerts, festivals, exhibitions, and cultural events
- **Promotions**: Special offers, discounts, and deals
- **Blog**: Travel guides, local stories, and event recaps

## Technology Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS framework

### State Management & Data Fetching
- **TanStack React Query 5.90** - Server state management and caching
- **React Context API** - Global state (Auth, Wishlist, Theme, Language)

### Forms & Validation
- **React Hook Form 7.62** - Form state management
- **Zod 3.25** - Schema validation

### UI Components & Styling
- **Lucide React** - Icon library (web alternative to Ionicons)
- **Framer Motion** - Animations
- **shadcn/ui patterns** - Reusable component architecture
- **class-variance-authority** - Component variants
- **tailwind-merge** - Utility merging

### Internationalization
- **next-intl 3.25** - i18n for Next.js

### Image Gallery
- **yet-another-react-lightbox 3.21** - Lightbox component
- **embla-carousel-react 8.5** - Carousel component

### Backend Integration
- **Axios 1.12** - HTTP client
- **Django REST API** - Existing backend (no changes needed)
- **JWT Authentication** - With automatic token refresh

## Project Structure

```
Web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Homepage
│   ├── components/               # React components
│   │   ├── layout/              # Header, Footer, Navigation
│   │   ├── ui/                  # UI primitives
│   │   ├── common/              # Reusable components
│   │   ├── cards/               # Card components
│   │   ├── carousel/            # Carousel components
│   │   └── wishlist/            # Wishlist components
│   ├── lib/                     # Core utilities
│   │   ├── api/
│   │   │   ├── client.ts        # Axios instance with JWT
│   │   │   └── services.ts      # API service layer
│   │   ├── auth/
│   │   │   └── tokens.ts        # Token management
│   │   ├── i18n/                # Internationalization
│   │   └── utils/               # Utility functions
│   ├── hooks/                   # Custom React hooks
│   ├── contexts/                # React contexts
│   ├── types/
│   │   └── index.ts            # TypeScript types (from mobile)
│   └── styles/
│       └── globals.css          # Global styles + Tailwind
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Django backend running (from Api directory)

### Installation

1. Install dependencies:
```bash
cd Web
npm install
```

2. Configure environment variables:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=GoGevgelija
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Migration from Mobile App

### ✅ Completed
- [x] Next.js 15 project setup with TypeScript
- [x] Tailwind CSS with theme system (light/dark mode)
- [x] TypeScript type definitions migrated
- [x] API client with JWT authentication adapted for web
- [x] Complete service layer for all API endpoints
- [x] Token management (localStorage instead of SecureStore)
- [x] Project structure and configuration

### 🚧 In Progress / Next Steps
- [ ] React contexts (Auth, Wishlist, Theme, Language)
- [ ] Layout components (Header, Footer, Navigation)
- [ ] Homepage with featured carousel
- [ ] Listing cards and detail pages
- [ ] Event cards and detail pages
- [ ] Promotion cards and detail pages
- [ ] Blog article pages
- [ ] Search and filtering functionality
- [ ] Wishlist functionality
- [ ] User authentication flows
- [ ] i18n setup with next-intl
- [ ] Profile and settings pages
- [ ] Responsive design (mobile/tablet/desktop)

### Key Differences from Mobile

| Feature | Mobile App | Web App |
|---------|-----------|---------|
| **Framework** | React Native + Expo | Next.js 15 |
| **Navigation** | React Navigation (Stack + Bottom Tabs) | Next.js App Router |
| **Storage** | Expo SecureStore | localStorage |
| **Icons** | Ionicons (@expo/vector-icons) | Lucide React |
| **Animations** | React Native Reanimated | Framer Motion |
| **Images** | expo-image | next/image |
| **Routing** | Stack navigator | File-based routing |
| **Styling** | StyleSheet API | Tailwind CSS |

### Reused Code (100%)
- ✅ TypeScript type definitions (`types/index.ts`)
- ✅ API service layer logic (`lib/api/services.ts`)
- ✅ Authentication token management (adapted for web)
- ✅ Business logic and data models
- ✅ API endpoint structure

## API Integration

The web app connects to the same Django REST API as the mobile app:

### Authentication Endpoints
- `POST /api/auth/send-code/` - Send verification code
- `POST /api/auth/verify-code/` - Verify code and login
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/guest/` - Create guest session
- `POST /api/token/refresh/` - Refresh JWT token

### Content Endpoints
- `GET /api/categories/` - Get all categories
- `GET /api/listings/` - Get listings (paginated)
- `GET /api/listings/{id}/` - Get listing detail
- `GET /api/events/` - Get events (paginated)
- `GET /api/promotions/` - Get promotions
- `GET /api/blogs/` - Get blog articles
- `GET /api/wishlist/` - Get user wishlist
- `POST /api/wishlist/` - Add to wishlist
- `POST /api/wishlist/remove/` - Remove from wishlist

All API calls include:
- JWT Bearer token authentication
- Language header (`Accept-Language: en|mk`)
- Automatic token refresh on 401
- Error handling with fallbacks

## Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_NAME=GoGevgelija
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

## Development Notes

### Authentication Flow
1. User requests verification code (email)
2. User enters 6-digit code
3. Backend validates and returns JWT tokens
4. Tokens stored in localStorage
5. Axios interceptor adds Bearer token to requests
6. Automatic refresh on 401 responses

### Token Storage
- Access token: 15 minutes lifetime
- Refresh token: 7 days lifetime
- Stored in localStorage (consider httpOnly cookies for production)
- In-memory cache for performance

### Image Optimization
- Next.js Image component for automatic optimization
- Responsive images with srcset
- Lazy loading by default
- WebP format support

### Performance
- Server-side rendering (SSR) for initial load
- Static generation for blog and promotional content
- React Query caching (5-minute TTL)
- Code splitting with dynamic imports
- Optimized bundle size

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production
- Set `NEXT_PUBLIC_API_URL` to production API URL
- Configure CORS on Django backend to allow web domain
- Consider using httpOnly cookies for JWT tokens

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is a migration of the existing React Native mobile app. The goal is to maintain feature parity while adapting to web-specific patterns.

## License

Private project for GoGevgelija tourism platform.

## Contact

For questions or collaboration opportunities, contact through the app's support feature.

---

**Status**: 🚧 Under active development - Core infrastructure complete, building UI components next
