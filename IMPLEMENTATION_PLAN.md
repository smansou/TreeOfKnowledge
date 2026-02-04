# Tree of Knowledge - Implementation Plan

## Project Overview

**Tree of Knowledge** is a personal knowledge organization system that automatically collects, summarizes, and categorizes content from various sources (articles, videos, podcasts, books) into a visual, searchable knowledge tree structure.

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, Tailwind CSS, shadcn/ui
- **PWA**: Service Worker, Web App Manifest, offline capabilities
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI Integration**: OpenAI API (for summarization and categorization)
- **Deployment**: Vercel (seamless Next.js integration)

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Content       │    │ • OpenAI API    │
│ • Tree View     │    │   Processing    │    │ • YouTube API   │
│ • Search        │    │ • AI Integration│    │ • Article       │
│ • Settings      │    │ • Data Management│   │   Extractors    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Supabase      │
                       │                 │
                       │ • PostgreSQL    │
                       │ • Auth          │
                       │ • Storage       │
                       │ • Real-time     │
                       └─────────────────┘
```

## Database Schema

### Core Tables

#### `users` (Supabase Auth)

- Handled by Supabase Authentication
- Extended with user preferences

#### `knowledge_items`

```sql
CREATE TABLE knowledge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type VARCHAR(20) NOT NULL, -- 'article', 'video', 'podcast', 'book'
    source_url TEXT,
    original_content TEXT,
    summary TEXT,
    key_points JSONB,
    metadata JSONB, -- author, duration, publish_date, etc.
    processed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `categories`

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    color VARCHAR(7), -- hex color code
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `knowledge_categories`

```sql
CREATE TABLE knowledge_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_item_id UUID REFERENCES knowledge_items(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    confidence_score DECIMAL(3,2), -- AI confidence in categorization
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(knowledge_item_id, category_id)
);
```

#### `tags`

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `knowledge_tags`

```sql
CREATE TABLE knowledge_tags (
    knowledge_item_id UUID REFERENCES knowledge_items(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (knowledge_item_id, tag_id)
);
```

### Indexes and Performance

```sql
-- Search optimization
CREATE INDEX idx_knowledge_items_user_content ON knowledge_items(user_id, content_type);
CREATE INDEX idx_knowledge_items_created_at ON knowledge_items(created_at DESC);

-- Full-text search
CREATE INDEX idx_knowledge_items_search ON knowledge_items
USING gin(to_tsvector('english', title || ' ' || summary));

-- Category tree optimization
CREATE INDEX idx_categories_user_parent ON categories(user_id, parent_id);
```

## Project Structure

```
tree-of-knowledge/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── tree/
│   │   ├── search/
│   │   └── settings/
│   ├── api/ (implemented in Phase 4+)
│   │   ├── auth/
│   │   ├── knowledge/
│   │   ├── categories/
│   │   ├── content/
│   │   └── ai/
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.json
│   └── page.tsx
├── public/
│   ├── icons/ (PWA icons in multiple sizes)
│   ├── sw.js (Service Worker)
│   └── offline.html
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/
│   ├── knowledge/
│   ├── tree/
│   ├── search/
│   └── forms/
├── lib/
│   ├── mocks/ (Phase 1-3: Frontend development)
│   │   ├── fixtures.ts
│   │   ├── handlers.ts
│   │   └── browser.ts
│   ├── data/ (Data access layer)
│   │   ├── knowledge.ts
│   │   ├── categories.ts
│   │   └── auth.ts
│   ├── supabase/ (Phase 4+: Backend integration)
│   ├── ai/ (Phase 5+: AI integration)
│   ├── content-extractors/ (Phase 5+: Content processing)
│   ├── utils/
│   └── validations/
├── types/
│   ├── knowledge.ts
│   ├── category.ts
│   ├── user.ts
│   └── api.ts
├── hooks/
│   ├── useKnowledgeItems.ts
│   ├── useCategories.ts
│   ├── useAuth.ts
│   └── useSearch.ts
└── styles/
```

## Implementation Progress

### Completed ✅

- **Project Foundation**: Next.js 14+ with TypeScript, App Router, and Tailwind CSS
- **UI Components**: shadcn/ui components installed (button, card, input, form, dialog, tabs, etc.)
- **PWA Setup**: Web App Manifest, PWA configuration in next.config.ts with offline caching
- **Project Structure**: Proper directory structure established with src/ folder
- **Package Management**: Essential dependencies installed including next-pwa, workbox
- **Development Tools**: ESLint + Prettier configured with Git hooks (Husky + lint-staged)
- **Environment Configuration**: Environment variables template and setup guide created
- **Code Quality**: Automatic formatting, linting, and import organization on commit
- **Authentication UI**: Login/signup pages implemented using shadcn components with tabbed interface, responsive design, and form validation

