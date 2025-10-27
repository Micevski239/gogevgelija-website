# GoGevgelija Web App Migration Guide

## Phase 1: Foundation (✅ COMPLETED)

### What We've Built

#### 1. Project Setup
- ✅ Next.js 15 with TypeScript 5.7
- ✅ Tailwind CSS 3.4 with custom theme
- ✅ All necessary dependencies installed
- ✅ Development environment configured

#### 2. Core Infrastructure
- ✅ **Type System**: Complete TypeScript interfaces migrated from mobile app
  - `Category`, `Listing`, `Event`, `Promotion`, `Blog`
  - `User`, `WishlistItem`, `UserPermission`
  - `PaginatedResponse`, `ApiError`
  - Located in: `src/types/index.ts`

- ✅ **Authentication**: JWT token management system
  - Token storage using localStorage (secure alternative to mobile SecureStore)
  - Automatic token refresh on 401 responses
  - Token decoding and user extraction
  - Located in: `src/lib/auth/tokens.ts`

- ✅ **API Client**: Full HTTP client with interceptors
  - Axios instance with 15s timeout
  - Automatic Bearer token injection
  - Language header support
  - Token refresh logic
  - Located in: `src/lib/api/client.ts`

- ✅ **Service Layer**: Complete API services
  - `categoryService`: 9 methods (getAll, getTree, getRoot, etc.)
  - `listingService`: 6 methods (getAll, getPage, getFeatured, etc.)
  - `eventService`: 5 methods
  - `promotionService`: 4 methods
  - `blogService`: 4 methods
  - `wishlistService`: 3 methods (getAll, add, remove)
  - `userService`: 3 methods
  - `permissionService`: 5 methods
  - `authService`: 5 methods (sendCode, verifyCode, loginAsGuest, etc.)
  - Located in: `src/lib/api/services.ts`

#### 3. Configuration Files
- ✅ `next.config.ts` - Next.js configuration with image optimization
- ✅ `tailwind.config.ts` - Tailwind with custom theme variables
- ✅ `tsconfig.json` - TypeScript with path aliases
- ✅ `.env.local` - Environment variables
- ✅ `postcss.config.mjs` - PostCSS configuration

#### 4. Basic App Structure
- ✅ Root layout with Inter font
- ✅ Homepage with status dashboard
- ✅ Global styles with light/dark theme support
- ✅ Directory structure for components, hooks, contexts

### File Tree Created
```
Web/
├── src/
│   ├── app/
│   │   ├── layout.tsx           ✅
│   │   └── page.tsx             ✅
│   ├── components/
│   │   ├── layout/              📁
│   │   ├── ui/                  📁
│   │   ├── common/              📁
│   │   ├── cards/               📁
│   │   ├── carousel/            📁
│   │   └── wishlist/            📁
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts        ✅
│   │   │   └── services.ts      ✅
│   │   ├── auth/
│   │   │   └── tokens.ts        ✅
│   │   ├── i18n/                📁
│   │   └── utils/
│   │       └── cn.ts            ✅
│   ├── hooks/                   📁
│   ├── contexts/                📁
│   ├── types/
│   │   └── index.ts             ✅
│   └── styles/
│       └── globals.css          ✅
├── public/                      📁
├── .env.local                   ✅
├── .gitignore                   ✅
├── next.config.ts               ✅
├── tailwind.config.ts           ✅
├── tsconfig.json                ✅
├── postcss.config.mjs           ✅
├── package.json                 ✅
├── README.md                    ✅
└── MIGRATION_GUIDE.md           ✅
```

---

## Phase 2: State Management & Contexts (⏳ NEXT)

### Priority 1: Create React Contexts

#### AuthContext (`src/contexts/AuthContext.tsx`)
**Purpose**: Manage authentication state globally

**State to Manage:**
```typescript
{
  authed: boolean
  loading: boolean
  transitioning: boolean
  user: User | null
  isGuest: boolean
  guestId: string | undefined
  apiError: string | null
}
```

**Methods to Implement:**
```typescript
- signIn(email: string, code: string)
- signUp(email: string, name: string)
- signOut()
- refreshUser()
- loginAsGuest()
- restartApp()
```

**Mobile Reference**: `Frontend/src/contexts/AuthContext.tsx`

#### ThemeContext (`src/contexts/ThemeContext.tsx`)
**Purpose**: Light/Dark/Auto theme management

