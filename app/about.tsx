import { Link } from "expo-router";
import { CalendarDays, Dumbbell, MapPin, Umbrella, Wind } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function About() {
  return (
    <ScrollView className="flex-1 bg-[#d9f99d] px-6">
      <View className="h-4" />
      <Text className="text-3xl font-extrabold text-[#0a0a0a]">Sportsbrezze</Text>
      <Text className="text-[#475569] mt-1">How it works</Text>

      <View className="mt-4 rounded-2xl bg-white p-5 border border-[#c5e1a5]">
        <Text className="text-base text-[#0a0a0a] font-semibold">Right training on the right day</Text>
        <Text className="text-sm text-[#475569] mt-1">
          The app uses the next 7-day forecast + your sport to generate a simple and consistent routine.
        </Text>

        <View className="mt-4 space-y-3">
          <Item icon={<CalendarDays size={18} color="#0a0a0a" />} title="Weekly planning" desc="Organize 7 days with training and rest." />
          <Item icon={<Umbrella size={18} color="#0a0a0a" />} title="Daily weather" desc="Avoid heavy rain and extreme heat." />
          <Item icon={<Wind size={18} color="#0a0a0a" />} title="Outdoor or indoor" desc="Suggests run/bike when weather helps and gym when it doesn’t." />
          <Item icon={<Dumbbell size={18} color="#0a0a0a" />} title="AI training" desc="Adjusts intensity to your level." />
          <Item icon={<MapPin size={18} color="#0a0a0a" />} title="Base city" desc="Allow location or enter it manually." />
        </View>
      </View>

      <View className="mt-5">
        
        <Link href="/" asChild>
          <TouchableOpacity className="w-full max-w-xs mx-auto bg-black py-3 rounded-xl">
            <Text className="text-white text-center font-semibold">Back</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/week" asChild>
          <TouchableOpacity className="mt-3 w-full max-w-xs mx-auto bg-white py-3 rounded-xl border border-[#c5e1a5]">
            <Text className="text-[#0a0a0a] text-center font-semibold">View Week</Text>
          </TouchableOpacity>
        </Link>

      </View>
    </ScrollView>
  );
}

function Item({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <View className="flex-row">
      <View className="h-8 w-8 rounded-xl bg-[#d9f99d] items-center justify-center mr-3 border border-[#c5e1a5]">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-[#0a0a0a] font-semibold">{title}</Text>
        <Text className="text-[#475569] text-xs mt-0.5">{desc}</Text>
      </View>
    </View>
  );
}
