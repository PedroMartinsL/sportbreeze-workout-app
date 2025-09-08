import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-[#d9f99d] px-6">
      <Text className="text-[#0a0a0a] text-3xl font-extrabold">Sportsbrezze</Text>
      <Text className="text-[#475569] text-center mt-2">
        AI-powered training routine based on the next 7 days of local weather.
      </Text>

      <Link href="/registration" asChild>
        <Pressable className="mt-6 w-full max-w-xs bg-black px-4 py-3 rounded-xl">
          <Text className="text-white text-center font-semibold">Registration Portal</Text>
        </Pressable>
      </Link>

      <Link href="/about" asChild>
        <Pressable className="mt-3 w-full max-w-xs bg-white px-4 py-3 rounded-xl border border-[#c5e1a5]">
          <Text className="text-[#0a0a0a] text-center font-semibold">About</Text>
        </Pressable>
      </Link>

      <Link href="/week" asChild>
        <Pressable className="mt-3 w-full max-w-xs bg-white px-4 py-3 rounded-xl border border-[#c5e1a5]">
          <Text className="text-[#0a0a0a] text-center font-semibold">Week</Text>
        </Pressable>
      </Link>
    </View>
  );
}
