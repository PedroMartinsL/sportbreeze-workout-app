// app/registration.tsx
import { router } from "expo-router";
import {
  Activity,
  Bike,
  Dumbbell,
  Footprints,
  Mountain,
  Waves,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/services/api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = typeof DAYS[number];
type Sport = "running" | "cycling" | "trail" | "gym" | "walking" | "swimming";

const SPORT_LABEL: Record<Sport, string> = {
  running: "Running",
  cycling: "Cycling",
  trail: "Trail",
  gym: "Gym",
  walking: "Walking",
  swimming: "Swimming",
};

const SPORT_LIST = [
  { value: "running", label: "Running", Icon: Activity },
  { value: "cycling", label: "Cycling", Icon: Bike },
  { value: "trail", label: "Trail", Icon: Mountain },
  { value: "gym", label: "Gym", Icon: Dumbbell },
  { value: "walking", label: "Walking", Icon: Footprints },
  { value: "swimming", label: "Swimming", Icon: Waves },
] as const;

export default function Registration() {
  const { logout, accessToken } = useAuthStore();

    const handleLogout = async () => {
      try {
        await logout();
        router.replace("/login");
        setTimeout(() => {
          Alert.alert("Logout", "Você saiu com sucesso!");
        }, 500);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível fazer logout");
      }
    };
  

  // IMPORTANTE: Todos os hooks devem ser chamados ANTES de qualquer early return
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    hoursPerDay: "",
    sports: ["running"] as Sport[],
    days: DAYS.reduce(
      (a, d) => ({ ...a, [d]: false }),
      {} as Record<Day, boolean>
    ),
  });

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  // Buscar perfil existente ao carregar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching existing profile...");
        const profile = await apiFetch({
          path: "/profile/",
          method: "GET",
          token: accessToken,
        });

        console.log("✅ Profile found:", profile);
        
        // Popular os campos com os dados existentes
        const sportsArray = profile.sports ? profile.sports.split(",") : ["running"];
        const daysArray = profile.available_days ? profile.available_days.split(",") : [];
        
        const daysObj = DAYS.reduce(
          (acc, day) => ({ ...acc, [day]: daysArray.includes(day) }),
          {} as Record<Day, boolean>
        );

        setForm({
          age: profile.age?.toString() || "",
          weight: profile.weight?.toString() || "",
          height: profile.height?.toString() || "",
          hoursPerDay: profile.hours_per_day?.toString() || "",
          sports: sportsArray as Sport[],
          days: daysObj,
        });

        setProfileExists(true);
      } catch (error: any) {
        console.log("ℹ️ No profile found (will create new):", error.message);
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken]);

  // Verifica se está logado - DEPOIS de todos os hooks
  if (!accessToken) {
    return (
      <View className="flex-1 bg-[#d9f99d] px-6 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 border border-[#c5e1a5]">
          <Text className="text-xl font-bold text-center mb-4">Login Required</Text>
          <Text className="text-center text-[#475569] mb-4">
            You need to be logged in to create your profile.
          </Text>
        </View>
      </View>
    );
  }

  // Mostrar loading enquanto busca o perfil
  if (loading) {
    return (
      <View className="flex-1 bg-[#d9f99d] justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-[#0a0a0a] font-semibold">Loading profile...</Text>
      </View>
    );
  }

  const toggleDay = (d: Day) =>
    setForm((f) => ({ ...f, days: { ...f.days, [d]: !f.days[d] } }));
  const toggleSport = (s: Sport) =>
    setForm((f) => ({
      ...f,
      sports: f.sports.includes(s)
        ? f.sports.filter((x) => x !== s)
        : [...f.sports, s],
    }));

  const save = async () => {
    console.log("🔵 Save button clicked!");

    const daysStr = DAYS.filter((d) => form.days[d]).join(",");
    const sportsStr = form.sports.join(",");

    const profileData = {
      age: parseInt(form.age) || 0,
      weight: parseFloat(form.weight) || 0,
      height: parseFloat(form.height) || 0,
      sports: sportsStr,
      available_days: daysStr,
      hours_per_day: parseInt(form.hoursPerDay) || 0,
    };

    console.log("📤 Sending profile data:", profileData);
    console.log("🔑 Token:", accessToken ? "EXISTS" : "MISSING");
    console.log(`📝 Mode: ${profileExists ? "UPDATE" : "CREATE"}`);

    try {
      // Se perfil existe, fazer PUT (update), senão POST (create)
      const method = profileExists ? "PUT" : "POST";
      const response = await apiFetch({
        path: "/profile/",
        method,
        body: profileData,
        token: accessToken || "",
      });

      console.log(`✅ Profile ${profileExists ? "updated" : "created"} successfully:`, response);

      // Redirecionar imediatamente para routine
      router.replace("/(tabs)/routine");
      
      // Mostrar mensagem depois do redirecionamento
      setTimeout(() => {
        Alert.alert(
          profileExists ? "Perfil atualizado! ✅" : "Perfil criado! ✅",
          profileExists 
            ? "Suas informações foram atualizadas com sucesso."
            : "Bem-vindo! Agora você pode criar sua rotina de treinos."
        );
      }, 500);
    } catch (error: any) {
      console.error(`❌ Error ${profileExists ? "updating" : "creating"} profile:`, error);
      Alert.alert("Erro", error.message || "Não foi possível salvar o perfil.");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#d9f99d] px-5"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="h-4" />
      <Text className="text-2xl font-extrabold text-[#0a0a0a]">
        Registration Portal
      </Text>
      <Text className="text-[#475569] mt-1">
        Fill in your profile to personalize your training.
      </Text>

      {[
        {
          k: "age",
          label: "Age",
          placeholder: "e.g., 22",
          props: { keyboardType: "numeric" as const, inputMode: "numeric" as const },
        },
        {
          k: "weight",
          label: "Weight (kg)",
          placeholder: "e.g., 70",
          props: { keyboardType: "numeric" as const, inputMode: "numeric" as const },
        },
        {
          k: "height",
          label: "Height (cm)",
          placeholder: "e.g., 175",
          props: { keyboardType: "numeric" as const, inputMode: "numeric" as const },
        },
        {
          k: "hoursPerDay",
          label: "Hours available per day",
          placeholder: "e.g., 2",
          props: { keyboardType: "numeric" as const, inputMode: "numeric" as const },
        },
      ].map((f) => (
        <Field key={f.k} label={f.label}>
          <TextInput
            value={(form as any)[f.k]}
            onChangeText={(v) => setForm({ ...form, [f.k]: v })}
            placeholder={f.placeholder}
            {...f.props}
            className="bg-white border border-[#c5e1a5] rounded-xl px-3 py-2"
          />
        </Field>
      ))}

      <Text className="text-[#0a0a0a] font-semibold mt-3">Sports</Text>
      <View className="flex-row flex-wrap gap-2 mt-2">
        {SPORT_LIST.map(({ value, label, Icon }) => {
          const sel = form.sports.includes(value as Sport);
          return (
            <Pressable
              key={String(value)}
              onPress={() => toggleSport(value as Sport)}
              className={`flex-row items-center gap-2 px-3 py-2 rounded-xl border border-[#c5e1a5] ${sel ? "bg-black" : "bg-white"
                }`}
            >
              <Icon size={16} color={sel ? "#fff" : "#0a0a0a"} />
              <Text
                className={`font-semibold ${sel ? "text-white" : "text-[#0a0a0a]"
                  }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="text-[#0a0a0a] font-semibold mt-3">Available days</Text>
      <View className="flex-row flex-wrap gap-2 mt-2">
        {DAYS.map((d) => {
          const sel = form.days[d];
          return (
            <Pressable
              key={d}
              onPress={() => toggleDay(d)}
              className={`px-3 py-2 rounded-xl border border-[#c5e1a5] ${sel ? "bg-black" : "bg-white"
                }`}
            >
              <Text
                className={`font-semibold ${sel ? "text-white" : "text-[#0a0a0a]"
                  }`}
              >
                {d}
              </Text>
            </Pressable>
          );
        })}
      </View>

        <View className="flex justify-center gap-5">
        <TouchableOpacity
          onPress={save}
          className="w-full max-w-xs mx-auto mt-5 bg-black py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">
            {profileExists ? "Update Profile" : "Save Profile"}
          </Text>
        </TouchableOpacity>

        {/* Botão Logout - Só aparece se estiver logado */}
        {accessToken && (
          <TouchableOpacity
            onPress={handleLogout}
            className="w-full max-w-xs mx-auto bg-red-600 py-3 rounded-xl mb-3"
          >
            <Text className="text-white text-center font-semibold">Logout</Text>
          </TouchableOpacity>
        )}
       </View>

      <View className="h-6" />
    </ScrollView>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-3">
      <Text className="text-[#0a0a0a] font-semibold mb-1">{label}</Text>
      {children}
    </View>
  );
}

