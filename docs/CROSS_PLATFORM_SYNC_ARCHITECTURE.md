# Cross-Platform Synchronization Architecture: Movie-Web & Mobile App

**Document:** Universal Sync Architecture & Unified Data Strategy  
**Platforms:** Web (`movie-web` / Next.js 15) & Mobile (`tv-movie-rating-finder-app` / React Native & Expo)  
**Backend & Database:** Appwrite / Supabase + Next.js Edge API Proxy  
**Date:** September 2026  

---

## 1. Universal System Architecture

To ensure a seamless user experience across devices (desktop, tablet, iOS, and Android), both clients are connected through a unified data and synchronization tier.

```mermaid
graph TD
    subgraph WebClient [Movie-Web / Next.js 15]
        WebUI[React 19 UI & Pages]
        WebStore[Zustand / LocalStorage Cache]
        WebAPIProxy[Next.js Serverless API Handlers]
    end

    subgraph MobileClient [TV-Movie-Finder / Expo]
        MobileUI[React Native & NativeWind Screens]
        MobileStore[AsyncStorage / MMKV Offline Cache]
        MobileService[Mobile API Client]
    end

    subgraph CloudSync [Shared Backend & Synchronization Layer]
        AppwriteAuth[Appwrite / Supabase Auth (Unified User ID)]
        AppwriteDB[(Appwrite Database / PostgreSQL)]
        RealtimeSync[Realtime WebSocket Engine]
    end

    subgraph ExternalSources [External Upstream Data]
        TMDB[(The Movie Database API)]
        YouTube[(YouTube Trailers)]
        JustWatch[(Watch Providers CDN)]
    end

    %% Web connections
    WebUI --> WebStore
    WebUI --> WebAPIProxy
    WebAPIProxy --> TMDB
    WebStore <--> RealtimeSync
    WebAPIProxy <--> AppwriteDB

    %% Mobile connections
    MobileUI --> MobileStore
    MobileUI --> MobileService
    MobileService --> WebAPIProxy
    MobileStore <--> RealtimeSync
    MobileService <--> AppwriteDB

    %% Realtime sync connections
    RealtimeSync <--> AppwriteDB
    AppwriteAuth --> AppwriteDB
```

---

## 2. Unified Database Schema (Appwrite / Supabase)

To enable bi-directional synchronization, both Web and Mobile share identical collection schemas:

### 2.1 Collection: `watchlists`
Stores titles that users have saved for later or marked as watched.

| Field Name | Type | Constraints / Format | Description |
| :--- | :--- | :--- | :--- |
| `$id` | String | Unique ID | Document primary key |
| `user_id` | String | Index, Required | User ID from Auth provider |
| `media_id` | Integer | Required | TMDB Movie or TV Show ID |
| `media_type` | String | Enum: `"movie"` \| `"tv"` | Distinguishes between film and series |
| `title` | String | Required | Display title or show name |
| `poster_path`| String | Nullable | TMDB poster image URI segment |
| `vote_average`| Float | 0.0 – 10.0 | TMDB rating score |
| `release_date`| String | Nullable (YYYY-MM-DD) | Release or air date |
| `status` | String | Enum: `"plan_to_watch"` \| `"watching"` \| `"completed"` | User viewing status |
| `created_at` | Integer / ISO | Timestamp | Timestamp when added |

---

### 2.2 Collection: `favorites`
Stores titles marked with a heart / favorite toggle.

| Field Name | Type | Constraints / Format | Description |
| :--- | :--- | :--- | :--- |
| `$id` | String | Unique ID | Document primary key |
| `user_id` | String | Index, Required | User ID from Auth provider |
| `media_id` | Integer | Required | TMDB Movie or TV Show ID |
| `media_type` | String | Enum: `"movie"` \| `"tv"` | Distinguishes between film and series |
| `title` | String | Required | Display title or show name |
| `poster_path`| String | Nullable | TMDB poster image URI segment |
| `rating` | Float | 0.0 – 10.0 | User personal rating (optional) |
| `created_at` | Integer / ISO | Timestamp | Timestamp when favorited |

---

### 2.3 Collection: `trending_searches`
Tracks global search query velocity to power the "Trending Searches" algorithms on both platforms.

| Field Name | Type | Constraints / Format | Description |
| :--- | :--- | :--- | :--- |
| `$id` | String | Unique ID | Document primary key |
| `searchTerm` | String | Index, Required | Query term entered by users |
| `movie_id` | Integer | Required | TMDB ID of the top match |
| `title` | String | Required | Title of the matched movie |
| `poster_url` | String | Full URL | Poster image link |
| `count` | Integer | Default: 1 | Accumulated search count |
| `updated_at` | Integer / ISO | Timestamp | Last query timestamp |

---

## 3. Synchronization Strategies

### Strategy A: Next.js API Routes as the Unified Mobile Backend
Instead of embedding the TMDB API key in the mobile binary (`EXPO_PUBLIC_MOVIE_API_KEY`), configure the mobile app to call your deployed Next.js backend (`https://your-vercel-domain.vercel.app/api/*`).

**Benefits:**
1. **Security:** TMDB API key is never exposed to decompilation or client reverse engineering.
2. **Shared Caching:** Vercel Edge Cache reduces repeated TMDB hits across both web and mobile users.
3. **Single Point of Evolution:** Adding new TMDB endpoints automatically benefits both clients.

```ts
// mobile: services/api.ts
const BACKEND_BASE = "https://your-movie-web.vercel.app/api";

export const fetchMovies = async (params: { query?: string; genre?: string }) => {
  const queryParams = new URLSearchParams(params as any);
  const res = await fetch(`${BACKEND_BASE}/movies?${queryParams.toString()}`);
  return res.json();
};
```

---

### Strategy B: Offline-First Optimistic Sync with Cloud Reconciliation
Users expect instant feedback on mobile and web when tapping "Bookmark" or "Favorite", even in poor network conditions.

1. **Optimistic Local Update:** Write immediately to local state (`localStorage` on Web, `AsyncStorage` / `MMKV` on Mobile) and update the UI instantly.
2. **Background Queue:** Dispatch an asynchronous write to Appwrite / Supabase.
3. **Realtime Subscriptions:** Listen to database changes via WebSocket:
   ```ts
   // Web & Mobile shared subscription
   client.subscribe(`databases.${DATABASE_ID}.collections.watchlists.documents`, (response) => {
     if (response.events.includes("databases.*.documents.create")) {
       syncLocalWatchlist(response.payload);
     }
   });
   ```
4. **Multi-Tab & Multi-Device Sync:** When a movie is added on Mobile, the Web client receives the WebSocket event and updates the UI without a manual refresh.

---

## 4. Step-by-Step Implementation Roadmap to Unify Both Apps

### Step 1: Configure Shared Appwrite / Supabase Credentials
Add identical environment variables to both projects:
```env
# .env.local (Web) & .env (Mobile)
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_search_collection_id
EXPO_PUBLIC_APPWRITE_WATCHLIST_COLLECTION_ID=your_watchlist_collection_id
EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID=your_favorites_collection_id
```

### Step 2: Implement Shared Watchlist & Favorites Services in Web
Create `services/appwrite.ts` in the web application mirroring the mobile data calls.

### Step 3: Implement Authentication (Email / OAuth)
1. Add an Auth Modal / Login Form on Web.
2. Add a Login / Profile Screen in `app/(tab)/profile.tsx` on Mobile.
3. Authenticate against the same Appwrite project to bind user watchlists to a unique `user_id`.

### Step 4: Share TypeScript Types
Export shared interfaces (`interfaces/interfaces.d.ts`) to ensure strict contract consistency across both repositories.
