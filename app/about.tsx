import { View, Text } from "react-native";
import "../global.css";

export default function About() {
  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <Text className="text-white text-2xl font-bold">Sobre o App 🌱</Text>
    </View>
  );
}