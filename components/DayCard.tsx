// components/DayCard.tsx
import { View, Pressable, Text } from "react-native";
import { Link } from "expo-router";

type DayCardProps = {
  day: string;
};

export default function DayCard({ day }: DayCardProps) {
  return (
    <Link
      href={{ pathname: "/week/[day]", params: { day } }}
      asChild
    >
      <Pressable android_ripple={{ color: "lightgray" }}>
        <View className="w-60 rounded-full p-4 mb-2 bg-gray-200 items-center justify-center">
          <Text className="text-lg font-bold">{day}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
