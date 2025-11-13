import { View, Text, FlatList, Dimensions, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth";
import { requestNotificationPermission } from "@/utils/requestNotificationPermission";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const sports = [
  { id: "1", name: "Swimming", color: "#a5f3fc", icon: "swim" },
  { id: "2", name: "Running", color: "#fef08a", icon: "run" },
  { id: "3", name: "Cycling", color: "#6ee7b7", icon: "bike" },
  { id: "4", name: "Hiking", color: "#fca5a5", icon: "hiking" },
  { id: "5", name: "Walking", color: "#fbbf24", icon: "walk" },
  { id: "6", name: "Gym", color: "#c084fc", icon: "dumbbell" },
  { id: "7", name: "Marathon", color: "#60a5fa", icon: "run-fast" },
];

const cardColors = ["#dcfce7", "#bbf7d0", "#86efac"];

export default function Home() {
  // tenta restaurar a sessão
  const { initAuth, loading, user, login, logout, accessToken } = useAuthStore();

  useEffect(() => {
    initAuth(); 
    requestNotificationPermission();
  }, [initAuth]);


  return (
    <View className="flex-1 bg-[#d9f99d] px-6 pt-10">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="items-center justify-center mb-20 mt-4">
          {/* Container da logo maior */}
          <View className="rounded-xl border-[#c5e1a5] items-center justify-center">
            <Image
              source={require("../../assets/images/Sportsbreeze-logo-1.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </View>

          {/* Subheading */}
          <Text className="text-[#334155] text-center mb-8 px-4 text-base">
            AI-powered training routine based on the next 7 days of local weather. Get personalized recommendations for outdoor sports!
          </Text>
        </View> {/* <- FECHOU O HEADER VIEW */}

        {/* Ações: Login / Registro */}
        <View className="flex-row justify-center mb-6">
          {!accessToken ? (
            <>
              <TouchableOpacity
                onPress={() => router.push("/login")}
                className="bg-black px-6 py-3 rounded-xl mr-3"
              >
                <Text className="text-white font-bold text-base">Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/register")}
                className="bg-white px-6 py-3 rounded-xl border border-gray-300"
              >
                <Text className="text-black font-bold text-base">Criar conta</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="bg-green-100 px-6 py-3 rounded-xl border border-green-300">
              <Text className="text-green-800 font-bold text-base">✓ Logged In</Text>
            </View>
          )}
        </View>

        {/* Horizontal Sports Carousel */}
        <View className="mb-10 border border-black rounded-xl">
          <FlatList
            data={sports}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: width * 0.24,
                  height: width * 0.5,
                  marginRight: 15,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                }}
              >
                <MaterialCommunityIcons
                  name={item.icon as
                    | "swim"
                    | "run"
                    | "bike"
                    | "hiking"
                    | "walk"
                    | "dumbbell"
                    | "run-fast"}
                  size={32}
                  color="#000"
                  style={{ marginBottom: 6 }}
                />
                <Text style={{ color: "#000", fontWeight: "600", fontSize: 16 }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Ações: Login / Registro Repetido */}
        {!accessToken && (
          <View className="flex-row justify-center mb-10">
            <TouchableOpacity
              onPress={() => router.push("/login")}
              className="bg-black px-6 py-3 rounded-xl mr-3"
            >
              <Text className="text-white font-bold text-base">Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/register")}
              className="bg-white px-6 py-3 rounded-xl border border-gray-300"
            >
              <Text className="text-black font-bold text-base">Sign up</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Promotional Cards */}
        {cardColors.map((color, index) => (
          <View
            key={index}
            style={{
              backgroundColor: color,
              borderRadius: 20,
              padding: 18,
              marginBottom: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 4,
            }}
          >
            <Text className="text-black font-bold text-lg mb-2">
              {index === 0 && "Check Weather, Stay Active"}
              {index === 1 && "Plan Ahead"}
              {index === 2 && "Safe & Fun"}
            </Text>
            <Text className="text-gray-700 text-sm">
              {index === 0 &&
                "Sportsbreeze helps you find the best outdoor activities based on local weather conditions. Never miss a perfect day to train!"}
              {index === 1 &&
                "Schedule your workouts ahead of time and get AI-powered recommendations for optimal performance."}
              {index === 2 &&
                "Ensure your outdoor training is safe and enjoyable by analyzing weather conditions before you start."}
            </Text>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}