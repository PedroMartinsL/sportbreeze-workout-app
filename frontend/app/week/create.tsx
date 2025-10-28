import { DetachedData } from "@/components/TaskCard";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import Toast from "react-native-toast-message";

export default function CreateTask() {

  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({
      title: "Schedule",
      headerStyle: { backgroundColor: "#f0f0f0" },
      headerTintColor: "#333",
      headerTitleAlign: "center"
    });
  }, [navigation]);

  const { accessToken } = useAuthStore();
  
  const params = useLocalSearchParams<{ 
    date_param?: string; 
    routine_id_param?: string; 
  }>();
  
  const router = useRouter();
  const [kcalGoal, setKcalGoal] = useState<string>("0");
  const [sport, setSport] = useState<string>("");
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(30);

  const [show, setShow] = useState(false);

  const sports = [
    "Swimming",
    "Running",
    "Cycling",
    "Hiking",
    "Walking",
    "Gym",
    "Marathon",
  ];

  async function handleWorkoutCreate() {
    const payload = {
      kcal: kcalGoal,
      sport: sport,
      hour: time,
      duration: duration,
      date: params.date_param,
      routine_id: params.routine_id_param
    }
    try {
      await apiFetch({ path: `/workouts/`, method: "POST", body: payload, token: accessToken})
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'We failed creating your routine',
        text2: e.message || 'Try again later',
      });
    }
    
    router.back()
  }

  const durationOptions = Array.from({ length: 12 }, (_, i) => (i + 1) * 30);

  const onChange = (event: any, selectedTime: Date | undefined) => {
    setShow(Platform.OS === "ios"); // mantém aberto no iOS
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <View className="flex-1 w-full py-10 px-5 gap-6 mb-4">
      <Toast />
      <ScrollView>
        <View className="mx-4 gap-5">
          <Text className="text-xl font-bold text-gray-500">Planner</Text>

          <View className="border-b border-gray-300 mb-4" />

          <TextInput
            placeholder="Sugest a guidance to your planner"
            placeholderTextColor="gray"
            className="mb-10"
          ></TextInput>

          <View className="flex-row gap-10">
            <View>
              <DetachedData>Start:</DetachedData>
              <View className="flex-row justify-center items-center pt-5 gap-x-4 ml-5">
                {time && (
                  <Text>
                    {time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
                <Pressable onPress={() => setShow(true)} >
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
                <View className="border border-gray-300 rounded-lg overflow-hidden ">
                  <Picker
                    selectedValue={duration}
                    onValueChange={(value) => setDuration(value)}
                    className="h-20"
                  >
                    {durationOptions.map((minutes) => (
                      <Picker.Item
                        key={minutes}
                        label={`${Math.floor(minutes / 60)}h ${minutes % 60 === 0 ? "" : (minutes % 60) + "m"}`}
                        value={minutes}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          <DetachedData>K/cal Goal:</DetachedData>
          <TextInput
            value={kcalGoal}
            onChangeText={(text) => {
              // only allow numerics
              const intText = text.replace(/[^0-9]/g, "");
              setKcalGoal(intText);
            }}
            keyboardType="numeric"
            placeholder="0"
            className="border border-gray-300 rounded p-2 mt-2"
          />

          <DetachedData>Sport:</DetachedData>
          <View className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <Picker
              selectedValue={sport}
              onValueChange={(itemValue) => setSport(itemValue)}
              className="bg-white"
            >
              <Picker.Item label="Select a sport..." value="" enabled={false} />
              {sports.map((sport) => (
                <Picker.Item key={sport} label={sport} value={sport} />
              ))}
            </Picker>
          </View>

          <View className="border-b border-gray-200 mb-4" />
          <View className="flex-row justify-center gap-5 pb-20">
            <Pressable
              onPress={() => router.back()}
              className="bg-gray-300 rounded-full p-3 w-32"
            >
              <Text className="text-black font-bold text-center">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleWorkoutCreate}
              className="bg-blue-500 rounded-full p-3 w-32"
            >
              <Text className="text-white text-center">Schedule</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
