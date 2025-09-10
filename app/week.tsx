import DayCard from "@/components/DayCard";
import { View, Text, ScrollView } from "react-native";

export default function Week() {
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    return (
        <View className="flex-1 items-center justify-center bg-gray-150 mt-5">
            <View className="w-100 h-50 items-center justify-center bg-white border-1 border-black p-10 rounded-2xl">
            <Text className="text-2xl font-bold">Routine</Text>
            <Text className="text-base text-gray-500">What was planned for you</Text>

            <ScrollView className="flex-1 bg-white p-4">
                {days.map((day, index) => (
                <DayCard key={day} day={day} />
                ))}
            </ScrollView>
            </View>
        </View>
    );
}