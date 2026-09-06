import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import GenreFilter from "@/components/GenreFilter";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies, fetchTrending, fetchGenres } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { Movie, Genre, TrendingMovie } from "@/interfaces/interfaces";

export default function Index() {
  const router = useRouter();

  const [trending, setTrending] = useState<Movie[]>([]);
  const [appwriteTrending, setAppwriteTrending] = useState<TrendingMovie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [tmdbTrending, initialMovies, movieGenres, dbTrending] =
          await Promise.allSettled([
            fetchTrending("all", "day"),
            fetchMovies({ sortBy: "popularity.desc" }),
            fetchGenres("movie"),
            getTrendingMovies(),
          ]);

        if (tmdbTrending.status === "fulfilled") {
          setTrending(tmdbTrending.value);
        }
        if (initialMovies.status === "fulfilled") {
          setMovies(initialMovies.value);
        }
        if (movieGenres.status === "fulfilled") {
          setGenres(movieGenres.value);
        }
        if (
          dbTrending.status === "fulfilled" &&
          dbTrending.value &&
          dbTrending.value.length > 0
        ) {
          setAppwriteTrending(dbTrending.value);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load home feed");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (loading) return;

    async function applyGenreFilter() {
      try {
        setFilterLoading(true);
        const filtered = await fetchMovies({
          genre: selectedGenre || undefined,
          sortBy: "popularity.desc",
        });
        setMovies(filtered);
      } catch (err) {
        console.error("Genre filter error", err);
      } finally {
        setFilterLoading(false);
      }
    }
    applyGenreFilter();
  }, [selectedGenre]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" resizeMode="cover" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 110,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-16 mb-5 mx-auto" />

        <SearchBar
          onPress={() => router.push("/search")}
          placeholder="Search for movies, TV series..."
        />

        {loading ? (
          <ActivityIndicator size="large" color="#ab8bff" className="mt-16 self-center" />
        ) : error ? (
          <View className="mt-10 p-5 rounded-xl bg-dark-100 border border-red-500/20 items-center">
            <Text className="text-red-400 font-bold mb-1">Error Loading Data</Text>
            <Text className="text-light-200 text-xs text-center">{error}</Text>
          </View>
        ) : (
          <>
            {/* Trending Section (TMDB or Appwrite) */}
            {appwriteTrending.length > 0 ? (
              <View className="mt-8">
                <Text className="text-lg text-white font-bold mb-3">
                  🔥 Trending Searches
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-3" />}
                  data={appwriteTrending}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                />
              </View>
            ) : trending.length > 0 ? (
              <View className="mt-8">
                <Text className="text-lg text-white font-bold mb-3">
                  🔥 Trending Today
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-3" />}
                  data={trending.slice(0, 10)}
                  renderItem={({ item, index }) => (
                    <TrendingCard
                      movie={{
                        movie_id: item.id,
                        title: item.title || item.name || "Untitled",
                        count: index + 1,
                        poster_url: item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "https://placehold.co/500x750/120f2e/a8b5db.png",
                        searchTerm: item.title || item.name || "",
                      }}
                      index={index}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            ) : null}

            {/* Genre Filter Pills */}
            <View className="mt-6">
              <Text className="text-lg text-white font-bold mb-1">Explore by Genre</Text>
              <GenreFilter
                genres={genres}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />
            </View>

            {/* Popular Movies Grid */}
            <View className="mt-4">
              <Text className="text-lg text-white font-bold mb-3">Popular Titles</Text>

              {filterLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#ab8bff"
                  className="py-10 self-center"
                />
              ) : movies.length > 0 ? (
                <FlatList
                  data={movies}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <MovieCard
                      id={item.id}
                      title={item.title}
                      name={item.name}
                      poster_path={item.poster_path}
                      vote_average={item.vote_average}
                      release_date={item.release_date}
                      first_air_date={item.first_air_date}
                      media_type={item.media_type || "movie"}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 16,
                  }}
                />
              ) : (
                <Text className="text-center text-light-300 py-10 text-xs">
                  No titles found for this category.
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
