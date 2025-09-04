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
        <View className="flex-1 items-center justify-center bg-white border border-black p-4 border-rounded">
            <Text className="text-2xl font-bold">Routine</Text>
            <Text className="text-2xl font-bold">What was planned for you</Text>
            <ScrollView className="flex-1 bg-white p-4">
                {days.map((day, index) => (
                    <DayCard key={day} day={day} />
                ))}
            </ScrollView>
        </View>
    );
}