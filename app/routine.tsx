import { Link, useLocalSearchParams } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Routine() {
  // Recebe o que veio da minha registration (Cadastro de usuario - name e sport)
  const { name = "Athlete", sport = "running" } =
    useLocalSearchParams<{ name?: string; sport?: string }>();

  return (
    <ScrollView className="flex-1 bg-[#d9f99d] px-6">
      <View className="h-5" />
      <Text className="text-2xl font-extrabold text-[#0a0a0a]">Sportsbrezze</Text>
      <Text className="text-[#475569] mt-1">
        Hello {String(name)} — sport: {String(sport)}
      </Text>

      {/* Card com as semanas */}
      <View className="mt-4 rounded-2xl bg-white border border-[#c5e1a5] p-2">
        {/* Week 1 */}
        <Link
          href={{ pathname: "/week", params: { name, sport, week: "1" } }}
          asChild
        >
          <TouchableOpacity className="py-4 px-3 flex-row items-center justify-between">
            <Text className="text-[#0a0a0a] font-medium">Week 1</Text>
            <ChevronRight size={18} color="#0a0a0a" />
          </TouchableOpacity>
        </Link>
        <View className="h-px bg-[#e5e7eb]" />

        {/* Week 2 (placeholder) */}
        <TouchableOpacity className="py-4 px-3 flex-row items-center justify-between" disabled>
          <Text className="text-[#0a0a0a]/60 font-medium">Week 2</Text>
          <ChevronRight size={18} color="#0a0a0a" />
        </TouchableOpacity>
      </View>

      {/* CTA inferior */}
      <Link href="/registration" asChild>
        <TouchableOpacity className="mt-6 w-full max-w-xs mx-auto bg-black py-3 rounded-xl">
          <Text className="text-white text-center font-semibold">Schedule activities</Text>
        </TouchableOpacity>
      </Link>

      <View className="h-8" />
    </ScrollView>
  );
}
