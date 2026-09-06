# TV & Movie Finder: Mobile App Upgrade & Parity Roadmap

**Project Name:** TV & Movie Rating Finder App (Mobile)  
**Technology Stack:** React Native 0.79, Expo SDK 53 (Expo Router v5), NativeWind v4 (Tailwind CSS), TypeScript, Appwrite  
**Target OS:** iOS & Android  
**Date:** September 2026  

---

## 1. Executive Summary & Goals

The mobile application (**`tv-movie-rating-finder-app`**) is an Expo-based companion to the **`movie-web`** platform. While the mobile app currently has foundational routing, basic TMDB querying, and Appwrite search counting, it requires major upgrades to achieve feature parity with the modernized web application.

### Key Objectives:
1. **Feature Parity with Web:** Implement video trailer playback, TV series catalog/episodes, Cast & Crew carousels, and "Where to Watch" (JustWatch) provider badges.
2. **Interactive UI/UX Enhancements:** Add genre pill selectors, sorting controls, sticky headers, and smooth bottom sheets.
3. **Complete Saved / Watchlist Tab:** Replace the placeholder in `app/(tab)/saved.tsx` with full offline-first storage and Appwrite cloud synchronization.
4. **Complete Profile Tab:** Build a real user profile screen with auth state, theme preferences, and sync status.

---

## 2. Technical Architecture & Component Hierarchy

```mermaid
graph TD
    subgraph MobileApp [Expo Router Architecture]
        Tabs[Tab Navigator: app/(tab)/_layout.tsx]
        HomeTab[Home Tab: index.tsx]
        SearchTab[Search Tab: search.tsx]
        SavedTab[Saved Tab: saved.tsx]
        ProfileTab[Profile Tab: profile.tsx]
        
        DetailsScreen[Movie/TV Details: app/movies/[id].tsx]
        TVDetailsScreen[TV Series Details: app/tv/[id].tsx]
    end

    subgraph CoreComponents [Reusable UI Layer]
        MovieCard[MovieCard.tsx]
        TrendingCard[TrendingCard.tsx]
        GenreFilter[GenreFilter.tsx]
        CastCarousel[CastCarousel.tsx]
        WatchProviders[WatchProviders.tsx]
        TrailerModal[TrailerModal / WebView]
    end

    subgraph ServiceLayer [Data & Synchronization]
        APIService[services/api.ts]
        AppwriteService[services/appwrite.ts]
        StorageService[services/storage.ts]
    end

    Tabs --> HomeTab
    Tabs --> SearchTab
    Tabs --> SavedTab
    Tabs --> ProfileTab

    HomeTab --> MovieCard
    HomeTab --> TrendingCard
    HomeTab --> GenreFilter

    SearchTab --> MovieCard
    SavedTab --> MovieCard

    HomeTab --> DetailsScreen
    SearchTab --> DetailsScreen

    DetailsScreen --> TrailerModal
    DetailsScreen --> CastCarousel
    DetailsScreen --> WatchProviders

    DetailsScreen --> APIService
    SavedTab --> AppwriteService
    SavedTab --> StorageService
```

---

## 3. Phased Upgrade Plan

### Phase 1: API & Data Model Expansion
* **Update Interfaces (`interfaces/interfaces.d.ts`):**
  * Expand `Movie`, `MovieDetails`, `TVShow`, `TVDetails`, `CastMember`, `VideoItem`, `WatchProviderCountry`, and `WatchlistItem` to match the web app schemas.
* **Upgrade API Service (`services/api.ts`):**
  * Support `append_to_response=videos,credits,similar,recommendations,watch/providers,release_dates` on `/movie/{id}`.
  * Add TV endpoints: `/discover/tv`, `/tv/{id}`, `/search/tv`.
  * Add `/trending/{media_type}/{time_window}` support.
  * Add `/genre/movie/list` and `/genre/tv/list` fetchers.

---

### Phase 2: Rich Media & Details Screen Upgrade (`app/movies/[id].tsx`)
* **YouTube Trailer Playback:**
  * Leverage `react-native-webview` (already installed) or `react-native-youtube-iframe` to create a smooth, modal video player.
  * Add a floating / header "Watch Trailer" button with play icon.
* **Top Cast & Character Avatars:**
  * Horizontal `FlatList` displaying actor profile photos, character names, and actor names.
* **"Where to Watch" Streaming Badges:**
  * Fetch TMDB `watch/providers` and render streaming service icons (Netflix, Disney+, Prime, Apple TV).
* **Recommendations Ribbon:**
  * Add a "More Like This" horizontal carousel at the bottom of the details screen.

---

### Phase 3: TV Shows & Series Integration
* **New Routes:**
  * `app/tv/[id].tsx`: Dedicated TV series screen displaying number of seasons, episodes count, air dates, and season breakdown accordion.
  * Update `MovieCard` to support both `movie` and `tv` navigation routes.
* **Multi-Search in `app/(tab)/search.tsx`:**
  * Add filter chips for `All`, `Movies`, and `TV Shows`.
  * Display entity type badges on search results.

---

### Phase 4: Saved / Watchlist Implementation (`app/(tab)/saved.tsx`)
* **Local Persistence (AsyncStorage / MMKV):**
  * Instant bookmarking even when offline.
* **Cloud Sync via Appwrite:**
  * Connect bookmarks to Appwrite Database collection `watchlists`.
  * Dual tabs: *Watchlist* and *Favorites*.
  * Swipe-to-delete or remove button on each saved item.

---

### Phase 5: Profile Tab & Customization (`app/(tab)/profile.tsx`)
* **User Authentication:**
  * Integrate Appwrite Auth (Email/Password or OAuth) to manage cross-platform accounts.
* **Preferences:**
  * Default streaming country selector (for JustWatch provider filtering).
  * Clear cache & storage button.
  * App version and TMDB attribution card.

---

## 4. Dependencies & Recommended Packages

| Package | Purpose | Installation |
| :--- | :--- | :--- |
| `react-native-youtube-iframe` | Native YouTube player component for React Native | `npx expo install react-native-youtube-iframe` |
| `@react-native-async-storage/async-storage` | Offline key-value storage for local watchlist | `npx expo install @react-native-async-storage/async-storage` |
| `lucide-react-native` | High-quality SVG icons for modern mobile UI | `npx expo install lucide-react-native react-native-svg` |
| `expo-haptics` | Subtle tactile vibration feedback on button taps (already in package.json) | Built-in |
