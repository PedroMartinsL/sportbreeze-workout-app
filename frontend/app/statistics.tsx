import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/services/api";
import { router, useNavigation } from "expo-router";
import Toast from "react-native-toast-message";

type Statistic = {
  id: number;
  user_id: number;
  kcal_burned: number | null;
  activity_checked: number | null;
};

export default function StatisticsScreen() {
  const { accessToken, role } = useAuthStore();
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Statistics",
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: "#4d7c0f",
      },
      headerTitleStyle: {
        color: "white",
        fontWeight: "800",
        fontSize: 20,
      },
      headerTintColor: "white",
    });

    if (accessToken && role !== "admin") {
      Toast.show({
        type: "error",
        text1: "Access Denied",
        text2: "Only admins can access this page",
      });
      router.back();
      return;
    }

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ecfccb" }}>
      <Toast />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>

        {/* 🔥 HEADER MODERNO */}
        <View
          style={{
            backgroundColor: "#4d7c0f",
            padding: 22,
            borderRadius: 20,
            marginBottom: 25,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "900", color: "white" }}>
            Admin Dashboard
          </Text>

          <Text style={{ fontSize: 16, marginTop: 6, color: "#f0fdf4" }}>
            User Statistics Overview
          </Text>

          <View
            style={{
              marginTop: 14,
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingVertical: 6,
              paddingHorizontal: 14,
              alignSelf: "flex-start",
              borderRadius: 30,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              {statistics.length} statistics loaded
            </Text>
          </View>
        </View>

        {/* 📊 LISTA DE CARDS ESTILIZADOS */}
        {statistics.map((stat) => {
          const ratio =
            stat.kcal_burned && stat.activity_checked && stat.activity_checked > 0
              ? (stat.kcal_burned / stat.activity_checked).toFixed(2)
              : "N/A";

          return (
            <View
              key={stat.id}
              style={{
                backgroundColor: "white",
                borderRadius: 18,
                padding: 20,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#d4e9c4",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 5,
                elevation: 3,
              }}
            >
              {/* Header do card */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
                <Text style={{ fontWeight: "800", fontSize: 18, color: "#14532d" }}>
                  User #{stat.user_id}
                </Text>
                <View
                  style={{
                    backgroundColor: "#bbf7d0",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontWeight: "600", color: "#14532d" }}>
                    Statistics
                  </Text>
                </View>
              </View>

              {/* Divisor */}
              <View style={{ height: 1, backgroundColor: "#e2f3d4", marginBottom: 14 }} />

              {/* Conteúdo dos dados */}
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 15, color: "#475569" }}>
                  <Text style={{ fontWeight: "700" }}>Kcal burned:</Text> {stat.kcal_burned ?? 0}
                </Text>

                <Text style={{ fontSize: 15, color: "#475569" }}>
                  ☑ <Text style={{ fontWeight: "700" }}>Activities checked:</Text> {stat.activity_checked ?? 0}
                </Text>

                <Text style={{ fontSize: 16, color: "#14532d", marginTop: 8, fontWeight: "800" }}>
                  ❚█══█❚      Kcal / Activity: {ratio}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Botão Voltar */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#1e293b",
            padding: 16,
            borderRadius: 14,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700", textAlign: "center", fontSize: 16 }}>
            Back
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