**State to Manage:**
```typescript
{
  theme: 'light' | 'dark' | 'auto'
  isDark: boolean (computed)
}
```

**Methods to Implement:**
```typescript
- setTheme(theme: 'light' | 'dark' | 'auto')
- toggleTheme()
```

**Implementation Notes:**
- Use `next-themes` package for Next.js integration
- Persist to localStorage
- Listen to system preference changes

#### LanguageContext (`src/contexts/LanguageContext.tsx`)
**Purpose**: i18n language switching

**State to Manage:**
```typescript
{
  language: 'en' | 'mk'
  isLoading: boolean
}
```

**Methods to Implement:**
```typescript
- setLanguage(lang: 'en' | 'mk')
- toggleLanguage()
- refreshTranslations()
```

**Mobile Reference**: `Frontend/src/contexts/LanguageContext.tsx`

#### WishlistContext (`src/contexts/WishlistContext.tsx`)
**Purpose**: Manage wishlist state and operations

**State to Manage:**
```typescript
{
  wishlistItems: WishlistItem[]
  loading: boolean
  error: string | null
}
```

**Methods to Implement:**
```typescript
- addToWishlist(request: WishlistAddRequest)
- removeFromWishlist(request: WishlistRemoveRequest)
- isInWishlist(itemType: string, itemId: number): boolean
- clearWishlist()
- refreshWishlist()
```

**Mobile Reference**: `Frontend/src/contexts/WishlistContext.tsx`

#### ToastContext (`src/contexts/ToastContext.tsx`)
**Purpose**: Global toast notifications

**State to Manage:**
```typescript
{
  toasts: Toast[]
}
```

**Methods to Implement:**
```typescript
- showToast(message: string, type: 'success' | 'error' | 'info')
- hideToast(id: string)
```

**Implementation Options:**
- Use `sonner` package for beautiful toasts
- Or build custom with Tailwind

---

## Phase 3: Layout Components (⏳ NEXT)

### Priority 2: Build Layout Structure

#### Header Component (`src/components/layout/Header.tsx`)
**Features:**
- Logo and brand name
- Desktop navigation menu (Home, Search, Events, Promotions, Blog)
- Language switcher (EN/MK)
- Theme toggle button
- User profile dropdown or Login button
- Mobile: Hamburger menu button

**Responsive Behavior:**
- Desktop: Full horizontal nav
- Mobile: Hamburger menu + modal

#### Navigation Component (`src/components/layout/Navigation.tsx`)
**Features:**
- **Desktop**: Top navigation bar
- **Mobile**: Bottom navigation bar or slide-out menu
- Active route highlighting
- Icons for each section

**Tabs:**
1. Home (House icon)
2. Search (Search icon)
3. Events (Calendar icon)
4. Promotions (Tag icon)
5. Profile (User icon)

#### Footer Component (`src/components/layout/Footer.tsx`)
**Features:**
- Links (Privacy Policy, Terms, About, Contact)
- Social media links
- Copyright notice
- Language selector

#### MobileNav Component (`src/components/layout/MobileNav.tsx`)
**Features:**
- Bottom tab bar for mobile
- Slide-out drawer menu
- Responsive breakpoint: < 768px

---

## Phase 4: UI Primitives (shadcn/ui style) (⏳ NEXT)

### Priority 3: Create Base UI Components

All components should follow shadcn/ui patterns with Tailwind + CVA:

#### Button (`src/components/ui/Button.tsx`)
**Variants:**
- default, destructive, outline, secondary, ghost, link
- Sizes: sm, md, lg
- With loading state and icon support

#### Card (`src/components/ui/Card.tsx`)
**Parts:**
- CardHeader, CardTitle, CardDescription
- CardContent, CardFooter
- Hover effects for interactive cards

#### Dialog (`src/components/ui/Dialog.tsx`)
**Features:**
- Modal overlay
- Responsive sizing
- Close button
- Keyboard navigation (Escape to close)

#### Input (`src/components/ui/Input.tsx`)
**Features:**
- Text input with label
- Error state
- Icons (prefix/suffix)

#### Toast (`src/components/ui/Toast.tsx`)
**Features:**
- Success, error, info, warning variants
- Auto-dismiss
- Close button
- Stacking multiple toasts

---

## Phase 5: Content Cards (⏳ NEXT)

### Priority 4: Create Card Components