- ✅ **Login/Signup UI**: Combined auth page with tabbed interface using shadcn components
- ✅ **Components Added**: Installed and configured tabs component (`@radix-ui/react-tabs`)
- ✅ **Routing Structure**: Created `(auth)` route group with proper layout and page structure
- ✅ **Form Features**: Email/password login, full registration form, form validation, loading states
- ✅ **UI/UX**: Google auth buttons (UI ready), "Forgot Password" link, responsive mobile-first design
- ✅ **Mock Handlers**: Placeholder authentication logic ready for state management integration
- ✅ **File Structure**:
  - `src/app/(auth)/layout.tsx` - Auth pages layout
  - `src/app/(auth)/auth/page.tsx` - Combined login/signup page
  - `src/components/ui/tabs.tsx` - Shadcn tabs component

- ✅ **Phase 2.1 - Dashboard Layout & Navigation**: Mobile-first responsive dashboard with bottom navigation
- ✅ **Dashboard Structure**: Complete dashboard layout with header, content area, and fixed bottom navigation
- ✅ **Bottom Navigation**: Three-tab navigation (Tree, Search, Profile) with active state indicators
- ✅ **Floating Action Button**: Circular plus button for adding knowledge items with proper positioning
- ✅ **Add Item Form**: Complete form in Sheet component with URL, title, description, and tags fields
- ✅ **Page Components**: Tree, Search, and Profile pages with placeholder content and proper UI structure
- ✅ **Component Integration**: Added textarea component, enhanced existing shadcn/ui component usage
- ✅ **Mobile Optimization**: Touch-friendly interface with proper spacing and responsive design

## Implementation Phases

### Phase 1: Foundation & Project Setup

#### 1.1 Project Setup

- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS and shadcn/ui (mobile-first)
- [x] Set up PWA configuration (Web App Manifest, Service Worker)
- [x] Configure offline-first data caching strategy
- [x] Set up ESLint, Prettier, and Git hooks
- [x] Configure environment variables

#### 1.2 Type Definitions & Mock Data

- [x] Create TypeScript interfaces for all data models
- [x] Generate comprehensive mock data fixtures
- [x] Set up Mock Service Worker (MSW) for API mocking
- [x] Create data access layer abstractions

#### 1.3 Basic Authentication UI

- [x] Create login/signup pages (UI only)
- [x] Implement authentication state management with Context
- [x] Create protected route wrapper (using mock auth)
- [x] Add user session management (mock implementation)

### Phase 2: Frontend Dashboard & Core UI

#### 2.1 Layout & Navigation ✅

- [x] Create mobile-first responsive main page layout: navigation bar at the bottom with 3 tabs: tree (tree icon), search (search icon), profile (user icon)
- [x] circular plus icon at the bottom right of the screen to add a new knowledge item
- [x] form to add a new knowledge item: url, title, description, tags

**Completed Implementation Details:**

- ✅ **Dashboard Layout** (`src/app/dashboard/layout.tsx`): Mobile-first responsive layout with header, content area, and bottom navigation
- ✅ **Bottom Navigation**: Fixed navigation bar with Tree (TreePine), Search, Profile (User) icons using Lucide React
- ✅ **Floating Action Button**: Circular plus button positioned bottom-right with shadow effects and hover animations
- ✅ **Add Knowledge Item Form**: Sheet component sliding up from bottom with complete form (URL, title, description, tags) using shadcn/ui components
- ✅ **Page Structure Created**:
  - `src/app/dashboard/tree/page.tsx` - Tree visualization placeholder with quick categories and popular tags
  - `src/app/dashboard/search/page.tsx` - Search interface with filters, tips, and content type badges
  - `src/app/dashboard/profile/page.tsx` - User profile with settings, preferences, and usage statistics
- ✅ **Navigation Flow**: Default `/dashboard` redirects to `/dashboard/tree`, active state indicators for current page
- ✅ **UI Components**: Added textarea component, utilized Card, Button, Input, Label, Sheet, Badge, Avatar components
- ✅ **Mobile Optimization**: Touch-friendly 64px navigation height, proper spacing (pb-20), responsive grid layouts
- ✅ **Accessibility**: Screen reader labels, keyboard navigation support, proper ARIA attributes

