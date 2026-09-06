import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { icons } from "@/constants/icons";
import { Image } from "react-native";

interface TrailerModalProps {
  visible: boolean;
  onClose: () => void;
  videoKey: string | null;
  title?: string;
}

export default function TrailerModal({
  visible,
  onClose,
  videoKey,
  title,
}: TrailerModalProps) {
  if (!visible || !videoKey) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black">
        {/* Header Bar */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-white/10 bg-dark-100">
          <Text className="text-white font-bold text-sm flex-1 mr-3 truncate">
            {title ? `${title} - Trailer` : "Official Trailer"}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full bg-white/10"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-xs">Close</Text>
          </TouchableOpacity>
        </View>

        {/* Video Player */}
        <View className="flex-1 bg-black justify-center">
          <WebView
            source={{ uri: embedUrl }}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            className="flex-1"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
