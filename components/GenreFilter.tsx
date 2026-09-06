import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Genre } from "@/interfaces/interfaces";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string | null;
  onSelectGenre: (genreId: string | null) => void;
}

export default function GenreFilter({
  genres,
  selectedGenre,
  onSelectGenre,
}: GenreFilterProps) {
  if (!genres || genres.length === 0) return null;

  const allItem = { id: 0, name: "All Genres" };
  const items = [allItem, ...genres];

  return (
    <View className="my-3">
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-2" />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected =
            item.id === 0
              ? selectedGenre === null
              : selectedGenre === item.id.toString();

          return (
            <TouchableOpacity
              onPress={() =>
                onSelectGenre(item.id === 0 ? null : isSelected ? null : item.id.toString())
              }
              activeOpacity={0.7}
              className={`px-4 py-1.5 rounded-full ${
                isSelected
                  ? "bg-accent"
                  : "bg-dark-100 border border-white/10"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? "text-white" : "text-light-200"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
