// components/DayCard.tsx
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

type DayCardProps = {
  day: string;
};

export default function DayCard({ day }: DayCardProps) {
  return (
    
  <View className="w-60 rounded-full overflow-hidden mb-2">
    <Link
  href={{ pathname: "/week/[day]", params: { day } }}
  asChild
>
    <Pressable
      android_ripple={{ color: "black" }}
      className="w-full p-4 bg-gray-200 items-center justify-center"
    >
      <Text className="text-lg font-bold">{day}</Text>
    </Pressable>
    </Link>
  </View>
  );
}
