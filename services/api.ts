import {
  Movie,
  MovieDetails,
  TVShow,
  TVDetails,
  Genre,
} from "@/interfaces/interfaces";

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export interface FetchMediaParams {
  query?: string;
  genre?: string;
  sortBy?: string;
  year?: string;
  page?: number;
}

export const fetchMovies = async (params: FetchMediaParams = {}): Promise<Movie[]> => {
  const { query, genre, sortBy = "popularity.desc", year, page = 1 } = params;
  let endpoint = "";

  if (query && query.trim()) {
    endpoint = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&page=${page}&include_adult=false`;
  } else {
    const urlParams = new URLSearchParams({
      sort_by: sortBy,
      page: page.toString(),
      include_adult: "false",
    });
    if (genre) urlParams.append("with_genres", genre);
    if (year) urlParams.append("primary_release_year", year);

    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?${urlParams.toString()}`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results || [];
};

export const fetchMoviesDetails = async (
  movieId: string | number
): Promise<MovieDetails> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?append_to_response=videos,credits,similar,recommendations,watch/providers,release_dates`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.statusText}`);
  }

  return response.json();
};

export const fetchTVShows = async (params: FetchMediaParams = {}): Promise<TVShow[]> => {
  const { query, genre, sortBy = "popularity.desc", page = 1 } = params;
  let endpoint = "";

  if (query && query.trim()) {
    endpoint = `${TMDB_CONFIG.BASE_URL}/search/tv?query=${encodeURIComponent(
      query
    )}&page=${page}&include_adult=false`;
  } else {
    const urlParams = new URLSearchParams({
      sort_by: sortBy,
      page: page.toString(),
      include_adult: "false",
    });
    if (genre) urlParams.append("with_genres", genre);

    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/tv?${urlParams.toString()}`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results || [];
};

export const fetchTVDetails = async (tvId: string | number): Promise<TVDetails> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${tvId}?append_to_response=videos,credits,similar,recommendations,watch/providers`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TV details: ${response.statusText}`);
  }

  return response.json();
};

export const fetchTrending = async (
  type: "all" | "movie" | "tv" = "all",
  time: "day" | "week" = "day"
): Promise<Movie[]> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/trending/${type}/${time}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending media: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results || [];
};

export const fetchGenres = async (type: "movie" | "tv" = "movie"): Promise<Genre[]> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/genre/${type}/list`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.statusText}`);
  }
  const data = await response.json();
  return data.genres || [];
};

export const searchMulti = async (
  query: string,
  type: "multi" | "movie" | "tv" = "multi",
  page: number = 1
) => {
  if (!query.trim()) return { results: [], total_results: 0 };
  const endpoint = `${TMDB_CONFIG.BASE_URL}/search/${type}?query=${encodeURIComponent(
    query
  )}&page=${page}&include_adult=false`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to search TMDB: ${response.statusText}`);
  }

  return response.json();
};