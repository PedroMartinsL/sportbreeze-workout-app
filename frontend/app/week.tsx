import { apiFetch } from "@/services/api";
import DayCard from "@/components/DayCard";
import { TaskCardProps } from "@/components/TaskCard";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useAuthStore } from "@/store/auth";
import Toast from "react-native-toast-message";
import { useWorkoutStore } from "@/store/workout";

export type Day = {
    key: string
    day: string,
}

export default function Week() {

    const navigation = useNavigation();
    const params = useLocalSearchParams<{
        routine_id?: string;
    }>();
    const { accessToken } = useAuthStore();
    const { loadTasks } = useWorkoutStore();

    useEffect(() => {
        async function fetchTasks() {
            if (!params.routine_id || !accessToken) return;
            loadTasks(params.routine_id, accessToken)
        }

        fetchTasks();

        navigation.setOptions({
            title: "Weekly plans",
            headerStyle: { backgroundColor: "#f0f0f0" },
            headerTintColor: "#333",
            headerTitleAlign: "center"
        });

    }, [accessToken, navigation, params.routine_id]);

    const days: Day[] = [
        { day: "Sunday", key: "0" },
        { day: "Monday", key: "1" },
        { day: "Tuesday", key: "2" },
        { day: "Wednesday", key: "3" },
        { day: "Thursday", key: "4" },
        { day: "Friday", key: "5" },
        { day: "Saturday", key: "6" },
    ];

    function taskPerDay(day: Day) {
        return (
            <DayCard key={day.key} day={day.day} dayKey={day.key} />
        );
    }

    return (
        <View className="flex-1 items-center justify-center bg-gray-150 mt-5">
            <Toast />
            <View className="w-100 h-50 items-center justify-center bg-white border-1 border-black p-10 rounded-2xl">
                <Text className="text-2xl font-bold">Routine</Text>
                <Text className="text-base text-gray-500">What was planned for you</Text>

                <ScrollView className="flex-1 bg-white p-4">
                    {days.map((day, index) => taskPerDay(day))}
                </ScrollView>
            </View>
        </View>
    );
}