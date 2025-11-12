import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

type DayCardProps = {
  day: string;
  dayKey: string;
};

export default function DayCard({ day, dayKey }: DayCardProps) {
  return (
    <View className="w-60 rounded-full overflow-hidden mb-2">
      <Link
        href={{ pathname: "/week/[day]", params: { day, dayKey } }}
        asChild
      >
        <TouchableOpacity
          className="w-full p-4 bg-gray-200 items-center justify-center"
        >
          <Text className="text-lg font-bold">{day}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
