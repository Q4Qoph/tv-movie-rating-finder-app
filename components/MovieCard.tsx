import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
import { isItemSaved, toggleSavedItem, subscribeToStorage } from "@/services/storage";

interface MovieCardProps {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv" | "person";
}

const MovieCard = ({
  id,
  title,
  name,
  poster_path,
  vote_average,
  release_date,
  first_air_date,
  media_type = "movie",
}: MovieCardProps) => {
  const displayTitle = title || name || "Untitled";
  const dateStr = release_date || first_air_date || "";
  const year = dateStr ? dateStr.split("-")[0] : "TBA";
  const isTV = media_type === "tv" || (!title && Boolean(name));
  const linkHref = isTV ? `/tv/${id}` : `/movies/${id}`;

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isItemSaved(id));
    const unsubscribe = subscribeToStorage(() => {
      setSaved(isItemSaved(id));
    });
    return unsubscribe;
  }, [id]);

  const handleBookmark = (e: any) => {
    const isAdded = toggleSavedItem({
      id,
      title: displayTitle,
      poster_path,
      vote_average,
      release_date: dateStr,
      media_type: isTV ? "tv" : "movie",
    });
    setSaved(isAdded);
  };

  return (
    <Link href={linkHref as any} asChild>
      <TouchableOpacity className="w-[30%] mb-3 relative" activeOpacity={0.8}>
        <View className="relative w-full h-48 rounded-xl overflow-hidden bg-dark-100">
          <Image
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://placehold.co/500x750/120f2e/a8b5db.png",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Type Badge */}
          <View className="absolute top-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded">
            <Text className="text-[9px] font-bold text-accent uppercase">
              {isTV ? "TV" : "Movie"}
            </Text>
          </View>

          {/* Quick Save Button */}
          <TouchableOpacity
            onPress={handleBookmark}
            className="absolute bottom-1.5 right-1.5 p-1.5 rounded-full bg-black/70"
            activeOpacity={0.7}
          >
            <Image
              source={icons.save}
              className="size-3.5"
              tintColor={saved ? "#ab8bff" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        <Text className="text-xs font-bold text-white mt-1.5" numberOfLines={1}>
          {displayTitle}
        </Text>

        <View className="flex-row items-center justify-between mt-0.5">
          <View className="flex-row items-center gap-x-1">
            <Image source={icons.star} className="size-3" />
            <Text className="text-[11px] text-amber-400 font-bold">
              {vote_average ? vote_average.toFixed(1) : "NR"}
            </Text>
          </View>
          <Text className="text-[10px] text-light-300">{year}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;