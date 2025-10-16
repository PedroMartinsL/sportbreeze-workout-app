import { Link, useLocalSearchParams } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import * as Location from "expo-location";
import { apiFetch } from "@/api";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const SPORT_LABEL: Record<string, string> = {
  running: "Running",
  cycling: "Cycling",
  trail: "Trail",
  gym: "Gym",
  walking: "Walking",
  swimming: "Swimming",
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

  // estado de localização 
  const [coords, setCoords] = useState<{ lat: number | null; lon: number | null }>({
    lat: null,
    lon: null,
  });
  const [locLoading, setLocLoading] = useState(false);

  // captura a localização uma vez ao abrir a tela 
  useEffect(() => {
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
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        console.log("Routine → GPS:", pos.coords.latitude, pos.coords.longitude);
      } catch (e: any) {
        console.warn("Erro ao obter localização:", e?.message ?? e);
        Alert.alert("Não foi possível obter a localização agora.");
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

  const name = params.name || "Athlete";

  // esportes: usa `sports` CSV; senão cai pro `sport`; senão running
  const sportsArr = (params.sports?.split(",").map(s => s.trim()).filter(Boolean) || [])
    .concat(!params.sports && params.sport ? [String(params.sport)] : [])
    .filter(Boolean);
  const sports = sportsArr.length ? sportsArr : ["running"];
  const sportsLabel = sports.map(s => SPORT_LABEL[s] || s).join(", ");

  // dias: parse da string, senão todos os dias
  const days =
    params.days?.split(",").map(d => d.trim()).filter(Boolean) || [...ALL_DAYS];

  // horas/semana: lê hoursPerWeek ou hours
  const hoursPerWeek = Number(params.hoursPerWeek ?? params.hours ?? 5) || 5;

  return (
    <ScrollView className="flex-1 bg-[#d9f99d] px-6">
      <View className="h-5" />
      <Text className="text-2xl font-extrabold text-[#0a0a0a]">Sportsbreeze</Text>
      <Text className="text-[#475569] mt-1">Hello {name}</Text>

      {/* Resumo */}
      <View className="mt-4 rounded-2xl bg-white border border-[#c5e1a5] p-4">
        <Row label="Sports" value={sportsLabel} />
        <Row label="Days" value={days.join(", ")} />
        <Row label="Hours / week" value={`${hoursPerWeek} h`} />
        {/*status do GPS */}
        <Row
          label="GPS"
          value={
            locLoading
              ? "Obtendo localização..."
              : coords.lat != null && coords.lon != null
              ? `Lat: ${coords.lat.toFixed(6)} · Lon: ${coords.lon.toFixed(6)}`
              : "Sem coordenadas"
          }
        />
      </View>

      {/* Weeks */}
      <View className="mt-4 rounded-2xl bg-white border border-[#c5e1a5]">
        <Link
          href={{
            pathname: "/week",
            params: {
              routine_id_param: 67,
            },
          }}
          asChild
        >
          <TouchableOpacity className="py-4 px-4 flex-row items-center justify-between">
            <Text className="text-[#0a0a0a] font-medium">Week 1</Text>
            <ChevronRight size={18} color="#0a0a0a" />
          </TouchableOpacity>
        </Link>

        <View className="h-px bg-[#e5e7eb]" />

        <TouchableOpacity className="py-4 px-4 flex-row items-center justify-between" disabled>
          <Text className="text-[#0a0a0a]/60 font-medium">Week 2</Text>
          <ChevronRight size={18} color="#0a0a0a" />
        </TouchableOpacity>
      </View>

      {/* Atualizando: botão que usa latitude/longitude do useState */}
      <TouchableOpacity
        className="mt-6 w-full max-w-xs mx-auto bg-blue-600 py-3 rounded-xl"
        onPress={async () => {
          if (coords.lat == null || coords.lon == null) {
            Alert.alert("GPS", "Ainda não peguei sua localização. Tente novamente em 1–2s.");
            return;
          }

          const payload = {
            routine: {
              name: "Fiction Train for Woman - Pink October", // por um text para a pessoa por o nome ela mesma na rotina
              user_id: 1,
            },
            location: {
              latitude: coords.lat,
              longitude: coords.lon,
            },
            profile: {
              sports: "Running, Marathon",
              peso: "43 kg",
              altura: "1,57",
              frequency: "run all Sundays and thursdays",
            },
          };

          try {
            const result = await apiFetch("/routines/", "POST", payload as any);
            console.log("Workout criado:", result);
            alert(`routine criado: ${result.name}`);
          } catch (err: any) {
            console.error(err);
            alert(`Erro ao criar routine: ${err.message}`);
          }
        }}
      >
        <Text className="text-white text-center font-semibold">Criar Workout (GPS)</Text>
      </TouchableOpacity>

      {/* CTA opcional */}
      <Link href="/registration" asChild>
        <TouchableOpacity className="mt-6 w-full max-w-xs mx-auto bg-black py-3 rounded-xl">
          <Text className="text-white text-center font-semibold">Edit profile</Text>
        </TouchableOpacity>
      </Link>

      <View className="h-8" />
    </ScrollView>
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
