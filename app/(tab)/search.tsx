import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { searchMulti } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import { Movie } from "@/interfaces/interfaces";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState<"multi" | "movie" | "tv">("multi");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchMulti(searchQuery, mediaType);
        const filtered = (data.results || []).filter(
          (item: any) =>
            item.media_type !== "person" &&
            (item.poster_path || item.backdrop_path)
        );
        setResults(filtered);

        // Update Appwrite Search metrics if a result is returned
        if (filtered.length > 0) {
          updateSearchCount(searchQuery, filtered[0]).catch(() => {});
        }
      } catch (err: any) {
        setError(err.message || "Failed to search titles");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, mediaType]);

  const quickSearches = [
    "Avengers",
    "Inception",
    "Stranger Things",
    "Breaking Bad",
    "Spider-Man",
    "Interstellar",
  ];

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={results}
        renderItem={({ item }) => (
          <MovieCard
            id={item.id}
            title={item.title}
            name={item.name}
            poster_path={item.poster_path}
            vote_average={item.vote_average}
            release_date={item.release_date}
            first_air_date={item.first_air_date}
            media_type={item.media_type || (item.title ? "movie" : "tv")}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <View className="px-5">
            <View className="w-full flex-row justify-center mt-16 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-4">
              <SearchBar
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {/* Media Type Filter Tabs */}
            <View className="flex-row justify-center gap-2 mb-4">
              {(["multi", "movie", "tv"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setMediaType(type)}
                  activeOpacity={0.7}
                  className={`px-4 py-1.5 rounded-full ${
                    mediaType === type
                      ? "bg-accent"
                      : "bg-dark-100 border border-white/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold uppercase ${
                      mediaType === type ? "text-white" : "text-light-200"
                    }`}
                  >
                    {type === "multi" ? "All" : type === "movie" ? "Movies" : "TV"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#ab8bff"
                className="my-6 self-center"
              />
            )}

            {error && (
              <Text className="text-red-400 text-center text-xs my-3">
                {error}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() && results.length > 0 && (
              <Text className="text-sm text-light-200 font-bold mb-4">
                Results for <Text className="text-accent">"{searchQuery}"</Text>
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-8 px-5 items-center">
              {searchQuery.trim() ? (
                <Text className="text-center text-light-300 text-xs">
                  No matches found for "{searchQuery}".
                </Text>
              ) : (
                <View className="items-center">
                  <Text className="text-center text-light-300 text-xs mb-4">
                    Explore popular searches:
                  </Text>
                  <View className="flex-row flex-wrap justify-center gap-2">
                    {quickSearches.map((term) => (
                      <TouchableOpacity
                        key={term}
                        onPress={() => setSearchQuery(term)}
                        activeOpacity={0.7}
                        className="px-3.5 py-1.5 rounded-full bg-dark-100 border border-white/10"
                      >
                        <Text className="text-xs text-light-200 font-medium">
                          {term}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ) : null
        }
      />
    </View>
  );
}