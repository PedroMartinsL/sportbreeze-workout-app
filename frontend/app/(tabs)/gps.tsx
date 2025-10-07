import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";

export default function GPSScreen() {
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({});
  const [isWatching, setIsWatching] = useState(false);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  // Inicia o monitoramento contínuo
  async function startWatch() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permissão de localização negada.");
      return;
    }

    setIsWatching(true);

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.Balanced,
        timeInterval: 3000, // atualiza a cada 3s
        distanceInterval: 5, // ou a cada 5m
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        setCoords({ lat: latitude, lon: longitude });
        console.log("GPS (watch) →", latitude, longitude);
      }
    );
  }

  // Para o monitoramento
  function stopWatch() {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
      console.log("GPS Watch parado.");
    }
    setIsWatching(false);
  }

  // Limpa o watcher ao sair da tela
  useEffect(() => {
    return () => stopWatch();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
      <View className="bg-[#f0fdf4] rounded-2xl p-6 shadow-md border border-[#a3e635]">
        <Text className="text-2xl font-extrabold text-center mb-4 text-[#14532d]">
          GPS Tracking
        </Text>

        <Text className="text-center text-gray-700 mb-6">
          Clique em <Text style={{ fontWeight: "bold" }}>Iniciar Watch</Text> para acompanhar sua
          localização em tempo real.
        </Text>

        {/* Coordenadas atuais */}
        {coords.lat && coords.lon ? (
          <View className="bg-white p-4 rounded-xl mb-6 border border-gray-200">
            <Text className="text-center text-black font-semibold">
              Latitude: {coords.lat.toFixed(6)}
            </Text>
            <Text className="text-center text-black font-semibold">
              Longitude: {coords.lon.toFixed(6)}
            </Text>
          </View>
        ) : (
          <Text className="text-center text-gray-500 mb-6">Sem dados de GPS ainda.</Text>
        )}

        {/* Botões */}
        <View className="flex-row justify-center">
          {!isWatching ? (
            <TouchableOpacity
              onPress={startWatch}
              className="bg-black px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold text-base">Iniciar Watch</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={stopWatch}
              className="bg-white px-6 py-3 rounded-xl border border-gray-400"
            >
              <Text className="text-black font-bold text-base">Parar Watch</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
