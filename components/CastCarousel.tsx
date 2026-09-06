import React from "react";
import { View, Text, FlatList, Image } from "react-native";
import { CastMember } from "@/interfaces/interfaces";
import { icons } from "@/constants/icons";

interface CastCarouselProps {
  cast: CastMember[];
}

export default function CastCarousel({ cast }: CastCarouselProps) {
  if (!cast || cast.length === 0) return null;

  const topCast = cast.slice(0, 15);

  return (
    <View className="mt-8">
      <Text className="text-white font-bold text-base mb-3">Top Cast</Text>
      <FlatList
        data={topCast}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-3" />}
        keyExtractor={(item) => item.id.toString() + item.character}
        renderItem={({ item }) => (
          <View className="w-24 items-center">
            {item.profile_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w185${item.profile_path}`,
                }}
                className="w-20 h-20 rounded-full bg-dark-100 border border-white/10"
                resizeMode="cover"
              />
            ) : (
              <View className="w-20 h-20 rounded-full bg-dark-100 border border-white/10 items-center justify-center">
                <Image
                  source={icons.person}
                  className="w-8 h-8 opacity-40"
                  tintColor="#fff"
                />
              </View>
            )}
            <Text
              className="text-white text-xs font-semibold mt-2 text-center"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              className="text-light-200 text-[10px] text-center"
              numberOfLines={1}
            >
              {item.character || "Cast"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
