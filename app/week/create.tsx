import { DetachedData } from "@/components/TaskCard";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Button,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateTask() {
  const [kcalValue, setValue] = useState<string>("0");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState(30);

  const sports = [
    "Swimming",
    "Running",
    "Cycling",
    "Hiking",
    "Walking",
    "Gym",
    "Marathon",
  ];

  const durationOptions = Array.from({ length: 12 }, (_, i) => (i + 1) * 30);

  const onChange = (event: any, selectedTime: Date | undefined) => {
    setShow(Platform.OS === "ios"); // mantém aberto no iOS
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <View className="w-full py-10 px-5 gap-4">
      <Text className="text-4xl font-bold">Create Task</Text>
      <View className="mx-4 gap-4">
        <Text className="font-bold">Planner</Text>

        <View className="border-b border-gray-300 mb-4" />

        <TextInput
          placeholder="Sugest a guidance to your planner"
          placeholderTextColor="gray"
        ></TextInput>

        <DetachedData>Start:</DetachedData>
        <View>
          <Button title="Select Start Time" onPress={() => setShow(true)} />
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
        {time && <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}

        <DetachedData>Duration:</DetachedData>
        {/* Duration */}
        <View>
          <Text className="mb-2 text-gray-700 font-semibold">Duration:</Text>
          <View className="border border-gray-300 rounded-lg overflow-hidden">
            <Picker
              selectedValue={duration}
              onValueChange={(value) => setDuration(value)}
              className="h-12"
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

        <DetachedData>K/cal Goal:</DetachedData>
        <TextInput
          value={kcalValue}
          onChangeText={(text) => {
            // only allow numerics
            const intText = text.replace(/[^0-9]/g, "");
            setValue(intText);
          }}
          keyboardType="numeric"
          placeholder="0"
          className="border border-gray-300 rounded p-2 mt-2"
        />

        <DetachedData>Sport:</DetachedData>
        <View className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <Picker
            selectedValue={selectedSport}
            onValueChange={(itemValue) => setSelectedSport(itemValue)}
            className="bg-white"
          >
            <Picker.Item label="Select a sport..." value="" enabled={false} />
            {sports.map((sport) => (
              <Picker.Item key={sport} label={sport} value={sport} />
            ))}
          </Picker>
        </View>
        {selectedSport !== "" && (
          <Text className="mt-2 text-gray-600">Selected: {selectedSport}</Text>
        )}

        <View className="border-b border-gray-200 mb-4" />
        <View className="flex-row justify-center gap-5">
          <Pressable
            onPress={() => console.log("Cancel pressed")}
            className="bg-gray-300 rounded-full p-3 w-32"
          >
            <Text className="text-black font-bold text-center">Cancel</Text>
          </Pressable>

          <Pressable
            onPress={() => console.log("Schedule pressed")}
            className="bg-blue-500 rounded-full p-3 w-32"
          >
            <Text className="text-white text-center">Schedule</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
