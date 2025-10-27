# Quick Start Guide - GoGevgelija Web

## ✅ What's Been Done

Your Next.js web application is ready with:
- Complete project structure
- TypeScript types from mobile app
- API client with JWT authentication
- All service layer code migrated
- Tailwind CSS configured
- Development environment ready

## 🚀 Start Development

### 1. Start the Backend (Terminal 1)
```bash
cd Api
python manage.py runserver
```
Backend will run on: http://localhost:8000

### 2. Start the Web App (Terminal 2)
```bash
cd Web
npm run dev
```
Web app will run on: http://localhost:3000

### 3. Open in Browser
Navigate to: **http://localhost:3000**

You should see the welcome page with the project status!

## 📁 Project Structure Overview

```
Web/
├── src/
│   ├── app/              # Pages (Next.js App Router)
│   ├── components/       # React components (to be built)
│   ├── lib/
│   │   ├── api/          # ✅ API client & services (DONE)
│   │   └── auth/         # ✅ Token management (DONE)
│   ├── types/            # ✅ TypeScript types (DONE)
│   └── styles/           # ✅ Global CSS (DONE)
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

## 🎯 Next Steps to Build the UI

### Step 1: Create React Contexts (State Management)
Create these files in `src/contexts/`:
- `AuthContext.tsx` - User authentication state
- `ThemeContext.tsx` - Light/dark mode
- `LanguageContext.tsx` - i18n (EN/MK)
- `WishlistContext.tsx` - Wishlist management

**Reference**: Look at `Frontend/src/contexts/` in the mobile app

### Step 2: Build Layout Components
Create these files in `src/components/layout/`:
- `Header.tsx` - Top navigation bar
- `Footer.tsx` - Footer with links
- `Navigation.tsx` - Main nav menu
- `MobileNav.tsx` - Mobile bottom nav

### Step 3: Create UI Components
Create these files in `src/components/ui/`:
- `Button.tsx` - Reusable button
- `Card.tsx` - Card container
- `Dialog.tsx` - Modal dialogs
- `Input.tsx` - Form inputs

**Tip**: Use shadcn/ui patterns or copy from mobile app

### Step 4: Build Content Cards
Create these files in `src/components/cards/`:
- `ListingCard.tsx` - Restaurant/hotel card
- `EventCard.tsx` - Event card
- `PromotionCard.tsx` - Promotion card
- `BlogCard.tsx` - Blog article card

**Reference**: `Frontend/src/components/` in mobile app

### Step 5: Build Homepage
Edit `src/app/page.tsx` to add:
- Featured carousel (use `embla-carousel-react`)
- Upcoming events section
- Promotions section
- Blog articles preview

**Fetch data using**:
```typescript
import { listingService, eventService } from '@/lib/api/services';

const featuredListings = await listingService.getFeatured();
const featuredEvents = await eventService.getFeatured();
```

### Step 6: Create Detail Pages
Create these directories and files:
- `src/app/listings/[id]/page.tsx` - Listing detail
- `src/app/events/[id]/page.tsx` - Event detail
- `src/app/promotions/[id]/page.tsx` - Promotion detail
- `src/app/blog/[id]/page.tsx` - Blog article

**Use dynamic routes**: `[id]` becomes the item ID

### Step 7: Create List Pages
- `src/app/search/page.tsx` - Browse all listings
- `src/app/events/page.tsx` - All events
- `src/app/promotions/page.tsx` - All promotions
- `src/app/blog/page.tsx` - All blog articles

### Step 8: Add Authentication
- `src/app/(auth)/login/page.tsx` - Login page
- `src/app/(auth)/register/page.tsx` - Registration
- Use AuthContext for state management

### Step 9: Add User Features
- `src/app/profile/page.tsx` - User profile
- `src/app/profile/wishlist/page.tsx` - Wishlist

## 📚 Helpful Resources

### Using the API Services
```typescript
// Import service
import { listingService } from '@/lib/api/services';

// Fetch all listings
const listings = await listingService.getAll();

// Fetch with pagination
const page1 = await listingService.getPage(1, 20);

// Fetch by category
const restaurants = await listingService.getByCategory('restaurants');

// Get single listing
const listing = await listingService.getById(123);
```

### TypeScript Types
```typescript
// Import types
import { Listing, Event, Promotion, Category } from '@/types';

// Use in components
interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}
```

### Styling with Tailwind
```typescript
// Basic button
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
  Click me
</button>

// Card
<div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
  Content
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards here */}
</div>
```

### Responsive Design Breakpoints
```css
/* Mobile first approach */
sm:  640px   /* Tablet */
md:  768px   /* Desktop */
lg:  1024px  /* Large desktop */
xl:  1280px  /* Extra large */
2xl: 1536px  /* Ultra wide */
```

## 🔧 Common Commands

```bash
# Install new package
npm install package-name

# Run type checking
npm run type-check

# Build for production
npm run build

# Run production build
npm start

# Clear Next.js cache
rm -rf .next
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or start on different port
npm run dev -- -p 3001
```

### API connection issues
1. Make sure Django backend is running on port 8000
2. Check `.env.local` has correct API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Check Django CORS settings allow localhost:3000

### TypeScript errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run type-check
```

## 📖 Documentation References

- **Next.js Docs**: https://nextjs.org/docs
- **React Query**: https://tanstack.com/query/latest/docs/framework/react/overview
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

## 🎨 Design Tips

1. **Look at the mobile app** for design inspiration
2. **Reuse color schemes** from mobile app
3. **Keep layouts simple** - mobile first
4. **Use consistent spacing** - Tailwind spacing scale
5. **Add hover states** for better UX on desktop

## ✨ Pro Tips

- Use React Server Components for data fetching (faster initial load)
- Use `useQuery` from React Query for client-side data fetching
- Always show loading states
- Handle errors gracefully
- Add skeleton loaders for better perceived performance
- Test on mobile viewport (DevTools responsive mode)

## 📞 Need Help?

1. Check `MIGRATION_GUIDE.md` for detailed phase-by-phase instructions
2. Look at mobile app code in `Frontend/src/` for reference
3. Check API responses: http://localhost:8000/api/listings/
4. Review Next.js examples: https://github.com/vercel/next.js/tree/canary/examples

---

**You're ready to start building! 🚀**

Start with creating the contexts in `src/contexts/`, then move on to layout components. The foundation is solid - now it's time to bring it to life with React components!
