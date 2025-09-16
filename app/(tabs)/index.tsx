import { View, Text, FlatList, Dimensions, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";

const { width } = Dimensions.get("window");

const sports = [
  { id: "1", name: "Running", color: "#bbf7d0" },
  { id: "2", name: "Cycling", color: "#86efac" },
  { id: "3", name: "Tennis", color: "#4ade80" },
  { id: "4", name: "Soccer", color: "#22c55e" },
  { id: "5", name: "Yoga", color: "#16a34a" },
];

const cardColors = ["#dcfce7", "#bbf7d0", "#86efac"];

export default function Home() {
  return (
    <View className="flex-1 bg-[#d9f99d] px-6 pt-10">
      {/* Usamos apenas um ScrollView para todo o conteúdo */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View className="flex-row items-center justify-center mb-6 mt-4">
          <View className="h-12 w-12 rounded-xl bg-white border border-[#c5e1a5] items-center justify-center mr-3">
            <Image
              source={require("../../assets/images/Sportsbreeze-logo-1.png")}
              style={{ width: 45, height: 45 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-[#0a0a0a] text-3xl font-extrabold">Sportsbreeze</Text>
        </View>

        {/* Subheading */}
        <Text className="text-[#334155] text-center mb-8 px-4 text-base">
          AI-powered training routine based on the next 7 days of local weather. Get personalized recommendations for outdoor sports!
        </Text>

        {/* Horizontal Sports Carousel */}
        <FlatList
          data={sports}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: item.color,
                width: width * 0.38,
                height: width * 0.22,
                marginRight: 15,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-black font-semibold text-lg">{item.name}</Text>
            </TouchableOpacity>
          )}
        />

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
