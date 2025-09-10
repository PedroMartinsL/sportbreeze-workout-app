import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Activity, CalendarDays, Dumbbell, MapPin, Shield, Sunset, Umbrella, Volleyball, Wind } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function About() {
  return (
    <ScrollView className="flex-1 bg-[#d9f99d] px-6">

      {/* Header */}
      <View className="h-5" />
      <Text className="text-3xl font-extrabold text-[#0a0a0a]">Sportsbrezze</Text>
      <Text className="text-[#475569] mt-0.5">How it works</Text>

      {/*  Hero */}
      <View className="mt-4 rounded-3xl overflow-hidden border border-[#c5e1a5] bg-white">
        <LinearGradient
          colors={["rgba(12,12,12,0.9)", "rgba(12,12,12,0.75)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 18 }}
        >
          <View className="flex-row items-center">
            <View className="h-10 w-10 rounded-xl bg-white/10 items-center justify-center mr-3">
              <Sunset size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">AI + Weather = Consistency</Text>
              <Text className="text-white/80 text-xs">
                The right training on the right day, for 7 days ahead.
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2 mt-3">
            <Badge>AI-assisted</Badge>
            <Badge>7-day horizon</Badge>
            <Badge>Mobile-first</Badge>
          </View>
        </LinearGradient>

        <View className="px-5 pb-5 pt-3 bg-white">
          <Text className="text-[#0a0a0a] font-semibold text-base">
            What you’ll get
          </Text>
          <Text className="text-[#475569] text-sm mt-1">
            We combine your sport with the next 7-day forecast to build a simple, realistic plan that adapts to weather and your level.
          </Text>

          {/* FEATURE GRID  - Views desse Grid*/}
          <View className="mt-4 flex-row flex-wrap gap-3">
            <Feature
              icon={<CalendarDays size={18} color="#0a0a0a" />}
              title="Weekly planning"
              desc="Plan 7 days balancing training & rest."
            />
            <Feature
              icon={<Umbrella size={18} color="#0a0a0a" />}
              title="Daily weather"
              desc="Avoid heavy rain and extreme heat."
            />
            <Feature
              icon={<Wind size={18} color="#0a0a0a" />}
              title="Outdoor/indoor"
              desc="Run/Bike when good, Gym when not."
            />
            <Feature
              icon={<Dumbbell size={18} color="#0a0a0a" />}
              title="AI training"
              desc="Intensity tuned to your profile."
            />
            <Feature
              icon={<MapPin size={18} color="#0a0a0a" />}
              title="Base city"
              desc="Allow GPS or type your city."
            />
            <Feature
              icon={<Shield size={18} color="#0a0a0a" />}
              title="Privacy first"
              desc="You control location access."
            />
          </View>

          {/* Micro Status - Status*/}
          <View className="mt-4 flex-row justify-between">
            <Stat value="7" label="Days ahead" />
            <Stat value="1" label="Plan per user" />
            <Stat value="24h" label="Weather refresh" />
          </View>
        </View>
      </View>

      {/* Steps */}
      <View className="mt-4 rounded-2xl bg-white p-5 border border-[#c5e1a5]">
        <Text className="text-[#0a0a0a] font-semibold text-base">4 simple steps</Text>
        <View className="mt-3">
          <Step n={1} title="Choose your sport" desc="Running, Cycling, Trail, Gym, Walking, Swimming." />
          <Step n={2} title="Set your city" desc="Allow location or type it manually." />
          <Step n={3} title="Generate with AI" desc="A weekly plan tuned to weather & level." />
          <Step n={4} title="Adjust & save" desc="Edit intensity, days and favorite sessions." />
        </View>
      </View>

      {/* Supported Sports */}
      <View className="mt-4 rounded-2xl bg-white p-5 border border-[#c5e1a5]">
        <View className="flex-row items-center mb-2">
          <Volleyball size={18} color="#0a0a0a" />
          <Text className="ml-2 text-[#0a0a0a] font-semibold">Supported sports</Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          <Pill>Running</Pill>
          <Pill>Cycling</Pill>
          <Pill>Trail</Pill>
          <Pill>Gym</Pill>
          <Pill>Walking</Pill>
          <Pill>Swimming</Pill>
        </View>
      </View>

      {/* faq */}
      <View className="mt-4 rounded-2xl bg-white p-5 border border-[#c5e1a5]">
        <View className="flex-row items-center mb-2">
          <Activity size={18} color="#0a0a0a" />
          <Text className="ml-2 text-[#0a0a0a] font-semibold">FAQ</Text>
        </View>
        <FAQ
          q="Do I need location enabled?"
          a="No. You can type your city. If you allow GPS, we’ll auto-select it."
        />
        <FAQ
          q="Can I start without a backend?"
          a="Yes. Mock the forecast & plan first; plug real APIs later."
        />
        <FAQ
          q="Will it work offline?"
          a="You can still see your last generated plan. Weather sync needs internet."
        />
      </View>

      {/* Buttons (More Implemensts?) */}
      <View className="mt-5 mb-8">
        <Link href="/week" asChild>
          <TouchableOpacity className="w-full max-w-xs mx-auto bg-black py-3 rounded-xl">
            <Text className="text-white text-center font-semibold">View Week</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/" asChild>
          <TouchableOpacity className="mt-3 w-full max-w-xs mx-auto bg-white py-3 rounded-xl border border-[#c5e1a5]">
            <Text className="text-[#0a0a0a] text-center font-semibold">Back</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

/* Meus Components de cada quadrado  */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white/10 border border-white/20 px-2.5 py-1 rounded-full">
      <Text className="text-white text-[11px] font-semibold">{children}</Text>
    </View>
  );
}

function Feature({
  icon,
  title,
  desc,
}: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <View className="w-[48%] rounded-2xl bg-white p-3 border border-[#c5e1a5]">
      <View className="flex-row items-start">
        <View className="h-8 w-8 rounded-xl bg-[#d9f99d] items-center justify-center mr-3 border border-[#c5e1a5]">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-[#0a0a0a] font-semibold text-[13px]">{title}</Text>
          <Text className="text-[#475569] text-[11px] mt-0.5">{desc}</Text>
        </View>
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="items-center justify-center px-2">
      <Text className="text-[#0a0a0a] text-lg font-bold">{value}</Text>
      <Text className="text-[#475569] text-[11px] -mt-0.5">{label}</Text>
    </View>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <View className="flex-row items-start mb-3">
      <View className="h-6 w-6 rounded-full bg-black items-center justify-center mr-3">
        <Text className="text-white text-[12px] font-bold">{n}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[#0a0a0a] font-semibold">{title}</Text>
        <Text className="text-[#475569] text-xs mt-0.5">{desc}</Text>
      </View>
    </View>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <View className="px-3 py-1.5 rounded-full bg-white border border-[#c5e1a5]">
      <Text className="text-[#0a0a0a] text-xs font-semibold">{children}</Text>
    </View>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <View className="mb-3">
      <Text className="text-[#0a0a0a] font-semibold">{q}</Text>
      <Text className="text-[#475569] text-xs mt-1">{a}</Text>
    </View>
  );
}
