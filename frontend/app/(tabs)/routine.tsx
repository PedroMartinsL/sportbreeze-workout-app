import { Link, useLocalSearchParams } from "expo-router";
import { User } from "lucide-react-native";
import React, { useState, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { apiFetch } from "@/services/api";
import { useLocationStore } from "@/store/location";
import { useAuthStore } from "@/store/auth";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import RoutineCell from "@/components/RoutineCell";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PlusLine from "@/components/PlusLine";
import { useWorkoutStore } from "@/store/workout";

export type Routine = {
  id: number;
  name: string;
  user_id: number;
};

export default function Routine() {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return (
      <View className="flex-1 bg-[#d9f99d] px-6 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 border border-[#c5e1a5]">
          <Text className="text-xl font-bold text-center mb-4">Login Required</Text>
          <Text className="text-center text-[#475569] mb-4">
            You need to be logged in to access your routines.
          </Text>
        </View>
      </View>
    );
  }

  const { coords, setCoords } = useLocationStore();
  const { setRoutine } = useWorkoutStore();

  const [locLoading, setLocLoading] = useState(false);
  const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
  const [routineName, setRoutineName] = useState("");
  const [loading, setLoading] = useState(false); // spinner

  // captura a localização e rotinas ao abrir a tela
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
          setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        } catch {
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
        isActive = false;
      };
    }, [accessToken])
  );

  async function handleCreateRoutine() {
    if (!coords.latitude || !coords.longitude) {
      Alert.alert("GPS", "Ainda não peguei sua localização. Tente novamente em 1–2s.");
      return;
    }

    if (!routineName.trim()) {
      Alert.alert("Nome da rotina", "Digite um nome válido para a rotina.");
      return;
    }

    setLoading(true);

    const payload = {
      name: routineName,
      location: coords,
    };

    try {
      const result = await apiFetch({
        path: "/routines/",
        method: "POST",
        body: payload,
        token: accessToken,
      });

      // adiciona a nova rotina à lista
      setUserRoutines((prev) => [result, ...prev]);
      setRoutineName("");

      Toast.show({
        type: "success",
        text1: "Routine created!",
        text2: `"${result.name}" added to your routines.`,
        visibilityTime: 2000,
        position: "top",
        topOffset: 50,
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 px-6">
      <Toast />
      <View className="h-28" />

      <View className="flex-row justify-between items-center mt-4 px-6">
        <Text className="text-2xl font-extrabold text-[#0a0a0a]">Sportsbreeze</Text>
        <Link href="/registration" asChild>
          <TouchableOpacity className="bg-black p-3 rounded-full">
            <User size={24} color="#ffffff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-4 rounded-2xl bg-white border border-[#c5e1a5] h-40">
        {userRoutines.length === 0 ? (
          <View className="p-4 items-center">
            <Text className="text-gray-500">No routines registered yet</Text>
          </View>
        ) : (
          <FlatList
            data={userRoutines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RoutineCell item={item} setRoutine={setRoutine} />}
            contentContainerStyle={{ paddingVertical: 8, flexGrow: 0 }}
            showsVerticalScrollIndicator={true}
          />
        )}
      </View>

      <PlusLine />

      <View className="px-4 flex justify-center items-center gap-y-2">
        {/* Input com ícone */}
        <View className="flex-row items-center border rounded-lg border-gray-700 mb-6 px-2">
          <MaterialIcons name="sports-volleyball" size={24} color="black" />
          <TextInput
            placeholder="Routine Name"
            placeholderTextColor="#888"
            value={routineName}
            onChangeText={setRoutineName}
            className="flex-1 py-2"
          />
        </View>

        {/* Botão com spinner */}
        <TouchableOpacity
          className="w-full max-w-xs mx-auto bg-blue-600 py-3 rounded-xl flex-row justify-center items-center"
          onPress={handleCreateRoutine}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">Schedule Workout</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="h-8" />
    </View>
  );
}
