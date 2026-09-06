export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  adult?: boolean;
  backdrop_path: string | null;
  genre_ids?: number[];
  genres?: Genre[];
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string; // for TV
  name?: string; // for TV
  video?: boolean;
  vote_average: number;
  vote_count?: number;
  media_type?: "movie" | "tv" | "person";
}

export interface TVShow {
  id: number;
  name: string;
  original_name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: Genre[];
  origin_country?: string[];
  original_language?: string;
  popularity?: number;
  vote_average: number;
  vote_count?: number;
  media_type?: "tv";
}

export interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

export interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface WatchProviderItem {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviderCountry {
  link?: string;
  flatrate?: WatchProviderItem[];
  rent?: WatchProviderItem[];
  buy?: WatchProviderItem[];
  free?: WatchProviderItem[];
  ads?: WatchProviderItem[];
}

export interface MovieDetails {
  id: number;
  title: string;
  original_title?: string;
  tagline?: string | null;
  overview?: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  runtime?: number | null;
  status?: string;
  budget?: number;
  revenue?: number;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  production_companies?: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  imdb_id?: string | null;
  homepage?: string | null;
  videos?: {
    results: VideoItem[];
  };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  similar?: {
    results: Movie[];
  };
  recommendations?: {
    results: Movie[];
  };
  "watch/providers"?: {
    results: Record<string, WatchProviderCountry>;
  };
}

export interface TVDetails {
  id: number;
  name: string;
  original_name?: string;
  tagline?: string | null;
  overview?: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  last_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  seasons?: {
    id: number;
    name: string;
    overview?: string;
    poster_path?: string | null;
    season_number: number;
    episode_count: number;
    air_date?: string;
  }[];
  videos?: {
    results: VideoItem[];
  };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  similar?: {
    results: TVShow[];
  };
  recommendations?: {
    results: TVShow[];
  };
  "watch/providers"?: {
    results: Record<string, WatchProviderCountry>;
  };
}

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  media_type: "movie" | "tv";
  addedAt: number;
}
