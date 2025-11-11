import { Link, useLocalSearchParams } from "expo-router";
import { User } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, Alert, FlatList, TextInput } from "react-native";
import * as Location from "expo-location";
import { apiFetch } from "@/services/api";
import { useLocationStore } from "@/store/location";
import { useAuthStore } from "@/store/auth";
import Toast from 'react-native-toast-message';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import RoutineCell from "@/components/RoutineCell";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PlusLine from "@/components/PlusLine";

export type Routine = {
  id: number;
  name: string;
  user_id: number;
};

export default function Routine() {
  const params = useLocalSearchParams<{
    name?: string;
    sport?: string;   // compat
    sports?: string;  // CSV ex: "running,cycling"
    days?: string;    // "Mon, Wed, Fri"
    hoursPerWeek?: string;
    hours?: string;   // compat
  }>();

  //get tokens for auth methods
  const { accessToken, user } = useAuthStore();

  // estado de localização 
  const { coords, setCoords } = useLocationStore();
  const [locLoading, setLocLoading] = useState(false);
  const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
  const [routineName, setRoutineName] = useState("");

  // captura a localização uma vez ao abrir a tela 
  useFocusEffect(
  useCallback(() => {
    let isActive = true;

    (async () => {
      try {
        setLocLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão de localização negada");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.LocationAccuracy.Balanced,
        });

        if (!isActive) return;

        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      } catch (e: any) {
        Alert.alert("Não foi possível obter a localização agora.");
      } finally {
        if (isActive) setLocLoading(false);
      }
    })();

    (async () => {
      if (accessToken) {
        try {
          const response = await apiFetch({
            path: "/routines/",
            method: "GET",
            token: accessToken,
          });

          if (!isActive) return;

          setUserRoutines(response.routines);
        } catch (e: any) {
          Toast.show({
            type: "error",
            text1: "Routines not found",
            text2: e.message || "Try again later",
          });
        }
      }
    })();

    return () => {
      isActive = false; // evita setState em tela desmontada
    };
  }, [accessToken])
);

  const name = params.name || "Athlete";

  async function handleCreateRoutine() {
    if (coords.lat == null || coords.lon == null) {
      Alert.alert("GPS", "Ainda não peguei sua localização. Tente novamente em 1–2s.");
      return;
    }

    const payload = {
      name: routineName,
      location: {
        latitude: coords.lat,
        longitude: coords.lon,
      }
    };

    try {
      const result = await apiFetch({
        path: "/routines/",
        method: "POST",
        body: payload,
        token: accessToken,
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error creating routine",
        text2: e.message || "Try again later",
        visibilityTime: 4000,
        position: "top",
        topOffset: 50,
      });
    }
  }

  return (
    <View className="flex-1  px-6">
      <Toast />
      <View className="h-40 " />
      <View className="flex-row justify-between items-center mt-4 px-6">
        {/* Título */}
        <Text className="text-2xl font-extrabold text-[#0a0a0a]">
          Sportsbreeze
        </Text>

        {/* Botão de perfil */}
        <Link href="/registration" asChild>
          <TouchableOpacity className="bg-black p-3 rounded-full">
            <User size={24} color="#ffffff" />
          </TouchableOpacity>
        </Link>
      </View>
      
      
      {/* Weeks */}
      <View className="mt-4 rounded-2xl bg-white border border-[#c5e1a5]">
        {userRoutines.length === 0 ? (
          <View className="p-4 items-center">
            <Text className="text-gray-500">No routines registered yet</Text>
          </View>
        ) : (
          <FlatList
            data={userRoutines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={RoutineCell}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}
      </View>

      <PlusLine/>

      <View className="px-4 flex justify-center items-center gap-y-2">

      {/* Input com ícone */}
      <View className="flex-row items-center border rounded-lg border-gray-700 mb-6 px-2">
        <MaterialIcons name="sports-volleyball" size={24} color="black" />
          <TextInput
            placeholder="Routine Name"
            placeholderTextColor="#888"
            value={routineName}
            onChangeText={setRoutineName}
            className="flex-1 text-white py-2"
          />
        </View>

        {/* Botão */}
        <TouchableOpacity
          className="w-full max-w-xs mx-auto bg-blue-600 py-3 rounded-xl"
          onPress={handleCreateRoutine}
        >
          <Text className="text-white text-center font-semibold">
            Schedule Workout
          </Text>
        </TouchableOpacity>
      </View>

      <View className="h-8" />
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2">
      <Text className="text-[#475569]">{label}</Text>
      <Text className="text-[#0a0a0a] font-semibold text-right">{value}</Text>
    </View>
  );
}
