import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchTVDetails } from "@/services/api";
import { icons } from "@/constants/icons";
import { isItemSaved, toggleSavedItem, subscribeToStorage } from "@/services/storage";
import CastCarousel from "@/components/CastCarousel";
import WatchProviders from "@/components/WatchProviders";
import TrailerModal from "@/components/TrailerModal";
import MovieCard from "@/components/MovieCard";

interface TVInfoProps {
  label: string;
  value?: string | number | null;
}

const TVInfo = ({ label, value }: TVInfoProps) => (
  <View className="flex-col items-start justify-center mt-4">
    <Text className="text-light-300 font-medium text-xs">{label}</Text>
    <Text className="text-white font-semibold text-sm mt-1">
      {value || "N/A"}
    </Text>
  </View>
);

export default function TVDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { data: tv, loading, error } = useFetch(() =>
    fetchTVDetails(id as string)
  );

  const [saved, setSaved] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    if (tv?.id) {
      setSaved(isItemSaved(tv.id));
      const unsubscribe = subscribeToStorage(() => {
        setSaved(isItemSaved(tv.id));
      });
      return unsubscribe;
    }
  }, [tv?.id]);

  const handleToggleBookmark = () => {
    if (!tv) return;
    const isAdded = toggleSavedItem({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      vote_average: tv.vote_average,
      release_date: tv.first_air_date,
      media_type: "tv",
    });
    setSaved(isAdded);
  };

  const handleShare = async () => {
    if (tv) {
      try {
        await Share.share({
          message: `Check out ${tv.name} on Movie Web! Rating: ${tv.vote_average.toFixed(
            1
          )}/10`,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (loading) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#ab8bff" />
        <Text className="text-light-200 text-xs mt-3">Loading series details...</Text>
      </View>
    );
  }

  if (error || !tv) {
    return (
      <View className="bg-primary flex-1 items-center justify-center px-5">
        <Text className="text-red-400 font-bold mb-2">Error</Text>
        <Text className="text-light-200 text-xs text-center mb-6">
          {error?.message || "Failed to load TV series details."}
        </Text>
        <TouchableOpacity
          onPress={router.back}
          className="px-5 py-2.5 rounded-full bg-accent"
        >
          <Text className="text-white font-bold text-xs">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const trailer =
    tv.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || tv.videos?.results?.[0];

  const firstYear = tv.first_air_date ? tv.first_air_date.split("-")[0] : "TBA";
  const similarShows = tv.recommendations?.results?.length
    ? tv.recommendations.results
    : tv.similar?.results || [];

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {/* Header Poster */}
        <View className="relative w-full h-[420px] bg-dark-100">
          <Image
            source={{
              uri: tv.poster_path
                ? `https://image.tmdb.org/t/p/w780${tv.poster_path}`
                : "https://placehold.co/780x1170/120f2e/a8b5db.png",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Top Floating Action Buttons */}
          <View className="absolute top-12 left-5 right-5 flex-row items-center justify-between z-20">
            <TouchableOpacity
              onPress={router.back}
              className="p-2.5 rounded-full bg-black/60 border border-white/10"
              activeOpacity={0.7}
            >
              <Image source={icons.arrow} className="size-4 rotate-180" tintColor="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="p-2.5 rounded-full bg-black/60 border border-white/10"
              activeOpacity={0.7}
            >
              <Image source={icons.search} className="size-4" tintColor="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Body */}
        <View className="px-5 mt-5">
          {/* Title & Tagline */}
          <Text className="text-white font-black text-2xl tracking-tight">
            {tv.name}
          </Text>
          {tv.tagline ? (
            <Text className="text-light-200 text-xs italic mt-1">
              "{tv.tagline}"
            </Text>
          ) : null}

          {/* Metrics */}
          <View className="flex-row flex-wrap items-center gap-2.5 mt-3">
            <View className="flex-row items-center bg-black/60 px-2.5 py-1 rounded-md border border-amber-500/20 gap-x-1">
              <Image source={icons.star} className="size-3.5" />
              <Text className="text-amber-400 font-bold text-xs">
                {tv.vote_average ? tv.vote_average.toFixed(1) : "NR"}
              </Text>
              <Text className="text-light-300 text-[10px]">
                ({tv.vote_count})
              </Text>
            </View>

            <View className="bg-dark-100 px-2.5 py-1 rounded-md border border-white/10">
              <Text className="text-light-200 text-xs font-semibold">{firstYear}</Text>
            </View>

            {tv.number_of_seasons ? (
              <View className="bg-dark-100 px-2.5 py-1 rounded-md border border-white/10">
                <Text className="text-light-200 text-xs font-semibold">
                  {tv.number_of_seasons} Season{tv.number_of_seasons > 1 ? "s" : ""}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Action CTAs */}
          <View className="flex-row gap-3 mt-5">
            {trailer && (
              <TouchableOpacity
                onPress={() => setTrailerOpen(true)}
                activeOpacity={0.8}
                className="flex-1 py-3.5 px-4 rounded-xl bg-accent flex-row items-center justify-center gap-x-2"
              >
                <Image source={icons.play} className="size-4" tintColor="#fff" />
                <Text className="text-white font-bold text-sm">Watch Trailer</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleToggleBookmark}
              activeOpacity={0.8}
              className={`p-3.5 rounded-xl border items-center justify-center ${
                saved
                  ? "bg-accent/20 border-accent"
                  : "bg-dark-100 border-white/10"
              }`}
            >
              <Image
                source={icons.save}
                className="size-5"
                tintColor={saved ? "#ab8bff" : "#fff"}
              />
            </TouchableOpacity>
          </View>

          {/* Overview */}
          <TVInfo label="Overview" value={tv.overview} />

          {/* Genres */}
          <TVInfo
            label="Genres"
            value={tv.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          {/* Seasons */}
          {tv.seasons && tv.seasons.length > 0 && (
            <View className="mt-6">
              <Text className="text-white font-bold text-sm uppercase tracking-wider mb-2">
                Seasons ({tv.seasons.length})
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {tv.seasons.map((s) => (
                  <View
                    key={s.id}
                    className="p-3 rounded-xl bg-dark-100 border border-white/10 flex-1 min-w-[140px]"
                  >
                    <Text className="text-xs font-bold text-white">{s.name}</Text>
                    <Text className="text-[10px] text-light-300 mt-0.5">
                      {s.episode_count} Episodes
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Watch Providers */}
          <WatchProviders providers={tv["watch/providers"]?.results} />

          {/* Cast */}
          {tv.credits?.cast && <CastCarousel cast={tv.credits.cast} />}

          {/* Similar Shows */}
          {similarShows.length > 0 && (
            <View className="mt-8">
              <Text className="text-white font-bold text-base mb-3">
                More Like This
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {similarShows.slice(0, 6).map((item) => (
                  <MovieCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    poster_path={item.poster_path}
                    vote_average={item.vote_average}
                    first_air_date={item.first_air_date}
                    media_type="tv"
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Trailer Modal */}
      {trailer && (
        <TrailerModal
          visible={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          videoKey={trailer.key}
          title={tv.name}
        />
      )}
    </View>
  );
}
