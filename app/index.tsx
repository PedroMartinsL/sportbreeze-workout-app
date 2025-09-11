import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-[#d9f99d] px-6">

      <View className="flex-row items-center">  // Logo e nome do app 
        <View className="h-0 w-0 rounded-xl bg-white border border-[#c5e1a5] items-center justify-center mr-2"> 
          <Image
            source={require("../assets/images/Sportsbreeze-logo-1.png")}
            style={{ width: 45, height: 45 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-[#0a0a0a] text-3xl font-extrabold">  Sportsbreeze</Text>
      </View>


      <Text className="text-[#475569] text-center mt-2">
        AI-powered training routine based on the next 7 days of local weather.
      </Text>

      <Link href="/registration" asChild>
        <TouchableOpacity className="mt-6 w-full max-w-xs bg-black px-4 py-3 rounded-xl">
          <Text className="text-white text-center font-semibold">Registration Portal</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/about" asChild>
        <TouchableOpacity className="mt-3 w-full max-w-xs bg-white px-4 py-3 rounded-xl border border-[#c5e1a5]">
          <Text className="text-[#0a0a0a] text-center font-semibold">About</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/week" asChild>
        <TouchableOpacity className="mt-3 w-full max-w-xs bg-white px-4 py-3 rounded-xl border border-[#c5e1a5]">
          <Text className="text-[#0a0a0a] text-center font-semibold">Week</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
