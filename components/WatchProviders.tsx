import React from "react";
import { View, Text, Image } from "react-native";
import { WatchProviderCountry } from "@/interfaces/interfaces";

interface WatchProvidersProps {
  providers?: Record<string, WatchProviderCountry>;
  defaultCountry?: string;
}

export default function WatchProviders({
  providers,
  defaultCountry = "US",
}: WatchProvidersProps) {
  if (!providers) return null;

  const countryData = providers[defaultCountry] || Object.values(providers)[0];
  if (!countryData) return null;

  const streamProviders = countryData.flatrate || [];
  const rentProviders = countryData.rent || [];
  const buyProviders = countryData.buy || [];

  const hasAny =
    streamProviders.length > 0 ||
    rentProviders.length > 0 ||
    buyProviders.length > 0;
  if (!hasAny) return null;

  return (
    <View className="mt-6 p-4 rounded-xl bg-dark-100/90 border border-white/10">
      <Text className="text-light-100 font-bold text-xs uppercase tracking-wider mb-3">
        Where to Watch (JustWatch)
      </Text>

      {/* Stream */}
      {streamProviders.length > 0 && (
        <View className="mb-3">
          <Text className="text-light-200 text-xs mb-2">Stream</Text>
          <View className="flex-row flex-wrap gap-2">
            {streamProviders.map((p) => (
              <Image
                key={p.provider_id}
                source={{
                  uri: `https://image.tmdb.org/t/p/w92${p.logo_path}`,
                }}
                className="w-10 h-10 rounded-lg border border-white/10"
              />
            ))}
          </View>
        </View>
      )}

      {/* Rent / Buy */}
      {(rentProviders.length > 0 || buyProviders.length > 0) && (
        <View>
          <Text className="text-light-200 text-xs mb-2">Rent or Buy</Text>
          <View className="flex-row flex-wrap gap-2">
            {[...rentProviders, ...buyProviders]
              .filter(
                (v, i, a) =>
                  a.findIndex((t) => t.provider_id === v.provider_id) === i
              )
              .map((p) => (
                <Image
                  key={p.provider_id}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w92${p.logo_path}`,
                  }}
                  className="w-10 h-10 rounded-lg border border-white/10"
                />
              ))}
          </View>
        </View>
      )}
    </View>
  );
}