#### 2.2 Knowledge Item Management UI

- [ ] Edit and delete functionality
- [ ] Loading states and error boundaries

#### 2.3 Search Interface

- [ ] Search input with filters
- [ ] Results display components
- [ ] Pagination components
- [ ] Sort options and controls

### Phase 3: Tree Visualization & Advanced UI

#### 3.1 Tree Structure & Visualization

- [ ] Implement tree data structure
- [ ] Create category hierarchy components
- [ ] Design tree visualization (React Flow)
- [ ] Responsive tree layout for mobile

#### 3.2 Interactive Tree Features

- [ ] Expandable/collapsible nodes with touch gestures
- [ ] Node details on hover/click (touch-optimized)
- [ ] Touch-friendly drag and drop for reorganization
- [ ] Zoom and pan functionality (pinch-to-zoom support)
- [ ] Mobile-optimized tree controls

#### 3.3 Tree Management UI

- [ ] Add/edit/delete category modals
- [ ] Move items between categories interface
- [ ] Category statistics dashboard
- [ ] Tree view settings and preferences

### Phase 4: Backend Infrastructure & Database

#### 4.1 Supabase Integration

- [ ] Create Supabase project
- [ ] Set up database schema
- [ ] Configure Row Level Security (RLS)
- [ ] Implement Supabase client utilities

#### 4.2 Authentication Backend

- [ ] Configure Supabase authentication
- [ ] Implement authentication middleware
- [ ] Replace mock auth with real Supabase auth
- [ ] Add user session management

#### 4.3 API Foundation

- [ ] Set up API route structure
- [ ] Implement error handling middleware
- [ ] Add request validation (Zod)
- [ ] Create database utilities

### Phase 5: Content Processing & AI Integration

#### 5.1 Content Processing APIs

- [ ] URL validation and metadata extraction
- [ ] Content extraction for different types:
  - Articles (using libraries like `readability`)
  - YouTube videos (YouTube API)
  - Podcasts (RSS feeds)
- [ ] Content processing background jobs

#### 5.2 AI Integration

- [ ] Implement content summarization (OpenAI API)
- [ ] Extract key points and insights
- [ ] Auto-categorization system
- [ ] Category suggestion with confidence scoring

#### 5.3 Knowledge Management APIs

- [ ] CRUD operations for knowledge items
- [ ] Category management APIs
- [ ] Tag system APIs
- [ ] Search functionality backend

### Phase 6: Frontend-Backend Integration & PWA Enhancement

#### 6.1 Replace Mock Data

- [ ] Connect dashboard to real APIs
- [ ] Replace MSW mocks with actual API calls
- [ ] Implement real-time updates with Supabase
- [ ] Add proper error handling and loading states

#### 6.4 PWA Implementation

- [ ] Implement Service Worker for offline caching
- [ ] Add offline data synchronization
- [ ] Create app install prompts and onboarding
- [ ] Implement background sync for content processing
- [ ] Add push notifications for knowledge reminders
- [ ] Optimize for mobile performance and battery usage

#### 6.2 Search Integration

- [ ] Connect search UI to backend search APIs
- [ ] Implement full-text search with highlighting
- [ ] Add search filters and sorting
- [ ] Search suggestions and autocomplete

#### 6.3 Tree Data Integration

- [ ] Connect tree visualization to real category data
- [ ] Implement real drag-and-drop persistence
- [ ] Add real-time category updates
- [ ] Performance optimization for large trees

### Phase 7: Advanced Features & Polish

#### 7.1 Enhanced AI Features

- [ ] Semantic search capabilities
- [ ] Content enhancement (entity extraction)
- [ ] Relationship detection between content
- [ ] Topic modeling for better organization

#### 7.2 Analytics & Insights

- [ ] Knowledge review scheduler
- [ ] Topic summaries
- [ ] Learning analytics
- [ ] Knowledge gaps identification

#### 7.3 Export & Sharing

- [ ] Export knowledge tree
- [ ] Share individual items
- [ ] Backup functionality
- [ ] Data migration tools

## Frontend-First Development Strategy

### Benefits of This Approach

1. **Faster Iteration**: UI development and user testing can begin immediately
2. **Better UX Design**: Focus on user experience without backend constraints
3. **Parallel Development**: Frontend and backend teams can work simultaneously
4. **Early Validation**: Stakeholder feedback on functionality and design early in the process
5. **Reduced Risk**: UI/UX issues discovered before backend investment

