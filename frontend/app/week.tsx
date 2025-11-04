import { apiFetch } from "@/services/api";
import DayCard from "@/components/DayCard";
import { TaskCardProps } from "@/components/TaskCard";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useAuthStore } from "@/store/auth";
import Toast from "react-native-toast-message";

export default function Week() {

    const navigation = useNavigation();
    const params = useLocalSearchParams<{
        routine_id?: string;
    }>();
    const { accessToken } = useAuthStore();

    useEffect(() => {
        async function fetchTasks() {
            if (!params.routine_id) return;
            
            try {
                const data: TaskCardProps[] = await apiFetch({
                    path: `/workouts/${params.routine_id}`,
                    method: "GET",
                    token: accessToken
                });
                setTasks(data);
            } catch (e: any) {
                Toast.show({
                type: 'error',
                text1: 'Workout not found',
                text2: e.message || 'Try again later',
                });
            }
        }

        fetchTasks();

        navigation.setOptions({
            title: "Weekly plans",
            headerStyle: { backgroundColor: "#f0f0f0" },
            headerTintColor: "#333",
            headerTitleAlign: "center"
        });

    }, [accessToken, navigation, params.routine_id]);


    const [tasks, setTasks] = useState<TaskCardProps[]>([]);

    type Day = {
        name: string,
        id: number
    }

    const days: Day[] = [
        { name: "Sunday", id: 0 },
        { name: "Monday", id: 1 },
        { name: "Tuesday", id: 2 },
        { name: "Wednesday", id: 3 },
        { name: "Thursday", id: 4 },
        { name: "Friday", id: 5 },
        { name: "Saturday", id: 6 },
    ];

    function filterTaskPerDay(day: Day) {
        const filteredTasks = tasks.filter(task => {
            const dayItem = new Date(task.date);
            return dayItem.getDay() === day.id;
        });

        return (
            <DayCard key={day.id} day={day.name} tasks={filteredTasks} />
        );
    }

    return (
        <View className="flex-1 items-center justify-center bg-gray-150 mt-5">
            <Toast />
            <View className="w-100 h-50 items-center justify-center bg-white border-1 border-black p-10 rounded-2xl">
                <Text className="text-2xl font-bold">Routine</Text>
                <Text className="text-base text-gray-500">What was planned for you</Text>

                <ScrollView className="flex-1 bg-white p-4">
                    {days.map((day, index) => filterTaskPerDay(day))}
                </ScrollView>
            </View>
        </View>
    );
}