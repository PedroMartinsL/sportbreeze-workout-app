import { DetachedData } from "@/components/TaskCard";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { useWorkoutStore } from "@/store/workout";
import { useLocationStore } from "@/store/location";

export default function CreateTask() {
  const navigation = useNavigation();
  const { routine, loadTasks } = useWorkoutStore();
  const { accessToken } = useAuthStore();
  const params = useLocalSearchParams();
  const router = useRouter();
  const { coords } = useLocationStore();

  const [kcalGoal, setKcalGoal] = useState<string>("0");
  const [sport, setSport] = useState<string>("");
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(30);
  const [show, setShow] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [kcalError, setKcalError] = useState(false);
  const [sportError, setSportError] = useState(false);
  const [loading, setLoading] = useState(false); // estado de carregamento

  const sports = [
    "Swimming",
    "Running",
    "Cycling",
    "Hiking",
    "Walking",
    "Gym",
    "Marathon",
  ];

  useEffect(() => {
    navigation.setOptions({
      title: "Schedule",
      headerStyle: { backgroundColor: "#f0f0f0" },
      headerTintColor: "#333",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const durationOptions = Array.from({ length: 12 }, (_, i) => (i + 1) * 30);

  const onChange = (event: any, selectedTime: Date | undefined) => {
    setShow(Platform.OS === "ios");
    if (selectedTime) setTime(selectedTime);
  };

  async function handleWorkoutCreate() {
    setError(null);
    setKcalError(false);
    setSportError(false);

    // Validação simples
    if (!kcalGoal || Number(kcalGoal) <= 0) setKcalError(true);
    if (!sport) setSportError(true);
    if (!kcalGoal || !sport) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true); // ativa spinner

    try {
      const date = new Date(time);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const time_schedule = `${hours}:${minutes}`;

      const payload = {
        kcal: Number(kcalGoal),
        hour: time_schedule,
        date: `Schedule a date to ${params.date}`,
        sport,
        duration,
        location: coords,
        routine_id: routine,
      };
      console.log(payload);

      await apiFetch({
        path: `/workouts/`,
        method: "POST",
        body: payload,
        token: accessToken,
      });

      if (routine && accessToken) {
        loadTasks(`${routine}`, accessToken);
      }

      router.back();
    } catch (e: any) {
      let detail = "";
      try {
        const match = e?.toString().match(/{.*}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          detail = parsed.detail || "";
        } else if (e?.message) {
          detail = e.message;
        }
      } catch {
        detail = e?.toString() || "";
      }
      setError(`Failed creating your workout. ${detail || "Try again later."}`);
    } finally {
      setLoading(false); // desativa spinner
    }
  }

  return (
    <View className="flex-1 w-full py-10 px-5 gap-6 mb-4">
      <ScrollView>
        <View className="mx-4 gap-5">
          <Text className="text-xl font-bold text-gray-500">Planner</Text>
          <View className="border-b border-gray-300 mb-4" />

          {/* Mensagem geral de erro */}
          {error && (
            <View className="flex-row items-center bg-red-100 border border-red-400 rounded-md p-5 mt-2">
              <Text className="text-red-600 font-semibold mr-2">⚠️</Text>
              <Text className="text-red-700 font-medium">{error}</Text>
            </View>
          )}

          <TextInput
            placeholder="Suggest a guidance to your planner"
            placeholderTextColor="gray"
            className="mb-10 border border-gray-300 rounded p-2"
          />

          <View className="flex-row gap-10">
            {/* Start time */}
            <View>
              <DetachedData>Start:</DetachedData>
              <View className="flex-row justify-center items-center pt-5 gap-x-4 ml-5">
                {time && (
                  <Text>
                    {time.getHours().toString().padStart(2, "0")}:
                    {time.getMinutes().toString().padStart(2, "0")}
                  </Text>
                )}
                <Pressable onPress={() => setShow(true)}>
                  <View className="bg-blue-500 px-3 py-2 border border-blue-300 rounded-3xl">
                    <Text className="text-white">Timer</Text>
                  </View>
                </Pressable>
                {show && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={onChange}
                  />
                )}
              </View>
            </View>

            {/* Duration */}
            <View className="flex-1">
              <DetachedData>Duration:</DetachedData>
              <View className="flex-1 pt-3 gap-x-4 ml-5">
                <View className="border border-gray-300 rounded-lg overflow-hidden">
                  <Picker
                    selectedValue={duration}
                    onValueChange={(value) => setDuration(value)}
                    style={{ color: "black" }}
                  >
                    {durationOptions.map((minutes) => (
                      <Picker.Item
                        key={minutes}
                        label={`${Math.floor(minutes / 60)}h ${
                          minutes % 60 === 0 ? "" : minutes % 60 + "m"
                        }`}
                        value={minutes}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          {/* Kcal Goal */}
          <DetachedData>K/cal Goal:</DetachedData>
          <TextInput
            value={kcalGoal}
            onChangeText={(text) => setKcalGoal(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            placeholder="0"
            className={`border rounded p-2 mt-2 ${
              kcalError ? "border-red-500" : "border-gray-300"
            }`}
          />

          {/* Sport */}
          <DetachedData>Sport:</DetachedData>
          <View
            className={`border rounded-lg overflow-hidden bg-white mt-2 ${
              sportError ? "border-red-500" : "border-gray-300"
            }`}
          >
            <Picker
              selectedValue={sport}
              onValueChange={(itemValue) => setSport(itemValue)}
              style={{ color: "black" }}
            >
              <Picker.Item label="Select a sport..." value="" enabled={false} />
              {sports.map((s) => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>
          </View>

          <View className="border-b border-gray-200 mb-4" />

          {/* Buttons */}
          <View className="flex-row justify-center gap-5 pb-20">
            <Pressable
              onPress={() => router.back()}
              className="bg-gray-300 rounded-full p-3 w-32"
            >
              <Text className="text-black font-bold text-center">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleWorkoutCreate}
              className="bg-blue-500 rounded-full p-3 w-32 flex-row justify-center items-center"
              disabled={loading} // desabilita botão durante o carregamento
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center">Schedule</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
