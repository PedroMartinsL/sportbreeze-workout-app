// components/DayCard.tsx
import { View, Text, Pressable } from "react-native";
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
        <View className="border-4 border-black rounded-lg p-4 mb-2">
          <Text className="text-lg font-bold">{day}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
