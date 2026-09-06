import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedItems, getFavoriteItems, clearAllSaved, clearAllFavorites } from "@/services/storage";

export default function ProfileScreen() {
  const savedCount = getSavedItems().length;
  const favCount = getFavoriteItems().length;

  const handleReset = () => {
    Alert.alert(
      "Reset App Storage",
      "This will clear all saved bookmarks and favorites from this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset All",
          style: "destructive",
          onPress: () => {
            clearAllSaved();
            clearAllFavorites();
            Alert.alert("Success", "App cache and storage reset successfully.");
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

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View className="mt-16 items-center">
          <View className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-purple-600 p-1 mb-3">
            <View className="w-full h-full rounded-full bg-dark-100 items-center justify-center border-2 border-white/20">
              <Image source={icons.person} className="w-10 h-10" tintColor="#ab8bff" />
            </View>
          </View>

          <Text className="text-xl font-bold text-white">Movie Enthusiast</Text>
          <Text className="text-xs text-light-200 mt-0.5">Free Member</Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mt-6">
          <View className="flex-1 p-4 rounded-2xl bg-dark-100/90 border border-white/10 items-center">
            <Text className="text-2xl font-black text-accent">{savedCount}</Text>
            <Text className="text-[11px] text-light-200 font-semibold mt-1">Watchlist</Text>
          </View>
          <View className="flex-1 p-4 rounded-2xl bg-dark-100/90 border border-white/10 items-center">
            <Text className="text-2xl font-black text-amber-400">{favCount}</Text>
            <Text className="text-[11px] text-light-200 font-semibold mt-1">Favorites</Text>
          </View>
        </View>

        {/* Settings & Info Sections */}
        <View className="mt-8 space-y-3">
          <Text className="text-xs font-bold uppercase tracking-wider text-light-300 mb-2">
            Preferences & Storage
          </Text>

          <View className="p-4 rounded-2xl bg-dark-100/80 border border-white/10 space-y-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-semibold text-white">Streaming Region</Text>
                <Text className="text-xs text-light-300">JustWatch provider region</Text>
              </View>
              <View className="px-3 py-1 rounded-lg bg-dark-200 border border-white/10">
                <Text className="text-xs font-bold text-accent">United States (US)</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleReset}
              className="pt-3 border-t border-white/5 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <Text className="text-sm font-semibold text-red-400">Clear Cache & Storage</Text>
              <Text className="text-xs text-light-300">Reset &rarr;</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Attribution & About */}
        <View className="mt-8 p-5 rounded-2xl bg-dark-100/60 border border-white/5 items-center">
          <Text className="text-xs font-bold text-white mb-1">TV & Movie Rating Finder</Text>
          <Text className="text-[11px] text-light-300 text-center leading-relaxed mb-3">
            Powered by The Movie Database (TMDB) API & JustWatch streaming data.
          </Text>
          <Text className="text-[10px] text-light-300 font-mono">v1.1.0 • React Native 0.79</Text>
        </View>
      </ScrollView>
    </View>
  );
}