import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/services/api";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

type Statistic = {
  id: number;
  user_id: number;
  workout_id: number | null;
  date: string;
  sport: string | null;
  duration: number | null;
  kcal_burned: number | null;
  distance: number | null;
  notes: string | null;
};

export default function StatisticsScreen() {
  const { accessToken, role, user } = useAuthStore();
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se é admin - Mas só redireciona se houver um token (usuário logado)
    if (accessToken && role !== "admin") {
      Toast.show({
        type: "error",
        text1: "Access Denied",
        text2: "Only admins can access this page",
      });
      router.back();
      return;
    }

    // Só busca estatísticas se estiver logado e for admin
    if (accessToken && role === "admin") {
      fetchStatistics();
    }
  }, [accessToken, role]);

  async function fetchStatistics() {
    try {
      setLoading(true);
      const data: Statistic[] = await apiFetch({
        path: "/statistics/",
        method: "GET",
        token: accessToken,
      });
      setStatistics(data);
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error loading statistics",
        text2: e.message || "Try again later",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#d9f99d" }}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{ marginTop: 10 }}>Loading statistics...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9f99d" }}>
      <Toast />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#0a0a0a" }}>Admin Panel</Text>
          <Text style={{ fontSize: 16, color: "#475569", marginTop: 4 }}>
            All User Statistics ({statistics.length} total)
          </Text>
        </View>

        {/* Statistics Cards */}
        {statistics.length === 0 ? (
          <View style={{ backgroundColor: "white", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "#c5e1a5" }}>
            <Text style={{ textAlign: "center", color: "#475569" }}>No statistics found</Text>
          </View>
        ) : (
          statistics.map((stat) => (
            <View
              key={stat.id}
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#c5e1a5",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontWeight: "700", fontSize: 16, color: "#0a0a0a" }}>
                  {stat.sport || "Unknown Sport"}
                </Text>
                <Text style={{ color: "#475569", fontSize: 12 }}>User #{stat.user_id}</Text>
              </View>

              <View style={{ marginBottom: 4 }}>
                <Text style={{ color: "#475569", fontSize: 14 }}>
                  📅 {new Date(stat.date).toLocaleDateString()}
                </Text>
              </View>

              {stat.duration && (
                <Text style={{ color: "#475569", fontSize: 14 }}>⏱️ Duration: {stat.duration} min</Text>
              )}
              {stat.kcal_burned && (
                <Text style={{ color: "#475569", fontSize: 14 }}>🔥 Calories: {stat.kcal_burned.toFixed(0)} kcal</Text>
              )}
              {stat.distance && (
                <Text style={{ color: "#475569", fontSize: 14 }}>📍 Distance: {stat.distance.toFixed(2)} km</Text>
              )}
              {stat.notes && (
                <Text style={{ color: "#64748b", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>
                  Note: {stat.notes}
                </Text>
              )}
            </View>
          ))
        )}

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#111827",
            padding: 14,
            borderRadius: 12,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
