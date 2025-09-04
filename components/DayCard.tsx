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
        <View className="border-4 border-black rounded-lg p-4 mb-2">
          <Text>{day}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
