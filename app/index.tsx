import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import "../global.css";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <Text className="text-white text-2xl font-bold">Página Inicial 🚀</Text>

      <Link href="/about" asChild>
        <Pressable className="mt-4 bg-white px-4 py-2 rounded-xl">
          <Text className="text-blue-500 font-semibold">Ir para About</Text>
        </Pressable>
      </Link>
    </View>
  );
}