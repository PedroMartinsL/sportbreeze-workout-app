import { Link } from "expo-router";
import { CalendarDays, Dumbbell, MapPin, Umbrella, Wind } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function About() {
  return (
    <ScrollView className="flex-1 bg-[#d9f99d] px-6">
      <View className="h-4" />
      <Text className="text-3xl font-extrabold text-[#0a0a0a]">Sportsbrezze</Text>
      <Text className="text-[#475569] mt-1">Como funciona</Text>

      <View className="mt-4 rounded-2xl bg-white p-5 border border-[#c5e1a5]">
        <Text className="text-base text-[#0a0a0a] font-semibold">Treino certo no dia certo</Text>
        <Text className="text-sm text-[#475569] mt-1">
          O app usa a previsão dos próximos 7 dias + o seu esporte para gerar uma rotina simples e consistente.
        </Text>

        <View className="mt-4 space-y-3">
          <Item icon={<CalendarDays size={18} color="#0a0a0a" />} title="Planejamento semanal" desc="Organize os 7 dias com treino e descanso." />
          <Item icon={<Umbrella size={18} color="#0a0a0a" />} title="Clima por dia" desc="Evite chuva forte e calor extremo." />
          <Item icon={<Wind size={18} color="#0a0a0a" />} title="Outdoor ou indoor" desc="Sugere corrida/bike quando o clima ajuda e academia quando não." />
          <Item icon={<Dumbbell size={18} color="#0a0a0a" />} title="IA de treino" desc="Ajusta intensidade ao seu nível." />
          <Item icon={<MapPin size={18} color="#0a0a0a" />} title="Cidade base" desc="Permita localização ou digite manualmente." />
        </View>
      </View>

      <View className="mt-5">
        <Link href="/" asChild>
          <Pressable className="w-full max-w-xs mx-auto bg-black py-3 rounded-xl">
            <Text className="text-white text-center font-semibold">Voltar</Text>
          </Pressable>
        </Link>

        <Link href="/week" asChild>
          <Pressable className="mt-3 w-full max-w-xs mx-auto bg-white py-3 rounded-xl border border-[#c5e1a5]">
            <Text className="text-[#0a0a0a] text-center font-semibold">Ver Semana</Text>
          </Pressable>
        </Link>
      </View>

      <View className="h-8" />
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