#### ListingCard (`src/components/cards/ListingCard.tsx`)
**Features:**
- Image with fallback
- Title and category
- Address with location icon
- Open/Closed status
- Wishlist heart button
- Click to navigate to detail page

**Mobile Reference**: `Frontend/src/components/ListingCard.tsx`

#### EventCard (`src/components/cards/EventCard.tsx`)
**Features:**
- Cover image
- Title and date/time
- Location
- Entry price
- Category badge
- Join count
- Wishlist button

**Mobile Reference**: `Frontend/src/components/EventCard.tsx`

#### PromotionCard (`src/components/cards/PromotionCard.tsx`)
**Features:**
- Promo image
- Title and discount code
- Valid until date
- Tags
- Wishlist button

#### BlogCard (`src/components/cards/BlogCard.tsx`)
**Features:**
- Cover image
- Title and subtitle
- Author and read time
- Category tags
- Published date

---

## Phase 6: Homepage Implementation (⏳ NEXT)

### Priority 5: Build Homepage (`src/app/page.tsx`)

**Sections:**
1. **Hero Section**
   - Welcome message
   - Search bar
   - Background image or gradient

2. **Featured Carousel**
   - Use `embla-carousel-react`
   - Auto-rotate every 10 seconds
   - 3 featured listings
   - Dot indicators

3. **Upcoming Events Section**
   - Horizontal scroll or grid
   - Show 3-4 events
   - "See All" link to Events page

4. **Promotions Section**
   - Horizontal scroll
   - Featured promotions
   - "See All" link

5. **Blog Section**
   - Grid layout
   - 2-3 featured articles
   - "Read More" links

**Data Fetching:**
- Use React Server Components for initial load
- Or client-side with React Query
- Fetch featured items from API

**Mobile Reference**: `Frontend/src/screens/HomeScreen.tsx`

---

## Phase 7: Detail Pages (⏳ NEXT)

### Priority 6: Listing Detail Page (`src/app/listings/[id]/page.tsx`)

**Features:**
- Image gallery (lightbox with `yet-another-react-lightbox`)
- Title, description, address
- Category and tags
- Amenities list with icons
- Working hours table
- Contact information (phone, social links, website)
- Open/Closed status
- Related promotions
- Wishlist button
- Edit button (if user has permission)

**Layout:**
- Desktop: 2-column (images left, info right)
- Mobile: Stacked vertical

**Mobile Reference**: `Frontend/src/screens/details/ListingDetailScreen.tsx`

### Priority 7: Event Detail Page (`src/app/events/[id]/page.tsx`)

**Features:**
- Image gallery
- Title, description, location
- Date and time
- Entry price and age limit
- Expectations (icons + text)
- Join button or contact info
- Join count
- Related listings
- Wishlist button

**Mobile Reference**: `Frontend/src/screens/details/EventDetailScreen.tsx`

### Priority 8: Promotion Detail Page (`src/app/promotions/[id]/page.tsx`)

**Features:**
- Image gallery
- Title and description
- Discount code (with copy button)
- Valid until date
- Tags
- Related listings
- Contact info
- Wishlist button

### Priority 9: Blog Article Page (`src/app/blog/[id]/page.tsx`)

**Features:**
- Cover image
- Title, subtitle, author
- Read time estimate
- Rich text content (Markdown rendering)
- Category tags
- Published date
- Related articles

---

## Phase 8: List/Grid Pages (⏳ NEXT)

### Priority 10: Search/Browse Page (`src/app/search/page.tsx`)

**Features:**
- Search bar
- Category filter (dropdown or chips)
- Tag filter
- Grid layout (2-3 columns)
- Infinite scroll or pagination
- Empty state
- Loading skeletons

**Mobile Reference**: `Frontend/src/screens/main/SearchScreen.tsx`

### Priority 11: Events Page (`src/app/events/page.tsx`)

**Features:**
- Category filter
- Date filter (upcoming, past)
- Grid layout
- EventCard components
- Pagination

**Mobile Reference**: `Frontend/src/screens/main/EventsScreen.tsx`

### Priority 12: Promotions Page (`src/app/promotions/page.tsx`)

**Features:**
- Filter by active/expired
- Grid or list layout
- PromotionCard components

### Priority 13: Blog Page (`src/app/blog/page.tsx`)

**Features:**
- Category filter
- Search by title
- Grid layout
- BlogCard components
- Pagination

---

## Phase 9: User Features (⏳ NEXT)

