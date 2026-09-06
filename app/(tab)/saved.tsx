import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import {
  getSavedItems,
  getFavoriteItems,
  clearAllSaved,
  clearAllFavorites,
  subscribeToStorage,
} from "@/services/storage";
import { WatchlistItem } from "@/interfaces/interfaces";
import { useRouter } from "expo-router";

export default function SavedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites">(
    "watchlist"
  );
  const [items, setItems] = useState<WatchlistItem[]>([]);

  const reload = () => {
    setItems(activeTab === "watchlist" ? getSavedItems() : getFavoriteItems());
  };

  useEffect(() => {
    reload();
    const unsubscribe = subscribeToStorage(() => {
      reload();
    });
    return unsubscribe;
  }, [activeTab]);

  const handleClear = () => {
    Alert.alert(
      `Clear ${activeTab === "watchlist" ? "Watchlist" : "Favorites"}`,
      `Are you sure you want to remove all saved ${activeTab}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            if (activeTab === "watchlist") clearAllSaved();
            else clearAllFavorites();
            setItems([]);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <MovieCard
            id={item.id}
            title={item.title}
            poster_path={item.poster_path}
            vote_average={item.vote_average}
            release_date={item.release_date}
            media_type={item.media_type}
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
            {/* Header */}
            <View className="flex-row items-center justify-between mt-16 mb-5">
              <View>
                <Text className="text-2xl font-black text-white">
                  My Library
                </Text>
                <Text className="text-xs text-light-200 mt-0.5">
                  Saved titles and favorite picks
                </Text>
              </View>

              {items.length > 0 && (
                <TouchableOpacity
                  onPress={handleClear}
                  className="px-3 py-1.5 rounded-lg bg-dark-100 border border-white/10"
                >
                  <Text className="text-[11px] font-bold text-red-400">
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Tab Switcher */}
            <View className="flex-row p-1 rounded-xl bg-dark-100 border border-white/10 mb-6">
              <TouchableOpacity
                onPress={() => setActiveTab("watchlist")}
                activeOpacity={0.7}
                className={`flex-1 py-2 rounded-lg items-center ${
                  activeTab === "watchlist" ? "bg-accent" : ""
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    activeTab === "watchlist" ? "text-white" : "text-light-200"
                  }`}
                >
                  Watchlist ({getSavedItems().length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("favorites")}
                activeOpacity={0.7}
                className={`flex-1 py-2 rounded-lg items-center ${
                  activeTab === "favorites" ? "bg-accent" : ""
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    activeTab === "favorites" ? "text-white" : "text-light-200"
                  }`}
                >
                  Favorites ({getFavoriteItems().length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="mt-16 px-8 items-center">
            <View className="w-16 h-16 rounded-full bg-dark-100 border border-white/10 items-center justify-center mb-4">
              <Image
                source={icons.save}
                className="w-7 h-7"
                tintColor="#ab8bff"
              />
            </View>
            <Text className="text-white font-bold text-base mb-1">
              Your {activeTab === "watchlist" ? "Watchlist" : "Favorites"} is
              Empty
            </Text>
            <Text className="text-light-300 text-xs text-center mb-6 leading-relaxed">
              Tap the bookmark icon on any movie or TV series card to save it
              here.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tab)")}
              className="px-5 py-2.5 rounded-full bg-accent"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-xs">
                Explore Popular Titles
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}