### Mock Data Strategy

#### Mock Service Worker (MSW) Setup

```typescript
// lib/mocks/handlers.ts
import { rest } from "msw";
import { mockKnowledgeItems, mockCategories } from "./fixtures";

export const handlers = [
  rest.get("/api/knowledge", (req, res, ctx) => {
    return res(ctx.json(mockKnowledgeItems));
  }),

  rest.post("/api/knowledge", (req, res, ctx) => {
    const newItem = { id: generateId(), ...req.body, createdAt: new Date() };
    return res(ctx.json(newItem));
  }),

  rest.get("/api/categories", (req, res, ctx) => {
    return res(ctx.json(mockCategories));
  }),
];
```

#### Data Access Layer Pattern

```typescript
// lib/data/knowledge.ts
interface DataSource {
  getKnowledgeItems(): Promise<KnowledgeItem[]>;
  createKnowledgeItem(item: CreateKnowledgeItemRequest): Promise<KnowledgeItem>;
  // ... other methods
}

class MockDataSource implements DataSource {
  async getKnowledgeItems() {
    // Mock implementation
    return mockKnowledgeItems;
  }
  // ... other mock methods
}

class ApiDataSource implements DataSource {
  async getKnowledgeItems() {
    // Real API implementation
    return fetch("/api/knowledge").then((res) => res.json());
  }
  // ... other API methods
}

// Easy switching between mock and real data
export const dataSource: DataSource =
  process.env.NODE_ENV === "development" && process.env.USE_MOCKS === "true"
    ? new MockDataSource()
    : new ApiDataSource();
```

#### Comprehensive Mock Data

```typescript
// lib/mocks/fixtures.ts
export const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    contentType: "article",
    sourceUrl: "https://example.com/ml-intro",
    summary: "Comprehensive overview of ML fundamentals...",
    keyPoints: [
      "Supervised vs Unsupervised",
      "Feature Engineering",
      "Model Evaluation",
    ],
    metadata: {
      author: "John Doe",
      publishDate: "2024-01-15",
      readTime: "15 min",
    },
    categories: ["machine-learning", "fundamentals"],
    tags: ["ai", "beginner-friendly", "overview"],
    createdAt: "2024-01-15T10:00:00Z",
  },
  // ... more realistic mock data covering edge cases
];

export const mockCategories: Category[] = [
  {
    id: "machine-learning",
    name: "Machine Learning",
    description: "AI and ML related content",
    parentId: "technology",
    color: "#3B82F6",
    icon: "brain",
    itemCount: 15,
  },
  // ... hierarchical category structure
];
```

### Component Development Strategy

#### Progressive Enhancement Pattern

```typescript
// components/KnowledgeItemCard.tsx
interface KnowledgeItemCardProps {
  item: KnowledgeItem;
  isLoading?: boolean;
  onEdit?: (item: KnowledgeItem) => void;
  onDelete?: (id: string) => void;
}

export function KnowledgeItemCard({
  item,
  isLoading,
  onEdit,
  onDelete,
}: KnowledgeItemCardProps) {
  // Component works with both mock and real data
  // Handles loading states gracefully
  // Can function with or without edit/delete handlers
}
```

#### State Management for Mocks

```typescript
// hooks/useKnowledgeItems.ts
export function useKnowledgeItems() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // This hook will work seamlessly with both mock and real data
  // Just swap the data source when backend is ready

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dataSource.getKnowledgeItems();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { items, isLoading, fetchItems /* ... other methods */ };
}
```

## Technical Considerations

### PWA Implementation Strategy

#### Web App Manifest

```json
// public/manifest.json
{
  "name": "Tree of Knowledge",
  "short_name": "ToK",
  "description": "Personal knowledge organization system",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["productivity", "education", "utilities"]
}
```

#### Service Worker Strategy

```typescript
// public/sw.js - Key caching strategies:
// 1. App Shell (Cache First) - UI components, styles
// 2. API Data (Network First with Fallback) - Knowledge items, categories
// 3. Static Assets (Cache First) - Images, fonts
// 4. Background Sync - Offline content processing
```

#### Offline-First Data Layer

```typescript
// lib/data/offline-storage.ts
class OfflineDataManager {
  async syncKnowledgeItems() {
    // Implement offline queue for CREATE/UPDATE/DELETE operations
    // Use IndexedDB for local storage
    // Sync when connection is restored
  }

  async cacheSearchResults() {
    // Cache frequently accessed search queries
    // Implement smart prefetching based on user patterns
  }
}
```

