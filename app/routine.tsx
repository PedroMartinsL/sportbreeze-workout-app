import { Link, useLocalSearchParams } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      </View>

      {/* Weeks */}
      <View className="mt-4 rounded-2xl bg-white border border-[#c5e1a5]">
        <Link
          href={{
            pathname: "/week",
            params: {
              name,
              sports: sports.join(","),
              days: days.join(", "),
              hoursPerWeek: String(hoursPerWeek),
              week: "1",
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