### Priority 14: Authentication Pages

#### Login Page (`src/app/(auth)/login/page.tsx`)
**Features:**
- Email input
- "Send Code" button
- Verification code input (6 digits)
- "Continue as Guest" option
- Form validation with Zod

**Flow:**
1. User enters email → Click "Send Code"
2. Backend sends 6-digit code to email
3. User enters code → Verify
4. Backend returns JWT tokens
5. Save tokens and redirect to home

#### Register Page (`src/app/(auth)/register/page.tsx`)
**Features:**
- Email input
- Name input
- "Send Code" button
- Verification code input
- Form validation

### Priority 15: Profile Page (`src/app/profile/page.tsx`)

**Features:**
- User info (email, name)
- Avatar selection (10 options)
- Theme preference (Light/Dark/Auto)
- Language preference (EN/MK)
- Logout button
- Links to:
  - Wishlist
  - Help & Support
  - Privacy Policy
  - Terms of Service

**Mobile Reference**: `Frontend/src/screens/main/ProfileScreen.tsx`

### Priority 16: Wishlist Page (`src/app/profile/wishlist/page.tsx`)

**Features:**
- Grouped by type (Listings, Events, Promotions, Blogs)
- Card display for each item
- Remove button
- Empty state with call-to-action
- Link to original item

---

## Phase 10: Internationalization (⏳ NEXT)

### Priority 17: Set Up next-intl

**Installation:**
```bash
npm install next-intl
```

**Configuration:**
1. Create `src/i18n/request.ts` - Server-side i18n config
2. Create `src/i18n/navigation.ts` - Localized navigation helpers
3. Create translation files:
   - `messages/en.json`
   - `messages/mk.json`

**Namespaces:**
- `common` - Shared UI strings
- `navigation` - Menu items
- `screens` - Screen-specific text
- `errors` - Error messages

**Backend Integration:**
- Fetch translations from API: `/api/i18n/{language}/{namespace}/`
- Merge with local translations

**Mobile Reference**: `Frontend/src/i18n/`

---

## Phase 11: Polish & Optimization (⏳ FUTURE)

### Priority 18: Responsive Design
- Test on mobile (320px - 767px)
- Test on tablet (768px - 1023px)
- Test on desktop (1024px+)
- Adjust layouts and spacing

### Priority 19: Loading States
- Skeleton loaders for cards
- Page transitions
- Button loading states
- Suspense boundaries

### Priority 20: Error Handling
- Error boundaries for each route
- 404 page
- 500 page
- Network error messages
- Retry logic

### Priority 21: SEO Optimization
- Metadata for each page
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Sitemap generation

### Priority 22: Performance
- Image optimization (next/image)
- Code splitting (dynamic imports)
- Bundle size analysis
- Lighthouse audit
- Core Web Vitals optimization

### Priority 23: Accessibility
- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader testing
- Color contrast (WCAG AA)

---

## Development Commands

```bash
# Start development server
cd Web
npm run dev

# Open browser
# http://localhost:3000

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

---

## API Testing

Ensure your Django backend is running:

```bash
cd Api
python manage.py runserver
```

Test API endpoints:
```bash
# Health check
curl http://localhost:8000/api/health/

# Get categories
curl http://localhost:8000/api/categories/

# Get featured listings
curl http://localhost:8000/api/listings/featured/
```

---

## Next Steps Summary

1. **Immediate Next (Phase 2)**:
   - Create AuthContext with login/logout
   - Create ThemeContext with next-themes
   - Create LanguageContext with next-intl
   - Create WishlistContext with React Query

2. **Then (Phase 3)**:
   - Build Header with navigation
   - Build Footer
   - Build responsive mobile nav

3. **Then (Phase 4-5)**:
   - Create UI primitives (Button, Card, Dialog, etc.)
   - Create content cards (ListingCard, EventCard, etc.)

4. **Then (Phase 6)**:
   - Implement homepage with featured carousel
   - Connect to API with React Query

5. **Continue with Phases 7-11** as outlined above

---

## Questions or Issues?

Refer to:
- Mobile app code in `Frontend/src/`
- This migration guide
- Next.js docs: https://nextjs.org/docs
- React Query docs: https://tanstack.com/query
- Tailwind docs: https://tailwindcss.com/docs

---

**Current Status**: ✅ Phase 1 Complete - Foundation is solid, ready for UI development!