#### Mobile Performance Optimizations

- **Code Splitting**: Dynamic imports for tree visualization
- **Image Optimization**: WebP format with fallbacks, lazy loading
- **Bundle Size**: Tree shaking, minimize third-party dependencies
- **Memory Management**: Efficient tree rendering with virtualization
- **Touch Interactions**: Optimized event handlers, gesture recognition

### Content Extraction Strategy

#### Articles

```typescript
// lib/content-extractors/article.ts
import { extract } from "@extractus/article-extractor";

export async function extractArticle(url: string) {
  const article = await extract(url);
  return {
    title: article?.title,
    content: article?.content,
    author: article?.author,
    publishedTime: article?.published,
    description: article?.description,
  };
}
```

#### YouTube Videos

```typescript
// lib/content-extractors/youtube.ts
export async function extractYouTubeVideo(url: string) {
  // Use YouTube API or ytdl-core for metadata
  // Extract transcript using YouTube API or external service
}
```

### AI Integration Pattern

```typescript
// lib/ai/summarizer.ts
import OpenAI from "openai";

export async function summarizeContent(content: string, contentType: string) {
  const prompt = `Summarize the following ${contentType} content in 3-5 bullet points, 
                  focusing on key insights and actionable information:`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `${prompt}\n\n${content}` }],
  });

  return response.choices[0].message.content;
}
```

### Performance Optimizations

1. **Database Optimizations**
   - Use proper indexes for search queries
   - Implement query optimization for tree structures
   - Consider materialized views for complex aggregations

2. **Frontend Optimizations**
   - Implement virtual scrolling for large lists
   - Use React Query for caching and optimistic updates
   - Lazy load tree nodes for better performance

3. **API Optimizations**
   - Implement rate limiting
   - Use background jobs for content processing
   - Cache frequently accessed data

### Security Considerations

1. **Data Protection**
   - Implement Row Level Security (RLS) in Supabase
   - Validate all inputs on both client and server
   - Sanitize extracted content

2. **API Security**
   - Rate limiting on content extraction
   - Input validation and sanitization
   - Proper error handling without information leakage

3. **Authentication**
   - Secure session management
   - Protected API routes
   - Proper CORS configuration

## Environment Variables

```env
# Development Configuration
NODE_ENV=development
USE_MOCKS=true # Set to false when connecting to real backend

# PWA Configuration
NEXT_PUBLIC_PWA_ENABLED=true
NEXT_PUBLIC_APP_NAME="Tree of Knowledge"
NEXT_PUBLIC_APP_SHORT_NAME="ToK"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# YouTube (if using YouTube API)
YOUTUBE_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=
```

## Development Guidelines

### Code Organization

- Use TypeScript for type safety
- Implement proper error boundaries
- Follow consistent naming conventions
- Write comprehensive tests for critical paths

### State Management

- Use React Query for server state
- Local state with useState/useReducer
- Context for app-wide settings

### UI/UX Principles

- Mobile-first responsive design with PWA capabilities
- Touch-optimized interactions and gestures
- Consistent spacing and typography across all screen sizes
- Loading states and error handling with offline support
- Accessible components (ARIA labels, keyboard navigation, screen readers)
- Performance optimization for mobile devices
- Offline-first design patterns

## Success Metrics

### Technical Metrics

- Content processing success rate > 95%
- Search response time < 500ms (online), < 200ms (cached/offline)
- Tree visualization load time < 2s (initial), < 1s (cached)
- API uptime > 99.5%
- PWA Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
- Time to interactive < 3s on mobile devices
- Offline functionality success rate > 98%

### User Experience Metrics

- Average session duration
- Knowledge items added per session
- Search usage frequency
- Tree interaction patterns

## Future Enhancements

### Phase 7+ (Future)

- [ ] Native mobile app development (React Native/Expo)
- [ ] Collaborative knowledge trees with real-time sync
- [ ] Integration with note-taking apps (Notion, Obsidian, etc.)
- [ ] Advanced AI features (chat with your knowledge)
- [ ] Browser extension for quick capture
- [ ] Spaced repetition for knowledge review
- [ ] Knowledge graph visualization with enhanced mobile interactions
- [ ] Multi-language support with offline translation
- [ ] Advanced PWA features (Web Share API, File System Access API)
- [ ] Consider D3.js for tree visualization for advanced features
